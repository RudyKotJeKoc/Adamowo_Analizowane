import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { Lang } from '@/i18n';
import { getUIText } from '@/i18n';

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

export default function ArticlesList({ lang }: { lang: Lang }) {
  const t = getUIText(lang);
  const [idx, setIdx] = useState<ArticleIndex | null>(null);
  const [q, setQ] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

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

  const tags = useMemo(() => {
    const set = new Set<string>();
    (idx?.articles || []).forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [idx]);

  const articles = useMemo(() => {
    let list = (idx?.articles || []).filter((a) => a.lang === lang || lang === 'pl'); // fallback
    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(qq) || a.excerpt.toLowerCase().includes(qq));
    }
    if (activeTags.length) {
      list = list.filter((a) => activeTags.every((t) => a.tags.includes(t)));
    }
    return list;
  }, [idx, q, activeTags, lang]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Baza wiedzy</h1>
          <Link to="/" className="text-sm text-neutral-300 hover:text-white underline">← Home</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section className="rounded-2xl border border-neutral-800 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <Input
              placeholder="Szukaj po tytule lub zajawce…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-neutral-900 border-neutral-800"
              aria-label="Szukaj artykułów"
            />
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <Button
                    key={tag}
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    className={active ? 'text-black' : 'border-neutral-700 hover:bg-neutral-800'}
                    style={active ? { backgroundColor: AMBER } : undefined}
                    onClick={() =>
                      setActiveTags((prev) =>
                        prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
                      )
                    }
                    aria-pressed={active}
                    aria-label={`Filtruj wg tagu ${tag}`}
                  >
                    #{tag}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <div
              key={a.slug}
              className="transform transition-transform duration-200 will-change-transform hover:-translate-y-0.5"
            >
              <Card className="bg-neutral-950 border-neutral-800 h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span style={{ color: AMBER }}>▮</span>
                    {a.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-300">{a.excerpt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <Badge key={t} variant="outline" className="border-neutral-700 text-neutral-300">#{t}</Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/artykuly/${encodeURIComponent(a.slug)}`}
                      className="text-sm font-medium"
                      style={{ color: AMBER }}
                      aria-label={`Czytaj dalej: ${a.title}`}
                    >
                      Czytaj dalej →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          {articles.length === 0 && (
            <div className="text-neutral-500">Brak wyników. Spróbuj zmienić frazę lub filtry.</div>
          )}
        </section>
      </main>
    </div>
  );
}