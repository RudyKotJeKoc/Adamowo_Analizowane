Warsztat: „Przyszłość Radia Adamowo”
Perspektywa: Frontend / Engineering

1. Performance
- Code‑splitting: lazy() dla ArticlesList/ArticleDetail/SectionPage.
- Prefetch linków w idle (react-router future, lub własny hover‑prefetch).
- PWA: ikony 192/512, offline fallback, cache SW: SWR (/data), cache‑first (/generated).
- Obrazy: preferuj SVG; rastry → WebP/AVIF; responsywne wymiary.
- CSS: kontenery i contain: content; redukcja repaintów; mikroanimacje CSS.

2. Dostępność (a11y)
- aria‑label/role dla nav/main/aside; skip‑link do #main.
- Focus states i kolejność tab; kontrast bursztyn/dark ≥ WCAG AA.
- Nagłówki: 1×H1 per widok; konsekwentne H2/H3.
- Media: alt text, transkrypcje podcastów, napisy (wideo).

3. Modularność
- Komponenty
  - ArticleCard(props: title, excerpt, tags, href).
  - TOC/ScrollSpy(props: headings) – desktop sticky, mobile details.
  - RadioControls(props: state, onPrev/onNext/onToggle).
  - MetaTags(props: title, description, og).
- Plugins
  - PluginRegistry: beforeRender/afterRender; wtyczki: read-more, pull-quote, copy-link.

4. Radio
- Losowe odtwarzanie per kategoria: tasowanie listy, Start → losowa pozycja.
- Top 10 najnowszych: sort createdAt desc; fallback: filename/tytuł.
- Brak pełnej playlisty w UI (radio w tle).

5. Knowledge Hub
- Lista: karty + filtry tagów, wyszukiwarka (fuse.js).
- Detail: kotwice H2/H3, scrollspy, TOC mobile (details), „czytaj dalej” (framer-motion lub CSS).
- SEO: MetaTags z indeksu (articles.json).

6. I18n (PL/EN/NL)
- UI gotowe; treść: foldery /public/generated/articles/en, /nl (przyszłość).
- Fallback per‑slug; mechanizm detekcji: lang param, switcher.

7. Testy
- Jednostkowe: Vitest + @testing-library/react (komponenty: TOC, ArticleCard, RadioControls).
- e2e: Playwright – ścieżki: Radio, Lista artykułów, Detail (kotwice i TOC), wyszukiwarka.
- CI (lokalne): uruchomienie lint+build+test.

8. Plan wdrożenia (estymacje)
- Sprint 1 (2 tyg.)
  - lazy routes + prefetch (0.5 d)
  - MetaTags component + structured data (1 d)
  - fuse.js search + tag filters upgrade (1.5 d)
  - PluginRegistry + read‑more/pull‑quote (2 d)
  - Breadcrumbs + reader view + copy‑link (1.5 d)
  - Vitest setup + 6–8 testów jednostkowych (1 d)
- Sprint 2 (2–3 tyg.)
  - Playwright e2e (1.5 d)
  - Archiwum podcastów + transkrypcje/rozdziały (3 d)
  - EN wersje artykułów kluczowych (redakcja) + fallback UI (2 d)
  - PWA offline fallback, ikony, SW strategia (1.5 d)

Uwagi: Supabase wyłączony – komentarze lokalnie; przygotować adapter do migracji.