export interface DemoFinding {
  name: string;
  sourceLine: number;
  sinkLine: number;
  fingerprint: string;
}

const secretNames = /(SECRET|TOKEN|PASSWORD|PASSWD|API_KEY|PRIVATE_KEY|CREDENTIAL|ACCESS_KEY)/i;
const placeholders = new Set(['changeme', 'replace_me', 'your_token_here', 'example', 'dummy', 'test']);

export function declaredValues(source: string): Array<{ name: string; value: string; line: number }> {
  const values: Array<{ name: string; value: string; line: number }> = [];
  source.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim().replace(/^export\s+/, '');
    if (!line || line.startsWith('#')) return;
    const separator = line.indexOf('=');
    if (separator < 1) return;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (secretNames.test(name) && value.length >= 8 && !placeholders.has(value.toLowerCase()) && !value.startsWith('${')) {
      values.push({ name, value, line: index + 1 });
    }
  });
  return values;
}

async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest).slice(0, 6), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function traceDemo(source: string, sink: string): Promise<DemoFinding[]> {
  const findings: DemoFinding[] = [];
  for (const candidate of declaredValues(source)) {
    const index = sink.indexOf(candidate.value);
    if (index === -1) continue;
    findings.push({
      name: candidate.name,
      sourceLine: candidate.line,
      sinkLine: sink.slice(0, index).split(/\r?\n/).length,
      fingerprint: await fingerprint(candidate.value),
    });
  }
  return findings;
}
