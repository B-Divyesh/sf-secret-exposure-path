//! Detection and reporting primitives for the `sep` command-line tool.
//!
//! The library keeps candidate values in memory only. Public reports contain
//! fingerprints and locations, never captured secret values.

use regex::Regex;
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::process::Command;

pub const EXPOSURE_EXIT: i32 = 10;

#[derive(Clone, Debug)]
pub struct Candidate {
    value: String,
    pub fingerprint: String,
    pub source: String,
    pub detector: String,
}

#[derive(Clone, Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum FindingKind {
    Traced,
    Unattributed,
}

#[derive(Clone, Debug, Serialize)]
pub struct Finding {
    pub fingerprint: String,
    pub kind: FindingKind,
    pub source: String,
    pub via: String,
    pub sink: String,
    pub line: usize,
    pub detector: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct Summary {
    pub findings: usize,
    pub traced: usize,
    pub unattributed: usize,
    pub sinks_scanned: usize,
}

#[derive(Clone, Debug, Serialize)]
pub struct Report {
    pub version: &'static str,
    pub status: &'static str,
    pub command: Option<String>,
    pub summary: Summary,
    pub findings: Vec<Finding>,
    pub warnings: Vec<String>,
}

#[derive(Clone, Debug, Default)]
pub struct Allowlist {
    pub fingerprints: BTreeSet<String>,
    pub paths: Vec<String>,
}

#[derive(Default)]
pub struct Trace {
    pub candidates: Vec<Candidate>,
    pub findings: Vec<Finding>,
    pub warnings: Vec<String>,
    scanned: usize,
    seen: BTreeSet<String>,
    allowlist: Allowlist,
}

impl Trace {
    pub fn new(allowlist: Allowlist) -> Self {
        Self {
            allowlist,
            ..Self::default()
        }
    }

    pub fn add_source_file(&mut self, path: &Path) -> Result<(), String> {
        let bytes = fs::read(path)
            .map_err(|error| format!("could not read source {}: {error}", path.display()))?;
        let text = String::from_utf8_lossy(&bytes);
        let source_name = path.display().to_string();

        for (index, line) in text.lines().enumerate() {
            if let Some((name, value)) = dotenv_assignment(line) {
                if looks_like_declared_secret(&name, &value) {
                    self.push_candidate(
                        value,
                        format!("{}:{}", source_name, index + 1),
                        "declared_value",
                    );
                }
            }
        }
        for hit in shape_matches(&text) {
            self.push_candidate(
                hit.value,
                format!("{}:{}", source_name, hit.line),
                hit.detector,
            );
        }
        Ok(())
    }

    pub fn add_env(&mut self, name: &str) -> Result<(), String> {
        let value = std::env::var(name)
            .map_err(|_| format!("environment variable {name} is not set or is not valid UTF-8"))?;
        if value.len() < 8 {
            return Err(format!(
                "environment variable {name} is too short to trace safely"
            ));
        }
        self.push_candidate(value, format!("env:{name}"), "declared_value");
        Ok(())
    }

    pub fn scan_text(&mut self, sink: &str, via: &str, text: &str) {
        self.scanned += 1;
        if self.allowlist.paths.iter().any(|path| sink.contains(path)) {
            return;
        }

        let candidates = self.candidates.clone();
        for candidate in candidates {
            if text.contains(&candidate.value) {
                let line = line_number(text, text.find(&candidate.value).unwrap_or(0));
                self.add_finding(Finding {
                    fingerprint: candidate.fingerprint,
                    kind: FindingKind::Traced,
                    source: candidate.source,
                    via: via.to_string(),
                    sink: sink.to_string(),
                    line,
                    detector: candidate.detector,
                });
            }
        }

        for hit in shape_matches(text) {
            let fingerprint = fingerprint(&hit.value);
            if self
                .candidates
                .iter()
                .any(|candidate| candidate.fingerprint == fingerprint)
            {
                continue;
            }
            self.add_finding(Finding {
                fingerprint,
                kind: FindingKind::Unattributed,
                source: "unattributed".to_string(),
                via: via.to_string(),
                sink: sink.to_string(),
                line: hit.line,
                detector: hit.detector,
            });
        }
    }

    pub fn scan_path(&mut self, path: &Path, via: &str) -> Result<(), String> {
        if !path.exists() {
            self.warnings.push(format!(
                "declared output {} was not created",
                path.display()
            ));
            return Ok(());
        }
        if path.is_file() {
            return self.scan_file(path, via);
        }

        let mut files = Vec::new();
        collect_files(path, &mut files)
            .map_err(|error| format!("could not walk output {}: {error}", path.display()))?;
        for file in files {
            self.scan_file(&file, via)?;
        }
        Ok(())
    }

    fn scan_file(&mut self, path: &Path, via: &str) -> Result<(), String> {
        let metadata = fs::metadata(path)
            .map_err(|error| format!("could not inspect {}: {error}", path.display()))?;
        if metadata.len() > 10 * 1024 * 1024 {
            self.warnings.push(format!(
                "skipped {} because it exceeds 10 MiB",
                path.display()
            ));
            return Ok(());
        }
        let bytes = fs::read(path)
            .map_err(|error| format!("could not read {}: {error}", path.display()))?;
        if bytes.contains(&0) {
            self.warnings
                .push(format!("skipped binary output {}", path.display()));
            return Ok(());
        }
        let text = String::from_utf8_lossy(&bytes);
        self.scan_text(&path.display().to_string(), via, &text);
        Ok(())
    }

    pub fn scan_git_diffs(&mut self, cwd: &Path, via: &str) {
        for (label, args) in [
            (
                "git:working-tree",
                &["diff", "--no-ext-diff", "--no-color"][..],
            ),
            (
                "git:staged",
                &["diff", "--cached", "--no-ext-diff", "--no-color"][..],
            ),
        ] {
            match Command::new("git").args(args).current_dir(cwd).output() {
                Ok(output) if output.status.success() => {
                    let text = String::from_utf8_lossy(&output.stdout);
                    self.scan_text(label, via, &text);
                }
                Ok(_) => {}
                Err(error) => self
                    .warnings
                    .push(format!("could not scan {label}: {error}")),
            }
        }
    }

    pub fn redact(&self, text: &str) -> String {
        let mut replacements: BTreeMap<String, String> = BTreeMap::new();
        for candidate in &self.candidates {
            replacements.insert(
                candidate.value.clone(),
                format!("[REDACTED:{}]", candidate.fingerprint),
            );
        }
        for hit in shape_matches(text) {
            replacements.insert(
                hit.value.clone(),
                format!("[REDACTED:{}]", fingerprint(&hit.value)),
            );
        }
        let mut redacted = text.to_string();
        let mut ordered: Vec<_> = replacements.into_iter().collect();
        ordered.sort_by_key(|(value, _)| std::cmp::Reverse(value.len()));
        for (value, replacement) in ordered {
            redacted = redacted.replace(&value, &replacement);
        }
        redacted
    }

    pub fn has_findings(&self) -> bool {
        !self.findings.is_empty()
    }

    pub fn report(mut self, command: Option<String>) -> Report {
        self.findings.sort_by(|a, b| {
            (&a.sink, a.line, &a.fingerprint).cmp(&(&b.sink, b.line, &b.fingerprint))
        });
        let traced = self
            .findings
            .iter()
            .filter(|finding| finding.kind == FindingKind::Traced)
            .count();
        let unattributed = self.findings.len() - traced;
        Report {
            version: env!("CARGO_PKG_VERSION"),
            status: if self.findings.is_empty() {
                "clear"
            } else {
                "exposed"
            },
            command,
            summary: Summary {
                findings: self.findings.len(),
                traced,
                unattributed,
                sinks_scanned: self.scanned,
            },
            findings: self.findings,
            warnings: self.warnings,
        }
    }

    fn push_candidate(&mut self, value: String, source: String, detector: impl Into<String>) {
        let fp = fingerprint(&value);
        if self.allowlist.fingerprints.contains(&fp)
            || self
                .candidates
                .iter()
                .any(|candidate| candidate.fingerprint == fp)
        {
            return;
        }
        self.candidates.push(Candidate {
            value,
            fingerprint: fp,
            source,
            detector: detector.into(),
        });
    }

    fn add_finding(&mut self, finding: Finding) {
        if self.allowlist.fingerprints.contains(&finding.fingerprint) {
            return;
        }
        let key = format!("{}:{}:{}", finding.sink, finding.line, finding.fingerprint);
        if self.seen.insert(key) {
            self.findings.push(finding);
        }
    }
}

#[derive(Debug)]
struct ShapeHit {
    value: String,
    detector: String,
    line: usize,
}

fn shape_matches(text: &str) -> Vec<ShapeHit> {
    let patterns = [
        (
            "github_token",
            r"\b(?:gh[pousr]_[A-Za-z0-9]{20,255}|github_pat_[A-Za-z0-9_]{20,255})\b",
        ),
        ("aws_access_key", r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
        ("stripe_live_key", r"\b(?:sk|rk)_live_[A-Za-z0-9]{16,255}\b"),
        ("slack_token", r"\bxox[baprs]-[A-Za-z0-9-]{10,255}\b"),
        ("google_api_key", r"\bAIza[A-Za-z0-9_-]{30,255}\b"),
        (
            "private_key",
            r"(?s)-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----\s+[A-Za-z0-9+/=\r\n]{64,}-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        ),
    ];
    let mut hits = Vec::new();
    for (detector, pattern) in patterns {
        let regex = Regex::new(pattern).expect("built-in detector regex must compile");
        for found in regex.find_iter(text) {
            hits.push(ShapeHit {
                value: found.as_str().to_string(),
                detector: detector.to_string(),
                line: line_number(text, found.start()),
            });
        }
    }
    hits
}

fn dotenv_assignment(line: &str) -> Option<(String, String)> {
    let trimmed = line.trim();
    if trimmed.is_empty() || trimmed.starts_with('#') {
        return None;
    }
    let trimmed = trimmed.strip_prefix("export ").unwrap_or(trimmed);
    let (name, raw_value) = trimmed.split_once('=')?;
    let name = name.trim();
    if name.is_empty()
        || !name
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || character == '_')
    {
        return None;
    }
    let mut value = raw_value.trim().to_string();
    if value.len() >= 2 {
        let first = value.as_bytes()[0] as char;
        let last = value.as_bytes()[value.len() - 1] as char;
        if (first == '\'' && last == '\'') || (first == '"' && last == '"') {
            value = value[1..value.len() - 1].to_string();
        }
    }
    Some((name.to_string(), value))
}

fn looks_like_declared_secret(name: &str, value: &str) -> bool {
    const SECRET_WORDS: [&str; 8] = [
        "SECRET",
        "TOKEN",
        "PASSWORD",
        "PASSWD",
        "API_KEY",
        "PRIVATE_KEY",
        "CREDENTIAL",
        "ACCESS_KEY",
    ];
    let upper = name.to_ascii_uppercase();
    value.len() >= 8
        && SECRET_WORDS.iter().any(|word| upper.contains(word))
        && !is_placeholder(value)
}

fn is_placeholder(value: &str) -> bool {
    let normalized = value.trim().to_ascii_lowercase();
    normalized.is_empty()
        || [
            "changeme",
            "replace_me",
            "your_token_here",
            "example",
            "dummy",
            "test",
        ]
        .iter()
        .any(|placeholder| normalized == *placeholder)
        || normalized.starts_with("${")
}

fn fingerprint(value: &str) -> String {
    let digest = Sha256::digest(value.as_bytes());
    digest[..6]
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn line_number(text: &str, byte_index: usize) -> usize {
    text[..byte_index]
        .bytes()
        .filter(|byte| *byte == b'\n')
        .count()
        + 1
}

fn collect_files(path: &Path, files: &mut Vec<PathBuf>) -> io::Result<()> {
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        if file_type.is_symlink() {
            continue;
        }
        if file_type.is_dir() {
            collect_files(&entry.path(), files)?;
        } else if file_type.is_file() {
            files.push(entry.path());
        }
    }
    Ok(())
}

pub fn load_allowlist(path: &Path) -> Result<Allowlist, String> {
    if !path.exists() {
        return Ok(Allowlist::default());
    }
    let content = fs::read_to_string(path)
        .map_err(|error| format!("could not read config {}: {error}", path.display()))?;
    let mut allowlist = Allowlist::default();
    for (line_number, raw) in content.lines().enumerate() {
        let line = raw.split('#').next().unwrap_or("").trim();
        if line.is_empty() {
            continue;
        }
        let (key, value) = line.split_once('=').ok_or_else(|| {
            format!(
                "{}:{}: expected key = [\"value\"]",
                path.display(),
                line_number + 1
            )
        })?;
        let items = parse_string_array(value.trim())
            .map_err(|message| format!("{}:{}: {message}", path.display(), line_number + 1))?;
        match key.trim() {
            "allow_fingerprints" => allowlist.fingerprints.extend(items),
            "allow_paths" => allowlist.paths.extend(items),
            other => {
                return Err(format!(
                    "{}:{}: unknown key {other}",
                    path.display(),
                    line_number + 1
                ))
            }
        }
    }
    Ok(allowlist)
}

fn parse_string_array(value: &str) -> Result<Vec<String>, String> {
    let inner = value
        .strip_prefix('[')
        .and_then(|item| item.strip_suffix(']'))
        .ok_or_else(|| "expected an array".to_string())?;
    if inner.trim().is_empty() {
        return Ok(Vec::new());
    }
    inner
        .split(',')
        .map(|item| {
            let item = item.trim();
            item.strip_prefix('"')
                .and_then(|item| item.strip_suffix('"'))
                .map(str::to_string)
                .ok_or_else(|| "array values must be quoted strings".to_string())
        })
        .collect()
}

pub fn render_human(report: &Report) -> String {
    let mut output = String::new();
    if report.findings.is_empty() {
        output.push_str(&format!(
            "\n✓ Clear — {} sinks scanned, no exposure paths found.\n",
            report.summary.sinks_scanned
        ));
    } else {
        output.push_str(&format!(
            "\n✕ Exposed — {} path{} found\n",
            report.summary.findings,
            if report.summary.findings == 1 {
                ""
            } else {
                "s"
            }
        ));
        for finding in &report.findings {
            let kind = if finding.kind == FindingKind::Traced {
                "traced"
            } else {
                "shape"
            };
            output.push_str(&format!(
                "  {} ──[{}]──> {}:{}  [{} · {}]\n",
                finding.source, finding.via, finding.sink, finding.line, kind, finding.fingerprint
            ));
        }
    }
    for warning in &report.warnings {
        output.push_str(&format!("  ! {warning}\n"));
    }
    output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_declared_secret_and_redacts_it() {
        let dir = tempfile::tempdir().unwrap();
        let source = dir.path().join(".env");
        fs::write(
            &source,
            "PUBLIC_URL=https://example.test\nDEPLOY_TOKEN=quiet-river-9347\n",
        )
        .unwrap();
        let mut trace = Trace::new(Allowlist::default());
        trace.add_source_file(&source).unwrap();
        trace.scan_text("build.log", "test", "upload quiet-river-9347 now");
        let redacted = trace.redact("upload quiet-river-9347 now");
        assert!(!redacted.contains("quiet-river-9347"));
        let report = trace.report(None);
        assert_eq!(report.summary.traced, 1);
        assert_eq!(report.findings[0].source, format!("{}:2", source.display()));
    }

    #[test]
    fn detects_unattributed_high_confidence_shape() {
        let mut trace = Trace::new(Allowlist::default());
        trace.scan_text(
            "agent.log",
            "command",
            "token ghp_abcdefghijklmnopqrstuvwxyz123456",
        );
        let report = trace.report(None);
        assert_eq!(report.summary.unattributed, 1);
        assert_eq!(report.findings[0].detector, "github_token");
    }

    #[test]
    fn ignores_normal_commands_and_placeholders() {
        let dir = tempfile::tempdir().unwrap();
        let source = dir.path().join(".env.example");
        fs::write(&source, "API_KEY=your_token_here\nPORT=3000\n").unwrap();
        let mut trace = Trace::new(Allowlist::default());
        trace.add_source_file(&source).unwrap();
        for index in 0..100 {
            trace.scan_text(
                &format!("log-{index}"),
                "command",
                "compiled 42 modules in 0.20s",
            );
        }
        assert!(trace.report(None).findings.is_empty());
    }

    #[test]
    fn parses_small_allowlist_config() {
        let dir = tempfile::tempdir().unwrap();
        let config = dir.path().join("config.toml");
        fs::write(
            &config,
            "allow_fingerprints = [\"abc123\"]\nallow_paths = [\"fixtures/\"]\n",
        )
        .unwrap();
        let allowlist = load_allowlist(&config).unwrap();
        assert!(allowlist.fingerprints.contains("abc123"));
        assert_eq!(allowlist.paths, vec!["fixtures/"]);
    }
}
