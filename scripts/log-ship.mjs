import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';

const [, , jsonPath, titleArg = '' ] = process.argv;
if (!jsonPath) {
  console.error('Usage: node scripts/log-ship.mjs <path-to-json> "<short-title>"');
  process.exit(1);
}

let payload;
try {
  const raw = readFileSync(jsonPath, 'utf8');
  payload = JSON.parse(raw);
} catch (e) {
  console.error('Could not read/parse JSON at:', jsonPath);
  process.exit(1);
}

// Accept array (canonical) or single object
const entry = Array.isArray(payload) ? payload[0] : payload;
const webhook = entry?.webhook_url;
if (!webhook) {
  console.error('No "webhook_url" found in JSON. Add it to your log payload.');
  process.exit(1);
}

// Ship to n8n
async function post() {
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`Webhook POST failed: ${res.status} ${res.statusText}\n${text}`);
  }
}

try {
  await post();
  console.log('✅ Posted to n8n webhook:', webhook);
} catch (err) {
  console.error('❌', err.message);
  process.exit(1);
}

// Append to README via Step 2 script
const result = spawnSync('node', ['scripts/append-log.mjs', jsonPath, titleArg], {
  stdio: 'inherit'
});
process.exit(result.status ?? 0);
