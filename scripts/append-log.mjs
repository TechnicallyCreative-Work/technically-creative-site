import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const [,, filePath, titleArg = '' ] = process.argv;
if (!filePath) {
  console.error('Usage: node scripts/append-log.mjs <path-to-json> "<short-title>"');
  process.exit(1);
}

function ensureReadmeSkeleton(p) {
  if (!existsSync(p)) {
    const dir = dirname(p);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(p,
`# Daily Logs — Changelog (v1)

This README tracks changes to the \`daily-logs/\` folder.
## Conventions
- File naming: \`YYYY-MM-DD-<short-label>.json\`
- One entry per file using the canonical schema.
- Commit message: \`chore(logs): <action> for YYYY-MM-DD — <short label>\`

## Entries
`);
  }
}

function mdEscape(s) {
  return String(s).replace(/\r?\n/g, ' ').trim();
}

const readmePath = 'daily-logs/README.md';
ensureReadmeSkeleton(readmePath);

const jsonRaw = readFileSync(filePath, 'utf8');
let data;
try {
  data = JSON.parse(jsonRaw);
} catch (e) {
  console.error('Invalid JSON in', filePath);
  process.exit(1);
}

const entry = Array.isArray(data) ? data[0] : data;
const date = entry?.date ?? 'UNKNOWN-DATE';
const fileName = filePath.split('/').pop();
const shortTitle = titleArg || entry?.project || 'Log Entry';
const note = entry?.ai_summary || entry?.notes || '';
const snippet = mdEscape(note).slice(0, 240) + (note.length > 2

cd ~/technically-creative-site

# 1) Add the helper script
mkdir -p scripts
cat > scripts/append-log.mjs <<'EOF'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const [,, filePath, titleArg = '' ] = process.argv;
if (!filePath) {
  console.error('Usage: node scripts/append-log.mjs <path-to-json> "<short-title>"');
  process.exit(1);
}

function ensureReadmeSkeleton(p) {
  if (!existsSync(p)) {
    const dir = dirname(p);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(p,
`# Daily Logs — Changelog (v1)

This README tracks changes to the \`daily-logs/\` folder.
## Conventions
- File naming: \`YYYY-MM-DD-<short-label>.json\`
- One entry per file using the canonical schema.
- Commit message: \`chore(logs): <action> for YYYY-MM-DD — <short label>\`

## Entries
`);
  }
}

function mdEscape(s) {
  return String(s).replace(/\r?\n/g, ' ').trim();
}

const readmePath = 'daily-logs/README.md';
ensureReadmeSkeleton(readmePath);

const jsonRaw = readFileSync(filePath, 'utf8');
let data;
try {
  data = JSON.parse(jsonRaw);
} catch (e) {
  console.error('Invalid JSON in', filePath);
  process.exit(1);
}

const entry = Array.isArray(data) ? data[0] : data;
const date = entry?.date ?? 'UNKNOWN-DATE';
const fileName = filePath.split('/').pop();
const shortTitle = titleArg || entry?.project || 'Log Entry';
const note = entry?.ai_summary || entry?.notes || '';
const snippet = mdEscape(note).slice(0, 240) + (note.length > 240 ? '…' : '');

let readme = readFileSync(readmePath, 'utf8');

// Skip if an entry for this file already exists
const already = new RegExp(`\\*\\*File:\\*\\*\\s*\`${fileName}\\``).test(readme);
if (already) {
  console.log('README already contains an entry for', fileName);
  process.exit(0);
}

const block =
`\n### ${date} — ${shortTitle}
- **File:** \`${fileName}\`
- **Status:** Added
- **Notes:** ${snippet || '—'}
`;

readme += block;
writeFileSync(readmePath, readme, 'utf8');

console.log('Appended changelog entry for', fileName);
