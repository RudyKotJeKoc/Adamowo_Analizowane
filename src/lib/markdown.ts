import { marked } from 'marked';

export function renderMarkdownToHtml(md: string): string {
  marked.setOptions({
    gfm: true,
    breaks: false,
    mangle: false,
    headerIds: true,
    headerPrefix: '',
  });
  return marked.parse(md) as string;
}

export function slugifyId(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}