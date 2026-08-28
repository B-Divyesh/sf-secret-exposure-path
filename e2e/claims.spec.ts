import { expect, test } from '@playwright/test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const binary = resolve('target/debug/sep');

function workspace(prefix: string): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

function invoke(cwd: string, args: string[], env?: NodeJS.ProcessEnv) {
  return spawnSync(binary, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
}

function writeSource(cwd: string, value = 'claim-river-9384'): string {
  writeFileSync(join(cwd, 'source.env'), `DEPLOY_SECRET=${value}\n`);
  return value;
}

function git(cwd: string, args: string[]) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
}

test('@claim:cli-path-redaction traces a declared artifact without printing its value', () => {
  const workspace = mkdtempSync(join(tmpdir(), 'sep-claim-path-'));
  const value = 'claim-sample-river-9384';
  writeFileSync(join(workspace, 'source.env'), `DEPLOY_SECRET=${value}\n`);
  writeFileSync(join(workspace, 'release.log'), `upload=${value}\n`);

  const run = spawnSync(binary, ['inspect', '--json', '--source', 'source.env', '--input', 'release.log'], {
    cwd: workspace,
    encoding: 'utf8',
  });
  expect(run.status).toBe(10);
  expect(`${run.stdout}${run.stderr}`).not.toContain(value);
  const report = JSON.parse(run.stdout);
  expect(report.status).toBe('exposed');
  expect(report.summary.traced).toBe(1);
  expect(report.findings[0].sink).toContain('release.log');
  rmSync(workspace, { recursive: true });
});

test('@claim:cli-demo runs the bundled sample in a temporary workspace', () => {
  const run = spawnSync(binary, ['demo', '--json'], { encoding: 'utf8' });
  expect(run.status).toBe(0);
  expect(run.stderr).toMatch(/^Demo workspace: /);
  expect(run.stdout).not.toContain('sample-aurora-route-9347');
  const report = JSON.parse(run.stdout);
  expect(report.summary.traced).toBe(1);
  const workspace = run.stderr.trim().replace('Demo workspace: ', '');
  expect(readFileSync(join(workspace, 'source.env'), 'utf8')).toContain('DEPLOY_SECRET=');
  expect(readFileSync(join(workspace, 'dist/release.log'), 'utf8')).toContain('upload credential:');
  rmSync(workspace, { recursive: true });
});

test('@claim:cli-no-network completes without opening a network socket', () => {
  const workspace = mkdtempSync(join(tmpdir(), 'sep-claim-network-'));
  const interceptor = join(workspace, 'deny-network.so');
  const compile = spawnSync('cc', ['-shared', '-fPIC', resolve('tests/deny_network.c'), '-o', interceptor], { encoding: 'utf8' });
  expect(compile.status, compile.stderr).toBe(0);
  const marker = join(workspace, 'network-attempted');
  const run = spawnSync(binary, ['demo', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, LD_PRELOAD: interceptor, SEP_NETWORK_MARKER: marker },
  });
  expect(run.status).toBe(0);
  expect(() => readFileSync(marker)).toThrow();
  rmSync(workspace, { recursive: true });
});

test('@claim:mit-license ships under the MIT license', () => {
  const license = readFileSync(resolve('LICENSE'), 'utf8');
  expect(license).toContain('Permission is hereby granted, free of charge');
  expect(license).toContain('THE SOFTWARE IS PROVIDED "AS IS"');
  expect(readFileSync(resolve('Cargo.toml'), 'utf8')).toContain('license = "MIT"');
});

test('@claim:browser-private keeps demo input in memory and sends no input', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/demo/');
  await expect(page.getByText('1 exposed path')).toBeVisible();

  const uniqueValue = 'browser-only-sample-7294';
  await page.locator('#source-input').fill(`DEPLOY_SECRET=${uniqueValue}`);
  await page.locator('#sink-input').fill(`release=${uniqueValue}`);
  await page.getByRole('button', { name: 'Trace paths' }).click();
  await expect(page.getByText('1 exposed path')).toBeVisible();
  await expect(page.locator('#trace-result')).not.toContainText(uniqueValue);

  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const storage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  expect(storage).toEqual({ local: {}, session: {} });
  expect(await context.cookies()).toEqual([]);
});

test('@claim:offline-loaded-demo keeps tracing after the connection drops', async ({ page, context }) => {
  await page.goto('/demo/');
  await expect(page.getByText('1 exposed path')).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Load clear sample' }).click();
  await expect(page.getByText('Clear path')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('1 exposed path')).toBeVisible();
});

test('@claim:false-positive-rate stays below two findings for 100 normal commands', () => {
  const messages = [
    'compiled 42 modules', 'cache restored', 'tests passed', 'artifact uploaded', 'lint completed',
    'release dry run', 'no changes detected', 'workspace clean', 'dependency audit clear', 'docs generated',
  ];
  let findings = 0;
  for (let index = 0; index < 100; index += 1) {
    const message = `${messages[index % messages.length]}; job=${index}; duration=${index + 11}ms`;
    const run = spawnSync(binary, ['run', '--json', '--no-git', '--', 'printf', '%s', message], { encoding: 'utf8' });
    expect(run.status).toBe(0);
    findings += JSON.parse(run.stdout).summary.findings;
  }
  expect(findings).toBeLessThan(2);
});

test('@claim:fingerprint-format reports a 12-character fingerprint and locations', () => {
  const cwd = workspace('sep-claim-fingerprint-');
  const value = writeSource(cwd);
  writeFileSync(join(cwd, 'out.log'), `line one\n${value}\n`);
  const run = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'out.log']);
  expect(run.status).toBe(10);
  const finding = JSON.parse(run.stdout).findings[0];
  expect(finding.fingerprint).toMatch(/^[a-f0-9]{12}$/);
  expect(finding.source).toMatch(/source\.env:1$/);
  expect(finding.sink).toMatch(/out\.log$/);
  expect(finding.line).toBe(2);
  rmSync(cwd, { recursive: true });
});

test('@claim:declared-boundary scans named sources and both Git diffs without reading a decoy source', () => {
  const cwd = workspace('sep-claim-boundary-');
  const value = writeSource(cwd);
  const decoy = 'not-a-declared-source-8811';
  writeFileSync(join(cwd, 'decoy.env'), `DECOY_SECRET=${decoy}\n`);
  git(cwd, ['init']); git(cwd, ['config', 'user.email', 'claim@example.test']); git(cwd, ['config', 'user.name', 'Claim']);
  writeFileSync(join(cwd, 'tracked.txt'), 'base\n'); git(cwd, ['add', 'tracked.txt']); git(cwd, ['commit', '-m', 'base']);
  writeFileSync(join(cwd, 'staged.txt'), `${value}\n`); git(cwd, ['add', 'staged.txt']);
  writeFileSync(join(cwd, 'tracked.txt'), `${value}\n${decoy}\n`);
  const run = invoke(cwd, ['run', '--json', '--source', 'source.env', '--', 'printf', '%s', 'safe']);
  expect(run.status).toBe(10);
  const report = JSON.parse(run.stdout);
  expect(report.findings.map((item: { sink: string }) => item.sink)).toEqual(expect.arrayContaining(['git:working-tree', 'git:staged']));
  expect(`${run.stdout}${run.stderr}`).not.toContain(decoy);
  rmSync(cwd, { recursive: true });
});

test('@claim:detection-methods finds literal values and unattributed credential shapes', () => {
  const cwd = workspace('sep-claim-methods-');
  const value = writeSource(cwd);
  const shape = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  writeFileSync(join(cwd, 'out.log'), `${value}\n${shape}\n`);
  const run = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'out.log']);
  const report = JSON.parse(run.stdout);
  expect(report.summary.traced).toBe(1);
  expect(report.summary.unattributed).toBe(1);
  expect(report.findings.some((item: { kind: string; source: string }) => item.kind === 'unattributed' && item.source === 'unattributed')).toBe(true);
  rmSync(cwd, { recursive: true });
});

test('@claim:source-types loads dotenv and selected environment candidates', () => {
  const cwd = workspace('sep-claim-sources-');
  const dotenv = writeSource(cwd, 'dotenv-value-9931');
  const environment = 'environment-value-9932';
  writeFileSync(join(cwd, 'out.log'), `${dotenv}\n${environment}\n`);
  const run = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--from-env', 'CLAIM_ENV_SECRET', '--input', 'out.log'], { CLAIM_ENV_SECRET: environment });
  const report = JSON.parse(run.stdout);
  expect(report.summary.traced).toBe(2);
  expect(`${run.stdout}${run.stderr}`).not.toContain(dotenv);
  expect(`${run.stdout}${run.stderr}`).not.toContain(environment);
  rmSync(cwd, { recursive: true });
});

test('@claim:command-forwarding redacts forwarded output and preserves a clear child status', () => {
  const cwd = workspace('sep-claim-forward-');
  const value = writeSource(cwd);
  const exposed = invoke(cwd, ['run', '--no-git', '--source', 'source.env', '--', 'sh', '-c', 'printf %s "$DEPLOY_SECRET"'], { DEPLOY_SECRET: value });
  expect(exposed.status).toBe(10);
  expect(exposed.stdout).toContain('[REDACTED:');
  expect(exposed.stdout).not.toContain(value);
  const clear = invoke(cwd, ['run', '--json', '--no-git', '--', 'sh', '-c', 'exit 7']);
  expect(clear.status).toBe(7);
  rmSync(cwd, { recursive: true });
});

test('@claim:sink-paths links a source through command output, artifacts, and both Git diffs', () => {
  const cwd = workspace('sep-claim-sinks-');
  const value = writeSource(cwd);
  writeFileSync(join(cwd, 'artifact.log'), value);
  git(cwd, ['init']); git(cwd, ['config', 'user.email', 'claim@example.test']); git(cwd, ['config', 'user.name', 'Claim']);
  writeFileSync(join(cwd, 'tracked.txt'), 'base'); git(cwd, ['add', 'tracked.txt']); git(cwd, ['commit', '-m', 'base']);
  writeFileSync(join(cwd, 'staged.txt'), value); git(cwd, ['add', 'staged.txt']); writeFileSync(join(cwd, 'tracked.txt'), value);
  const run = invoke(cwd, ['run', '--json', '--source', 'source.env', '--output', 'artifact.log', '--', 'sh', '-c', 'printf %s "$DEPLOY_SECRET"'], { DEPLOY_SECRET: value });
  const findings = JSON.parse(run.stdout).findings as Array<{ sink: string; via: string; source: string }>;
  const sinks = findings.map(item => item.sink);
  expect(sinks).toEqual(expect.arrayContaining(['command:stdout', 'git:working-tree', 'git:staged']));
  expect(sinks.some(sink => sink.endsWith('artifact.log'))).toBe(true);
  expect(findings.every(item => item.source.endsWith('source.env:1') && item.via.includes('printf'))).toBe(true);
  rmSync(cwd, { recursive: true });
});

test('@claim:json-ci-contract writes one JSON report and redacted forwarded output', () => {
  const cwd = workspace('sep-claim-json-');
  const value = writeSource(cwd);
  const run = invoke(cwd, ['run', '--json', '--no-git', '--source', 'source.env', '--', 'sh', '-c', 'printf %s "$DEPLOY_SECRET"'], { DEPLOY_SECRET: value });
  expect(run.status).toBe(10);
  expect(() => JSON.parse(run.stdout)).not.toThrow();
  expect(run.stderr).toContain('[REDACTED:');
  expect(run.stderr).not.toContain(value);
  rmSync(cwd, { recursive: true });
});

test('@claim:browser-model traces values locally, redacts them, and shows a hashing error', async ({ browser }) => {
  const normal = await browser.newPage();
  const value = 'browser-model-value-7162';
  await normal.goto('/demo/');
  await normal.locator('#source-input').fill(`DEPLOY_SECRET=${value}`);
  await normal.locator('#sink-input').fill(`log=${value}`);
  await normal.getByRole('button', { name: 'Trace paths' }).click();
  await expect(normal.locator('#trace-result')).toContainText(/Fingerprint and locations only/);
  await expect(normal.locator('#trace-result')).not.toContainText(value);
  await normal.close();
  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => Object.defineProperty(window, 'crypto', { value: { subtle: undefined } }));
  await unsupported.goto('/demo/');
  await expect(unsupported.getByText('Trace could not run')).toBeVisible();
  await expect(unsupported.getByText('Try a current browser.')).toBeVisible();
  await unsupported.close();
});

test('@claim:clear-result reports no finding for clear declared and shape-free sinks', () => {
  const cwd = workspace('sep-claim-clear-');
  writeSource(cwd);
  writeFileSync(join(cwd, 'out.log'), 'compiled normally\nAKIAshort');
  const run = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'out.log']);
  expect(run.status).toBe(0);
  expect(JSON.parse(run.stdout).summary.findings).toBe(0);
  rmSync(cwd, { recursive: true });
});

test('@claim:exit-code-contract returns clear, exposed, cannot-scan, and child statuses', () => {
  const cwd = workspace('sep-claim-exit-');
  const value = writeSource(cwd);
  writeFileSync(join(cwd, 'out.log'), value);
  expect(invoke(cwd, ['run', '--json', '--no-git', '--', 'true']).status).toBe(0);
  expect(invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'out.log']).status).toBe(10);
  expect(invoke(cwd, ['inspect', '--json', '--source', 'missing.env', '--input', 'out.log']).status).toBe(2);
  expect(invoke(cwd, ['run', '--json', '--no-git', '--', 'sh', '-c', 'exit 7']).status).toBe(7);
  rmSync(cwd, { recursive: true });
});

test('@claim:detection-limits leaves transformed and split values clear and labels a shape unattributed', () => {
  const cwd = workspace('sep-claim-limits-');
  const value = writeSource(cwd);
  writeFileSync(join(cwd, 'clear.log'), `${Buffer.from(value).toString('base64')}\n${value.slice(0, 7)} ${value.slice(7)}\n`);
  const clear = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'clear.log']);
  expect(JSON.parse(clear.stdout).summary.findings).toBe(0);
  const shape = 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'; writeFileSync(join(cwd, 'shape.log'), shape);
  const flagged = invoke(cwd, ['inspect', '--json', '--input', 'shape.log']);
  expect(JSON.parse(flagged.stdout).findings[0]).toMatchObject({ kind: 'unattributed', source: 'unattributed' });
  rmSync(cwd, { recursive: true });
});

test('@claim:allowlists suppress selected findings while retaining others for flags and TOML', () => {
  const cwd = workspace('sep-claim-allow-');
  const one = 'allow-one-value-8811'; const two = 'retain-two-value-8822';
  writeFileSync(join(cwd, 'source.env'), `ONE_SECRET=${one}\nTWO_SECRET=${two}\n`);
  writeFileSync(join(cwd, 'one.log'), one); writeFileSync(join(cwd, 'two.log'), two);
  const baseline = JSON.parse(invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'one.log', '--input', 'two.log']).stdout);
  const fingerprint = baseline.findings.find((item: { sink: string }) => item.sink.endsWith('one.log')).fingerprint;
  const flags = JSON.parse(invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--allow-fingerprint', fingerprint, '--input', 'one.log', '--input', 'two.log']).stdout);
  expect(flags.findings).toHaveLength(1); expect(flags.findings[0].sink).toMatch(/two\.log$/);
  writeFileSync(join(cwd, '.seppath.toml'), 'allow_paths = ["one.log"]\n');
  const config = JSON.parse(invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'one.log', '--input', 'two.log']).stdout);
  expect(config.findings).toHaveLength(1); expect(config.findings[0].sink).toMatch(/two\.log$/);
  rmSync(cwd, { recursive: true });
});

test('@claim:multiple-inputs scans repeated sources and outputs', () => {
  const cwd = workspace('sep-claim-multiple-');
  writeFileSync(join(cwd, 'one.env'), 'ONE_SECRET=one-source-8811\n'); writeFileSync(join(cwd, 'two.env'), 'TWO_SECRET=two-source-8822\n');
  writeFileSync(join(cwd, 'one.log'), 'one-source-8811'); writeFileSync(join(cwd, 'two.log'), 'two-source-8822');
  const report = JSON.parse(invoke(cwd, ['inspect', '--json', '--source', 'one.env', '--source', 'two.env', '--input', 'one.log', '--input', 'two.log']).stdout);
  expect(report.summary.traced).toBe(2);
  rmSync(cwd, { recursive: true });
});

test('@claim:inspect-mode scans inputs without a child command', () => {
  const cwd = workspace('sep-claim-inspect-');
  const value = writeSource(cwd); writeFileSync(join(cwd, 'input.log'), value);
  const run = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'input.log']);
  const report = JSON.parse(run.stdout);
  expect(report.command).toBeNull(); expect(report.summary.traced).toBe(1);
  rmSync(cwd, { recursive: true });
});

test('@claim:preflight-redaction refuses declared arguments before starting a child', () => {
  const cwd = workspace('sep-claim-preflight-');
  const value = writeSource(cwd); const marker = join(cwd, 'started');
  const run = invoke(cwd, ['run', '--json', '--no-git', '--source', 'source.env', '--', 'sh', '-c', `touch '${marker}'`, value]);
  expect(run.status).toBe(10); expect(() => readFileSync(marker)).toThrow(); expect(`${run.stdout}${run.stderr}`).not.toContain(value);
  rmSync(cwd, { recursive: true });
});

test('@claim:report-redaction keeps declared values out of source, command, JSON, and error flows', () => {
  const cwd = workspace('sep-claim-redaction-');
  const value = writeSource(cwd); writeFileSync(join(cwd, 'out.log'), value);
  const inspect = invoke(cwd, ['inspect', '--json', '--source', 'source.env', '--input', 'out.log']);
  const command = invoke(cwd, ['run', '--json', '--no-git', '--source', 'source.env', '--', 'sh', '-c', 'printf %s "$DEPLOY_SECRET"'], { DEPLOY_SECRET: value });
  const error = invoke(cwd, ['inspect', '--json', '--source', 'missing.env', '--input', 'out.log']);
  for (const result of [inspect, command, error]) expect(`${result.stdout}${result.stderr}`).not.toContain(value);
  rmSync(cwd, { recursive: true });
});

test('@claim:site-host-policy ships static security, cache, and 404 policy', () => {
  const config = JSON.parse(readFileSync(resolve('site/public/staticwebapp.config.json'), 'utf8'));
  expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
  expect(config.routes.find((route: { route: string }) => route.route === '/assets/*').headers['Cache-Control']).toContain('immutable');
  expect(config.responseOverrides['404'].rewrite).toBe('/404/index.html');
});
