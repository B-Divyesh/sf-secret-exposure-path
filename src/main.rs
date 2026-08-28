use clap::{Args, Parser, Subcommand};
use secret_exposure_path::{load_allowlist, render_human, Allowlist, Report, Trace, EXPOSURE_EXIT};
use std::ffi::OsString;
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode};

#[derive(Parser)]
#[command(name = "sep", version, about = "Trace secrets before they escape into diffs, logs, or artifacts", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Run a command, redact its output, and trace declared sinks
    Run(RunArgs),
    /// Scan existing files or directories without running a command
    Inspect(InspectArgs),
    /// Run the bundled sample in an isolated temporary workspace
    Demo(DemoArgs),
}

#[derive(Args)]
struct DemoArgs {
    /// Print one JSON report to stdout
    #[arg(long)]
    json: bool,
}

#[derive(Args)]
struct CommonArgs {
    /// Dotenv or text file containing source credentials (repeatable)
    #[arg(long = "source", value_name = "PATH")]
    sources: Vec<PathBuf>,

    /// Environment variable to trace (repeatable)
    #[arg(long = "from-env", value_name = "NAME")]
    env_names: Vec<String>,

    /// Print one JSON report to stdout
    #[arg(long)]
    json: bool,

    /// Configuration file with fingerprint/path allowlists
    #[arg(long, default_value = ".seppath.toml")]
    config: PathBuf,

    /// Ignore a 12-character fingerprint (repeatable)
    #[arg(long = "allow-fingerprint", value_name = "FINGERPRINT")]
    allow_fingerprints: Vec<String>,

    /// Ignore sinks whose path contains this text (repeatable)
    #[arg(long = "allow-path", value_name = "PATH")]
    allow_paths: Vec<String>,
}

#[derive(Args)]
struct RunArgs {
    #[command(flatten)]
    common: CommonArgs,

    /// File or directory produced by the command (repeatable)
    #[arg(long = "output", short = 'o', value_name = "PATH")]
    outputs: Vec<PathBuf>,

    /// Do not inspect staged and unstaged Git diffs
    #[arg(long)]
    no_git: bool,

    /// Command and arguments to execute (place after --)
    #[arg(required = true, trailing_var_arg = true, allow_hyphen_values = true)]
    command: Vec<OsString>,
}

#[derive(Args)]
struct InspectArgs {
    #[command(flatten)]
    common: CommonArgs,

    /// Existing sink file or directory to inspect (repeatable)
    #[arg(long = "input", short = 'i', required = true, value_name = "PATH")]
    inputs: Vec<PathBuf>,
}

fn main() -> ExitCode {
    match execute(Cli::parse()) {
        Ok(code) => ExitCode::from(code as u8),
        Err(message) => {
            eprintln!("sep: {message}");
            ExitCode::from(2)
        }
    }
}

fn execute(cli: Cli) -> Result<i32, String> {
    match cli.command {
        Commands::Run(args) => run(args),
        Commands::Inspect(args) => inspect(args),
        Commands::Demo(args) => demo(args),
    }
}

fn demo(args: DemoArgs) -> Result<i32, String> {
    let workspace = demo_workspace()?;
    let source = workspace.join("source.env");
    let artifact_dir = workspace.join("dist");
    let artifact = artifact_dir.join("release.log");
    std::fs::create_dir(&artifact_dir)
        .map_err(|error| format!("could not create demo output directory: {error}"))?;
    std::fs::write(&source, include_str!("../examples/demo.env"))
        .map_err(|error| format!("could not write demo source: {error}"))?;
    std::fs::write(&artifact, include_str!("../examples/release-output.txt"))
        .map_err(|error| format!("could not write demo artifact: {error}"))?;

    let mut trace = Trace::new(Allowlist::default());
    trace.add_source_file(&source)?;
    trace.scan_path(&artifact, "sep demo")?;
    let report = trace.report(Some("sep demo".to_string()));

    if args.json {
        eprintln!("Demo workspace: {}", workspace.display());
    } else {
        println!("Demo — bundled sample data in a temporary workspace");
        println!("Sample workspace: {}\n", workspace.display());
    }
    print_report(&report, args.json)?;
    Ok(0)
}

fn demo_workspace() -> Result<PathBuf, String> {
    let root = std::env::temp_dir();
    let process = std::process::id();
    for attempt in 0..1000 {
        let path = root.join(format!("secret-exposure-path-demo-{process}-{attempt}"));
        match std::fs::create_dir(&path) {
            Ok(()) => return Ok(path),
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => continue,
            Err(error) => return Err(format!("could not create demo workspace: {error}")),
        }
    }
    Err("could not create a unique demo workspace".to_string())
}

fn trace_from(common: &CommonArgs) -> Result<Trace, String> {
    let mut allowlist = load_allowlist(&common.config)?;
    allowlist
        .fingerprints
        .extend(common.allow_fingerprints.iter().cloned());
    allowlist.paths.extend(common.allow_paths.iter().cloned());
    validate_fingerprints(&allowlist)?;

    let mut trace = Trace::new(allowlist);
    for source in &common.sources {
        trace.add_source_file(source)?;
    }
    for name in &common.env_names {
        trace.add_env(name)?;
    }
    Ok(trace)
}

fn validate_fingerprints(allowlist: &Allowlist) -> Result<(), String> {
    for fingerprint in &allowlist.fingerprints {
        if fingerprint.len() != 12 || !fingerprint.bytes().all(|byte| byte.is_ascii_hexdigit()) {
            return Err(format!(
                "allowlisted fingerprint {fingerprint:?} must be 12 hexadecimal characters"
            ));
        }
    }
    Ok(())
}

fn run(args: RunArgs) -> Result<i32, String> {
    let mut trace = trace_from(&args.common)?;
    let raw_display_command = args
        .command
        .iter()
        .map(|part| part.to_string_lossy())
        .collect::<Vec<_>>()
        .join(" ");
    trace.scan_text("command:arguments", "preflight", &raw_display_command);
    let display_command = trace.redact(&raw_display_command);
    if trace.has_findings() {
        let report = trace.report(Some(display_command));
        print_report(&report, args.common.json)?;
        return Ok(EXPOSURE_EXIT);
    }
    let program = args
        .command
        .first()
        .ok_or_else(|| "a command is required after --".to_string())?;
    let result = Command::new(program)
        .args(&args.command[1..])
        .output()
        .map_err(|error| format!("could not start {}: {error}", program.to_string_lossy()))?;

    let stdout = String::from_utf8_lossy(&result.stdout);
    let stderr = String::from_utf8_lossy(&result.stderr);
    trace.scan_text("command:stdout", &display_command, &stdout);
    trace.scan_text("command:stderr", &display_command, &stderr);
    for output in &args.outputs {
        trace.scan_path(output, &display_command)?;
    }
    if !args.no_git {
        trace.scan_git_diffs(Path::new("."), &display_command);
    }

    let redacted_stdout = trace.redact(&stdout);
    let redacted_stderr = trace.redact(&stderr);
    if args.common.json {
        io::stderr()
            .write_all(redacted_stdout.as_bytes())
            .map_err(write_error)?;
    } else {
        io::stdout()
            .write_all(redacted_stdout.as_bytes())
            .map_err(write_error)?;
    }
    io::stderr()
        .write_all(redacted_stderr.as_bytes())
        .map_err(write_error)?;

    let report = trace.report(Some(display_command));
    print_report(&report, args.common.json)?;
    if !report.findings.is_empty() {
        Ok(EXPOSURE_EXIT)
    } else {
        Ok(result.status.code().unwrap_or(1))
    }
}

fn inspect(args: InspectArgs) -> Result<i32, String> {
    let mut trace = trace_from(&args.common)?;
    for input in &args.inputs {
        if !input.exists() {
            return Err(format!("input {} does not exist", input.display()));
        }
        trace.scan_path(input, "inspect")?;
    }
    let report = trace.report(None);
    print_report(&report, args.common.json)?;
    Ok(if report.findings.is_empty() {
        0
    } else {
        EXPOSURE_EXIT
    })
}

fn print_report(report: &Report, json: bool) -> Result<(), String> {
    if json {
        serde_json::to_writer_pretty(io::stdout().lock(), report)
            .map_err(|error| format!("could not write JSON report: {error}"))?;
        println!();
    } else {
        print!("{}", render_human(report));
    }
    Ok(())
}

fn write_error(error: io::Error) -> String {
    format!("could not write command output: {error}")
}
