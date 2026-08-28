import { describe, expect, it } from 'vitest';
import { declaredValues, traceDemo } from './scanner';

describe('browser trace model', () => {
  it('maps declared credential values without returning the value', async () => {
    const findings = await traceDemo('URL=https://example.test\nDEPLOY_TOKEN=quiet-river-9347', 'ok\nquiet-river-9347');
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ name: 'DEPLOY_TOKEN', sourceLine: 2, sinkLine: 2 });
    expect(JSON.stringify(findings)).not.toContain('quiet-river-9347');
  });

  it('rejects placeholders and non-secret settings', () => {
    expect(declaredValues('API_KEY=your_token_here\nPUBLIC_URL=https://example.test')).toEqual([]);
  });

  it('returns the clear state when values do not propagate', async () => {
    expect(await traceDemo('DEPLOY_TOKEN=quiet-river-9347', 'build complete')).toEqual([]);
  });
});
