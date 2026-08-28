import { expect, test } from '@playwright/test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const binary = resolve('target/debug/sep');

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
