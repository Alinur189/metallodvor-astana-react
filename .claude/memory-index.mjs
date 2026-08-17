#!/usr/bin/env node
// Пересобирает MEMORY.md по frontmatter файлов памяти.
// Запускается хуками Stop / SubagentStop, поэтому: только дописывает
// недостающие строки и никогда не переписывает уже существующие —
// вручную отредактированные заголовки и хуки остаются нетронутыми.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const memoryDir = join(
  homedir(),
  '.claude',
  'projects',
  projectDir.replace(/\//g, '-'),
  'memory'
);
const indexPath = join(memoryDir, 'MEMORY.md');

if (!existsSync(memoryDir)) process.exit(0);

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const files = readdirSync(memoryDir)
  .filter((f) => f.endsWith('.md') && f !== 'MEMORY.md')
  .sort();

let index = existsSync(indexPath)
  ? readFileSync(indexPath, 'utf8')
  : '# Project Memory\n\n';

const added = [];
for (const file of files) {
  if (index.includes(`](${file})`)) continue; // уже в индексе — не трогаем
  const fm = frontmatter(readFileSync(join(memoryDir, file), 'utf8'));
  const slug = fm.name || file.replace(/\.md$/, '');
  const title = slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
  const hook = fm.description || '(без описания)';
  index = index.replace(/\s*$/, '\n') + `- [${title}](${file}) — ${hook}\n`;
  added.push(file);
}

// Строки индекса, чей файл удалён, — помечаем, но не удаляем молча.
const orphans = [...index.matchAll(/\]\(([^)]+\.md)\)/g)]
  .map((m) => m[1])
  .filter((f) => !files.includes(f));

if (added.length) {
  writeFileSync(indexPath, index);
  console.error(`MEMORY.md: добавлено ${added.length} — ${added.join(', ')}`);
}
if (orphans.length) {
  console.error(`MEMORY.md: строки без файла — ${orphans.join(', ')}`);
}
