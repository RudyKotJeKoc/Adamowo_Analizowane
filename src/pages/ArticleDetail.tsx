import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { renderMarkdownToHtml, slugifyId } from '@/lib/markdown';
import type { Lang } from '@/i18n';

type ArticleIndex = {
  generatedAt: string;
  articles: {
    title: string;
    slug: string;
    lang: Lang;
    excerpt: string;
    tags: string[];
    outPath: string;
    headings: { level: number; text: string; id: string }[];
    updatedAt: string;
  }[];
};

const AMBER = '#f59e0b';

export default function ArticleDetail() {
  const { slug = '' } = useParams();
  const [idx, setIdx] = useState<ArticleIndex | null>(null);
  const [md, setMd] = useState<string>('');
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  const article = useMemo(() => {
    return (idx?.articles || []).find((a) => a.slug === slug);
  }, [idx, slug]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/articles.json', { cache: 'no-store' });
        if (res.ok) setIdx((await res.json()) as ArticleIndex);
      } catch (err) {
        console.warn('articles.json load failed', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    async function loadMd() {
      if (!article?.outPath) return;
      try {
        const res = await fetch(article.outPath, { cache: 'no-store' });
        if (res.ok) setMd(await res.text());
      } catch (err) {
        console.warn('article md load failed', err);
      }
    }
    loadMd();
  }, [article?.outPath]);

  const html = useMemo(() => {
    const raw = renderMarkdownToHtml(md);
    // sanitize
    const clean = DOMPurify.sanitize(raw);
    return clean;
  }, [md]);

  // Add ids to headings and setup scrollspy
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // ensure h2/h3 have ids
    el.querySelectorAll('h2, h3').forEach((h) => {
      const text = h.textContent || '';
      const id = slugifyId(text);
      if (id && !h.id) h.id = id;
    });
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) setActiveId(id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    el.querySelectorAll('h2[id], h3[id]').forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [html]);

  useEffect(() => {
    // SEO meta
    if (!article) return;
    document.title = `${article.title} – Radio Adamowo`;
    const metaDesc = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      document.head.appendChild(m);
      return m;
    })();
    metaDesc.setAttribute('content', article.excerpt || article.title);
    const ogt = document.querySelector('meta[property="og:title"]') || (() => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      document.head.appendChild(m);
      return m;
    })();
    ogt.setAttribute('content', article.title);
    const ogd = document.querySelector('meta[property="og:description"]') || (() => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      document.head.appendChild(m);
      return m;
    })();
    ogd.setAttribute('content', article.excerpt || article.title);
  }, [article]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <span style={{ color: AMBER }}>▮</span>
            {article?.title || 'Artykuł'}
          </h1>
          <nav className="text-sm">
            <Link to="/artykuly" className="text-neutral-300 hover:text-white underline" aria-label="Powrót do listy artykułów">← Artykuły</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[260px,1fr]">
        {/* TOC - desktop */}
        <aside className="hidden lg:block sticky top-20 self-start">
          <nav aria-label="Spis treści" className="text-sm">
            <ul className="space-y-2">
              {(article?.headings || []).filter(h => h.level <= 3).map((h, i) => (
                <li key={i} className={activeId === h.id ? 'text-white' : 'text-neutral-400'}>
                  <a href={`#${h.id}`} className="hover:text-white">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <section>
          {/* TOC mobile */}
          <details className="lg:hidden mb-4">
            <summary className="cursor-pointer select-none text-neutral-300">Spis treści</summary>
            <nav aria-label="Spis treści (mobilny)" className="text-sm mt-2">
              <ul className="space-y-2">
                {(article?.headings || []).filter(h => h.level <= 3).map((h, i) => (
                  <li key={i}>
                    <a href={`#${h.id}`} className="text-neutral-300 hover:text-white">{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <article
            ref={contentRef}
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
            aria-label="Treść artykułu"
          />
        </section>
      </main>
    </div>
  );
}