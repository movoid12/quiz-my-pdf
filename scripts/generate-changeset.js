#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [, , prNumber, title, ...bodyParts] = process.argv;
const body = bodyParts.join(' ');
if (!(prNumber && title)) {
  console.error(
    'Usage: node scripts/generate-changeset.js <pr-number> <title> [body]',
  );
  process.exit(2);
}

const fileName = `.changeset/pr-${prNumber}.md`;
const content = `---\n'quiz-my-pdf: patch'\n---\n\n# ${title}\n\n${body}\n`;
fs.writeFileSync(path.join(process.cwd(), fileName), content, 'utf8');
console.log('Wrote', fileName);
