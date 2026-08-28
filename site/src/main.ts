import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import './style.css';
import { declaredValues, traceDemo } from './scanner';

const sourceInput = document.querySelector<HTMLTextAreaElement>('#source-input');
const sinkInput = document.querySelector<HTMLTextAreaElement>('#sink-input');
const result = document.querySelector<HTMLElement>('#trace-result');
const traceButton = document.querySelector<HTMLButtonElement>('#trace-button');
const clearButton = document.querySelector<HTMLButtonElement>('#clear-button');
const benchClock = document.querySelector<HTMLElement>('#bench-clock');
const connectionState = document.querySelector<HTMLElement>('#connection-state span:last-child');
const resetDemoButton = document.querySelector<HTMLButtonElement>('#reset-demo');

const demoSample = {
  source: 'PUBLIC_URL=https://example.test\nDEPLOY_TOKEN=demo-river-9347',
  sink: 'build complete\nupload token: demo-river-9347',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

async function runTrace(): Promise<void> {
  if (!sourceInput || !sinkInput || !result || !traceButton || !benchClock) return;
  const candidates = declaredValues(sourceInput.value);
  if (candidates.length === 0) {
    result.className = 'trace-result error-result';
    result.innerHTML = '<div class="result-heading"><span aria-hidden="true">!</span><div><strong>No traceable source</strong><p>Add a credential-like variable name and a value of at least 8 characters.</p></div></div>';
    sourceInput.focus();
    return;
  }

  traceButton.disabled = true;
  traceButton.textContent = 'Tracing…';
  benchClock.textContent = 'SCANNING';
  result.className = 'trace-result loading-result';
  result.innerHTML = '<div class="result-empty"><span aria-hidden="true">···</span><p>Comparing declared values with the sink…</p></div>';

  try {
    const findings = await traceDemo(sourceInput.value, sinkInput.value);
    if (findings.length === 0) {
      result.className = 'trace-result clear-result';
      result.innerHTML = '<div class="result-heading"><span aria-hidden="true">✓</span><div><strong>Clear path</strong><p>No declared value reached this sink.</p></div></div>';
      benchClock.textContent = 'CLEAR / 00';
    } else {
      const paths = findings.map(finding => `<li><span class="source-node">.env.local:${finding.sourceLine}</span><i aria-hidden="true"></i><span class="command-node">command</span><i aria-hidden="true"></i><span class="sink-node">release.log:${finding.sinkLine}</span><small>${escapeHtml(finding.name)} · ${finding.fingerprint}</small></li>`).join('');
      result.className = 'trace-result exposed-result';
      result.innerHTML = `<div class="result-heading"><span aria-hidden="true">×</span><div><strong>${findings.length} exposed path${findings.length === 1 ? '' : 's'}</strong><p>Value redacted. Fingerprint and locations only.</p></div></div><ol class="demo-paths">${paths}</ol>`;
      benchClock.textContent = `EXPOSED / ${String(findings.length).padStart(2, '0')}`;
    }
  } catch {
    result.className = 'trace-result error-result';
    result.innerHTML = '<div class="result-heading"><span aria-hidden="true">!</span><div><strong>Trace could not run</strong><p>This browser does not provide the local hashing API. Try a current browser.</p></div></div>';
    benchClock.textContent = 'ERROR';
  } finally {
    traceButton.disabled = false;
    traceButton.textContent = 'Trace paths';
  }
}

traceButton?.addEventListener('click', () => void runTrace());
clearButton?.addEventListener('click', () => {
  if (!sourceInput || !sinkInput) return;
  sourceInput.value = 'PUBLIC_URL=https://example.test\nDEPLOY_TOKEN=demo-river-9347';
  sinkInput.value = 'build complete\n0 warnings';
  void runTrace();
});

resetDemoButton?.addEventListener('click', () => {
  if (!sourceInput || !sinkInput) return;
  sourceInput.value = demoSample.source;
  sinkInput.value = demoSample.sink;
  void runTrace();
});

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy ?? '';
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
    } catch {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.append(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      button.textContent = 'Copied';
    }
    window.setTimeout(() => { button.textContent = button.classList.contains('code-copy') ? 'Copy command' : 'Copy'; }, 1600);
  });
});

function updateConnection(): void {
  if (connectionState) connectionState.textContent = navigator.onLine ? 'The loaded lab works if your connection drops' : 'Connection dropped — this loaded lab still works';
}

window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
updateConnection();

if (window.location.pathname.replace(/\/+$/, '') === '/demo') {
  void runTrace();
}
