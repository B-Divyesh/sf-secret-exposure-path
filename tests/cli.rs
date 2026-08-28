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
            "printf '%s\\n' '{secret}' > '{}'; printf '%s\\n' '{secret}'",
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
        .arg(format!("printf 'safe\\n{secret}\\n' > tracked.txt"))
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
}
