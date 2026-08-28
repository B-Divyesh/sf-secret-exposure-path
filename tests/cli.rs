use serde_json::Value;
use std::fs;
use std::process::Command;

fn sep() -> Command {
    Command::new(env!("CARGO_BIN_EXE_sep"))
}

#[test]
fn traces_seeded_paths_and_never_prints_the_value() {
    let dir = tempfile::tempdir().unwrap();
    let source = dir.path().join("source.env");
    let artifact = dir.path().join("artifact.log");
    let secret = "seeded-path-value-9347";
    fs::write(&source, format!("DEPLOY_SECRET={secret}\n")).unwrap();

    let result = sep()
        .current_dir(dir.path())
        .args(["run", "--json", "--no-git", "--source"])
        .arg(&source)
        .args(["--output"])
        .arg(&artifact)
        .args(["--", "sh", "-c"])
        .arg(format!(
            ". '{}'; printf '%s\\n' \"$DEPLOY_SECRET\" > '{}'; printf '%s\\n' \"$DEPLOY_SECRET\"",
            source.display(),
            artifact.display()
        ))
        .output()
        .unwrap();

    assert_eq!(result.status.code(), Some(10));
    let stdout = String::from_utf8(result.stdout).unwrap();
    let stderr = String::from_utf8(result.stderr).unwrap();
    assert!(!stdout.contains(secret));
    assert!(!stderr.contains(secret));
    let report: Value = serde_json::from_str(&stdout).unwrap();
    assert_eq!(report["summary"]["traced"], 2);
    let sinks: Vec<_> = report["findings"]
        .as_array()
        .unwrap()
        .iter()
        .map(|item| item["sink"].as_str().unwrap())
        .collect();
    assert!(sinks.contains(&"command:stdout"));
    assert!(sinks.contains(&artifact.to_str().unwrap()));
}

#[test]
fn reports_a_git_diff_path() {
    let dir = tempfile::tempdir().unwrap();
    let secret = "seeded-git-value-7788";
    fs::write(
        dir.path().join("source.env"),
        format!("API_SECRET={secret}\n"),
    )
    .unwrap();
    fs::write(dir.path().join("tracked.txt"), "safe\n").unwrap();
    for args in [
        ["init"].as_slice(),
        ["add", "tracked.txt"].as_slice(),
        [
            "-c",
            "user.name=Test",
            "-c",
            "user.email=test@example.test",
            "commit",
            "-m",
            "seed",
        ]
        .as_slice(),
    ] {
        assert!(Command::new("git")
            .args(args)
            .current_dir(dir.path())
            .output()
            .unwrap()
            .status
            .success());
    }

    let result = sep()
        .current_dir(dir.path())
        .args(["run", "--json", "--source", "source.env", "--", "sh", "-c"])
        .arg(". ./source.env; printf 'safe\\n%s\\n' \"$API_SECRET\" > tracked.txt")
        .output()
        .unwrap();
    assert_eq!(result.status.code(), Some(10));
    let report: Value = serde_json::from_slice(&result.stdout).unwrap();
    assert!(report["findings"]
        .as_array()
        .unwrap()
        .iter()
        .any(|item| item["sink"] == "git:working-tree"));
    assert!(!String::from_utf8_lossy(&result.stdout).contains(secret));
}

#[test]
fn blocks_a_declared_value_in_command_arguments_before_execution() {
    let dir = tempfile::tempdir().unwrap();
    let marker = dir.path().join("must-not-exist");
    let secret = "literal-command-value-4411";
    fs::write(
        dir.path().join("source.env"),
        format!("DEPLOY_SECRET={secret}\n"),
    )
    .unwrap();

    let result = sep()
        .current_dir(dir.path())
        .args([
            "run",
            "--json",
            "--no-git",
            "--source",
            "source.env",
            "--",
            "sh",
            "-c",
        ])
        .arg(format!(
            "touch '{}'; printf '%s' '{secret}'",
            marker.display()
        ))
        .output()
        .unwrap();

    assert_eq!(result.status.code(), Some(10));
    assert!(!marker.exists());
    assert!(!String::from_utf8_lossy(&result.stdout).contains(secret));
    let report: Value = serde_json::from_slice(&result.stdout).unwrap();
    assert_eq!(report["findings"][0]["sink"], "command:arguments");
}

#[test]
fn returns_wrapped_command_status_when_clear() {
    let result = sep()
        .args(["run", "--json", "--no-git", "--", "sh", "-c", "exit 7"])
        .output()
        .unwrap();
    assert_eq!(result.status.code(), Some(7));
    let report: Value = serde_json::from_slice(&result.stdout).unwrap();
    assert_eq!(report["status"], "clear");
}

#[test]
fn help_documents_the_ci_contract() {
    let result = sep().arg("--help").output().unwrap();
    assert!(result.status.success());
    let help = String::from_utf8(result.stdout).unwrap();
    assert!(help.contains("Trace secrets"));
    assert!(help.contains("inspect"));
    assert!(help.contains("run"));
    assert!(help.contains("demo"));
}

#[test]
fn demo_uses_bundled_data_in_a_temporary_workspace_and_redacts_it() {
    let result = sep().args(["demo", "--json"]).output().unwrap();
    assert!(result.status.success());

    let report: Value = serde_json::from_slice(&result.stdout).unwrap();
    assert_eq!(report["status"], "exposed");
    assert_eq!(report["summary"]["findings"], 1);
    assert_eq!(report["findings"][0]["kind"], "traced");

    let stdout = String::from_utf8_lossy(&result.stdout);
    let stderr = String::from_utf8_lossy(&result.stderr);
    assert!(!stdout.contains("sample-aurora-route-9347"));
    assert!(!stderr.contains("sample-aurora-route-9347"));
    assert!(stderr.contains("Demo workspace:"));

    let workspace = stderr.trim().strip_prefix("Demo workspace: ").unwrap();
    assert!(std::path::Path::new(workspace).join("source.env").is_file());
    assert!(std::path::Path::new(workspace)
        .join("dist/release.log")
        .is_file());
}

#[test]
fn keeps_false_positives_below_two_for_100_normal_commands() {
    let normal_messages = [
        "compiled 42 modules",
        "cache restored",
        "tests passed",
        "artifact uploaded",
        "lint completed",
        "release dry run",
        "no changes detected",
        "workspace clean",
        "dependency audit clear",
        "documentation generated",
    ];
    let mut false_positives = 0_u64;

    for index in 0..100 {
        let message = format!(
            "{}; job={index}; duration={}ms",
            normal_messages[index % 10],
            index + 11
        );
        let result = sep()
            .args(["run", "--json", "--no-git", "--", "printf", "%s", &message])
            .output()
            .unwrap();
        let report: Value = serde_json::from_slice(&result.stdout).unwrap();
        false_positives += report["summary"]["findings"].as_u64().unwrap();
    }

    assert!(
        false_positives < 2,
        "expected fewer than two false positives, got {false_positives}"
    );
}
