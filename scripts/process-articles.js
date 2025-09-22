/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();
const SRC_DIRS = [path.join(root, 'public', 'content'), path.join(root, 'public', 'articles')];
const OUT_DIR = path.join(root, 'public', 'generated', 'articles');
const INDEX_FILE = path.join(root, 'public', 'data', 'articles.json');

const AMBER_TAGS = ['manipulacja', 'prawo', 'psychologia'];

function removeDiacritics(str) {
  const map = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z',
  };
  return str.split('').map((ch) => map[ch] || ch).join('');
}
function slugify(str) {
  return removeDiacritics(String(str || ''))
    .toLowerCase()
    .replace(/[^a-z0-9\s/_-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
}
async function ensureDir(p) {
  try {
    await fs.mkdir(p, { recursive: true });
  } catch {}
}
async function walk(dir) {
  const out = [];
  async function rec(d) {
    let entries = [];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) await rec(full);
      else if (/\.(txt|md)$/i.test(ent.name)) out.push(full);
    }
  }
  await rec(dir);
  return out;
}
function detectTitleFromContent(txt, fallback) {
  const lines = (txt || '').split(/\r?\n/).map((l) => l.trim());
  const firstNonEmpty = lines.find((l) => l.length > 0) || '';
  if (firstNonEmpty.length >= 3 && firstNonEmpty.length <= 140) return firstNonEmpty.replace(/^#+\s*/, '');
  return fallback;
}
function txtToMarkdown(txt, filename) {
  const rawLines = (txt || '').split(/\r?\n/);
  const md = [];
  // Title
  const baseTitle = path.basename(filename).replace(/\.[^.]+$/, '');
  const title = detectTitleFromContent(txt, baseTitle);
  md.push(`# ${title}`);
  md.push('');
  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i].trimEnd();

    // Promote section-like lines ending with ":" to headings
    if (/^[^\s].{1,80}:\s*$/.test(line)) {
      md.push(`## ${line.replace(/:\s*$/, '')}`);
      continue;
    }

    // Bullet points -> Markdown list
    if (/^\s*[-*•]\s+/.test(line)) {
      line = line.replace(/^\s*[•*]\s+/, '- ');
      md.push(line);
      continue;
    }

    // Numbered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const m = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
      md.push(`${m ? m[1] : '1'}. ${m ? m[2] : line}`);
      continue;
    }

    // Emphasize "UWAGA"/"WAŻNE" start
    if (/^\s*(UWAGA|WAŻNE)\b/i.test(line)) {
      md.push(`**${line}**`);
      continue;
    }

    // Preserve blank lines, normal paragraphs
    if (line.trim().length === 0) md.push('');
    else md.push(line);
  }
  return md.join('\n');
}
function extractTOC(markdown) {
  const lines = (markdown || '').split(/\r?\n/);
  const toc = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) {
      const level = m[1].length; // 2 for h2, 3 for h3
      const text = m[2].trim();
      const id = slugify(text);
      toc.push({ level, text, id });
    }
  }
  return toc;
}
function excerptFromMarkdown(markdown, maxChars = 220) {
  const text = (markdown || '').replace(/[#*_>`-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastDot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return (lastDot > 60 ? cut.slice(0, lastDot + 1) : cut) + ' …';
}
function guessLangFromPath(p) {
  const low = p.toLowerCase();
  if (/(\/en\/|\.en\.)/.test(low)) return 'en';
  if (/(\/nl\/|\.nl\.)/.test(low)) return 'nl';
  return 'pl';
}
function getTagsFromPath(p) {
  const parts = p.split(path.sep)
    .map((x) => slugify(x))
    .filter(Boolean);
  // drop 'public', 'content', 'articles', 'generated'
  const tags = parts.filter((x) => !['public','content','articles','generated'].includes(x));
  return Array.from(new Set(tags.filter((x) => x.length >= 3)));
}

async function main() {
  const files = (await Promise.all(SRC_DIRS.map(walk))).flat();
  await ensureDir(OUT_DIR);
  const index = [];

  for (const src of files) {
    const relFromPublic = path.relative(path.join(root, 'public'), src);
    const relDir = path.dirname(relFromPublic);
    const base = path.basename(src);
    const baseNoExt = base.replace(/\.[^.]+$/, '');
    const normalizedBase = `${slugify(baseNoExt)}.md`;
    const outDir = path.join(OUT_DIR, relDir.replace(/^content[\\/]?|^articles[\\/]?/, '')); // keep structure, drop top-level folder name
    await ensureDir(outDir);
    const outPath = path.join(outDir, normalizedBase);

    const raw = await fs.readFile(src, 'utf-8');
    const isTxt = /\.txt$/i.test(src);
    const markdown = isTxt ? txtToMarkdown(raw, base) : raw;
    const toc = extractTOC(markdown);

    const title = detectTitleFromContent(markdown, baseNoExt);
    const slug = slugify(path.join(relDir.replace(/^content[\\/]?|^articles[\\/]?/, ''), baseNoExt));
    const excerpt = excerptFromMarkdown(markdown);
    const tags = Array.from(new Set([...getTagsFromPath(src), ...AMBER_TAGS.filter(() => false)])); // reserved for future auto-tagging
    const lang = guessLangFromPath(src);

    await fs.writeFile(outPath, markdown, 'utf-8');

    index.push({
      title,
      slug, // used as /artykuly/:slug
      lang,
      excerpt,
      tags,
      sourcePath: `/${relFromPublic.replace(/\\/g, '/')}`,
      outPath: `/generated/articles/${relDir.replace(/^content\/?|^articles\/?/, '')}/${normalizedBase}`.replace(/\\/g, '/'),
      headings: toc,
      updatedAt: new Date().toISOString(),
    });
  }

  // sort index alphabetically by title for stability
  index.sort((a, b) => a.title.localeCompare(b.title, 'pl'));

  await ensureDir(path.dirname(INDEX_FILE));
  await fs.writeFile(INDEX_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), articles: index }, null, 2), 'utf-8');
  console.log(`✅ Articles processed: ${index.length}, index -> ${path.relative(root, INDEX_FILE)}`);
}

main().catch((err) => {
  console.error('❌ process-articles failed:', err);
  process.exit(1);
});