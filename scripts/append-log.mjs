import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const [, , filePath, titleArg = '' ] = process.argv;

if (!filePath) {
  console.error('Usage: node scripts/append-log.mjs <path-to-json> "<short-title>"');
  process.exit(1);
}

const readmePath = 'daily-logs/README.md';

function ensureReadmeSkeleton(path) {
  if (existsSync(path)) {
    return;
  }

  const directory = dirname(path);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const template = `# Daily Logs - Changelog (v1)

This README tracks changes to the \`daily-logs/\` folder.
## Conventions
- File naming: \`YYYY-MM-DD-<short-label>.json\`
- One entry per file using the canonical schema.
- Commit message: \`chore(logs): <action> for YYYY-MM-DD - <short label>\`

## Entries
`;

  writeFileSync(path, template);
}

function mdEscape(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

ensureReadmeSkeleton(readmePath);

let raw;
try {
  raw = readFileSync(filePath, 'utf8');
} catch (error) {
  console.error('Unable to read log JSON at', filePath);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (error) {
  console.error('Invalid JSON in', filePath);
  process.exit(1);
}

const entry = Array.isArray(data) ? data[0] : (data ?? {});

const date = entry?.date ?? 'UNKNOWN-DATE';
const fileName = filePath.split(/[/\\]/).pop() ?? 'UNKNOWN-FILE';
const shortTitle = titleArg.trim() || entry?.project || 'Log Entry';
const note = entry?.ai_summary || entry?.notes || '';
const excerpt = mdEscape(note).slice(0, 240);
const snippet = excerpt ? `${excerpt}${note.length > 240 ? '...' : ''}` : '-';

let readme = '';
try {
  readme = readFileSync(readmePath, 'utf8');
} catch (error) {
  console.error('Unable to read', readmePath);
  process.exit(1);
}

const marker = `**File:** \`${fileName}\``;
if (readme.includes(marker)) {
  console.log('README already contains an entry for', fileName);
  process.exit(0);
}

const block = `\n### ${date} - ${shortTitle}\n- **File:** \`${fileName}\`\n- **Status:** Added\n- **Notes:** ${snippet}\n`;

try {
  writeFileSync(readmePath, readme + block, 'utf8');
  console.log('Appended changelog entry for', fileName);
} catch (error) {
  console.error('Failed to update changelog README:', error.message);
  process.exit(1);
}
