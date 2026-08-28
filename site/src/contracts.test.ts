import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('release contracts', () => {
  it('lists unique claims with one matching tagged test each', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const tests = readFileSync('e2e/claims.spec.ts', 'utf8');
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.test).toContain(`@claim:${claim.id}`);
      expect(tests.match(new RegExp(`@claim:${claim.id}\\b`, 'g'))).toHaveLength(1);
    }
  });

  it('ships the static host security, cache, and 404 policy', () => {
    const config = JSON.parse(readFileSync('site/public/staticwebapp.config.json', 'utf8'));
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()');
    expect(config.routes.find((route: { route: string }) => route.route === '/assets/*').headers['Cache-Control']).toContain('immutable');
    expect(config.responseOverrides['404'].rewrite).toBe('/404/index.html');
  });

  it('ships the demo route, ?demo=1 entry, metadata assets, and demo documentation', () => {
    expect(readFileSync('site/demo/index.html', 'utf8')).toContain('Demo — sample data, nothing is saved');
    expect(readFileSync('site/index.html', 'utf8')).toContain('href="/?demo=1"');
    expect(readFileSync('.factory/demo.md', 'utf8')).toContain('sep demo');
    expect(readFileSync('site/public/social-card.webp').byteLength).toBeGreaterThan(1000);
    expect(readFileSync('site/public/apple-touch-icon.png').byteLength).toBeGreaterThan(1000);
  });

  it('uses the stable primary navigation and plain credential copy', () => {
    for (const route of ['site/index.html', 'site/demo/index.html', 'site/privacy/index.html', 'site/terms/index.html', 'site/404/index.html']) {
      const html = readFileSync(route, 'utf8');
      expect(html).toContain('How it works');
      expect(html).toContain('>Demo<');
      expect(html).toContain('>Privacy<');
      expect(html).toContain('>Terms<');
    }
    const home = readFileSync('site/index.html', 'utf8');
    expect(home).toContain('Trace credentials before they reach logs.');
    expect(home).toContain('Read the detection limits on GitHub');
    expect(home).toContain('Allowlist a fingerprint or path for an accepted test result. Other findings stay visible.');
    expect(readFileSync('site/demo/index.html', 'utf8')).toContain('Trace the sample exposure.');
  });
});
