# Warsztat „Przyszłość Radia Adamowo” – Perspektywa Architektury (Bob)

Data: 2025-09-22 (Los Angeles)  
Projekt: `/workspace/shadcn-ui`  
Kontext: SPA (Vite + React/TypeScript + Tailwind + shadcn-ui), PWA (manifest + sw.js), build-time skrypty: `scripts/build-content.js`, `scripts/process-articles.js`.  
Backend: Supabase WYŁĄCZONY (lokalnie: pliki + localStorage + offline PWA).  

## Cel i zakres
- Uporządkować moduły (PluginManager, komponenty, warstwa usług/parsowania).
- Zaproponować strategię cache w `sw.js` dla audio, treści i offline.
- Zaprojektować generowanie SEO meta z indeksów (SPA, dynamic `<head>`).
- Architektura wyszukiwarki: lokalna (lunr/mini-lucene) vs serwerowa (opcjonalnie przyszłościowo).
- Komentarze: izolacja danych lokalnych, eksport/import, ścieżka migracji do backendu (Supabase).
- Dane „Prawo dla ofiar”: model treści (artykuły/Q&amp;A/wideo), taksonomia i metadane.
- Radio: losowe odtwarzanie per kategoria + „Top 10 najnowszych” (preferowane `createdAt` z playlist.json; fallback z nazw plików).

---

## Refaktoryzacja modułów i struktura
Proponowana struktura folderów (warstwy i granice odpowiedzialności):

```
src/
  app/
    App.tsx
    routes.ts
    providers/            # Router, I18n, Theme, Helmet
  components/
    articles/
      ArticleCard.tsx
      ArticleDetail.tsx
      TocSidebar.tsx      # ScrollSpy + anchors
      ReadMore.tsx        # używa PluginManager
    radio/
      RadioControls.tsx
      NowPlaying.tsx
    common/
      LanguageSwitcher.tsx
      PullQuote.tsx
      SeoHelmet.tsx       # meta z indeksów
  plugins/
    PluginManager.ts      # kontrakty, rejestr, lifecycle
    plugins/
      ReadMoreTransition.ts
      ScrollReveal.ts
  services/
    content/
      ContentIndex.ts     # load + cache content_index.json
      ArticlesIndex.ts    # load + cache articles.json
      MarkdownRender.ts   # md -> HTML z kotwicami <h2 id="...">
    search/
      SearchIndex.ts      # lunr/mini-lucene, tokenizacja PL
    radio/
      AudioEngine.ts      # odtwarzanie, shuffle, kanały
      TopTen.ts           # algorytm Top 10 z playlist.json
    comments/
      CommentsStore.ts    # localStorage + eksport/import
    i18n/
      I18nManager.ts
  scripts/
    build-content.js
    process-articles.js
    build-search.js       # NOWE: generuje search_index.json, tags_index.json
public/
  data/
    content_index.json
    articles.json
    playlist.json
    search_index.json     # NOWE
    tags_index.json       # NOWE
```

Kluczowe założenia:
- Komponenty (UI) nie znają źródeł danych – korzystają z warstwy `services/*`.
- PluginManager zapewnia lekki system pluginów UI (np. animacja „czytaj dalej”), bez zależności od routera – czysta kompozycja/props.
- Parsowanie/SEO/Toc w `services/content/*` oraz `components/articles/*` (render + semantyka).
- Radio ma wydzielony `AudioEngine` (imperatywna kontrola audio) i czystą logikę „Top 10”.

Kontrakty (TypeScript, skrót):
```
interface IPlugin {
  name: string;
  init?(ctx: PluginContext): void;
  beforeRender?(node: React.ReactNode, props: Record<string, unknown>): React.ReactNode;
  afterRender?(node: React.ReactNode, props: Record<string, unknown>): React.ReactNode;
  dispose?(): void;
}

interface PluginContext {
  router: Router;
  i18n: I18nManager;
  config: Record<string, unknown>;
}

type ArticleMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  type: "article" | "qa" | "video";
  taxonomy?: Taxonomy;
  toc?: TocItem[];
  lang?: "pl" | "en" | "nl";
};

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Taxonomy = {
  domain: "prawo" | "psychologia" | "profilaktyka" | "edukacja";
  legal?: { code: "KC" | "KK" | "KPC" | "KRiO"; article?: string };
  topic?: string; // np. "manipulacja", "dożywocie"
};

type Comment = {
  id: string;
  articleSlug: string;
  author?: string;
  body: string;
  createdAt: string;
  parentId?: string;
  reactions?: Record<string, number>;
};
```

---

## Strategia cache w sw.js (audio/offline)
Cele:
- Stabilny offline dla krytycznych zasobów (HTML, CSS, JS, manifest, indeksy).
- Bezpieczne dla audio (unikamy dużego cache, problemów z odświeżaniem streamów).
- Szybkie odświeżanie treści (stale-while-revalidate dla JSON indeksów).

Proponowana strategia (bez Workbox, prosty SW):
- Precache (install): `/index.html`, bundel JS/CSS, `/public/data/*.json` (małe), `/manifest.json`, `/icons/*`.
- Cache-first: statyczne assety (JS/CSS/ico/fonts) – wersjonowanie przez nazwę pliku (Vite).
- Stale-while-revalidate: `content_index.json`, `articles.json`, `search_index.json`, `tags_index.json`.
- Network-first z fallback: strony dynamiczne (nawigacja SPA -> fallback do `index.html` offline).
- Audio: requesty do `/public/music/*` i `/public/audio/*` – nie cache’ować długoterminowo; jeśli konieczne, `cache.put()` z limitami i LRU (np. max 3 utwory, limit rozmiaru). Dla streamów HLS/MP3 – `fetch` bez cache (lub `no-store`).

Pseudokod SW (skrót):
```
const STATIC_CACHE = "static-v1";
const DATA_CACHE = "data-v1";

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(STATIC_CACHE).then((c) =>
      c.addAll([
        "/", "/index.html", "/manifest.json",
        "/assets/index-*.js", "/assets/index-*.css",
        "/icons/icon-192.png", "/icons/icon-512.png",
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![STATIC_CACHE, DATA_CACHE].includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);

  // Audio: do not cache or short-lived cache
  if (url.pathname.startsWith("/public/music/") || url.pathname.startsWith("/public/audio/")) {
    return evt.respondWith(fetch(evt.request)); // consider no-store headers
  }

  // JSON data: stale-while-revalidate
  if (url.pathname.startsWith("/public/data/")) {
    evt.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(evt.request);
        const network = fetch(evt.request).then((res) => {
          if (res.ok) cache.put(evt.request, res.clone());
          return res;
        });
        return cached || network;
      })
    );
    return;
  }

  // Static: cache-first
  if (url.pathname.startsWith("/assets/") || url.pathname.endsWith(".css") || url.pathname.endsWith(".js")) {
    evt.respondWith(
      caches.match(evt.request).then((res) => res || fetch(evt.request).then((r) => {
        const clone = r.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(evt.request, clone));
        return r;
      }))
    );
    return;
  }

  // SPA navigation fallback
  if (evt.request.mode === "navigate") {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match("/index.html"))
    );
    return;
  }
});
```

Decyzja: Nie wprowadzamy Workbox teraz (złożoność), ale pozostawiamy możliwość migracji.

---

## SEO meta generowanie (SPA)
- Użycie `react-helmet-async` (lekki, SSR-ready, ale w SPA generuje `<head>` w runtime).
- Źródła: `articles.json` i `content_index.json`.
- Dla każdego route (lista, detail) generujemy:
  - `<title>` = `{title} | Radio Adamowo`
  - `<meta name="description">` = `excerpt` (lub z leadu)
  - OG: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (opcjonalnie)
  - Canonical (`<link rel="canonical">`)
  - JSON-LD dla artykułów (Article schema.org) – opcja MVP/Sprint 2

Komponent `SeoHelmet.tsx`:
```
type SeoProps = { title: string; description: string; url?: string; image?: string; };
function SeoHelmet({ title, description, url, image }: SeoProps) { /* wstawia meta do head */ }
```

---

## Wyszukiwarka: lokalna vs serwerowa
- Stan obecny: brak backendu → wybór: lokalna wyszukiwarka:
  - Biblioteka: `lunr` lub `elasticlunr` (rozważyć wsparcie PL tokenizacji; ewentualnie własne tokeny + stop words).
  - Build-time: `scripts/build-search.js` generuje `search_index.json` (tokeny + odwrócony indeks) oraz `tags_index.json`.
  - Runtime: `services/search/SearchIndex.ts` wczytuje indeksy, filtruje po tagach, zwraca wyniki z prostym scoringiem (BM25-lite lub tf-idf).
- Przyszłościowo (Supabase WŁĄCZONY):
  - Tabela `articles` + `fulltext index` (Postgres), funkcja RPC do wyszukiwania z rankingiem i filtrem tagów.
  - Synchro: build-time push indeksów/tagów do bazy.

Decyzja: Lokalna wyszukiwarka (MVP/Sprint 2), redukuje zależność od backendu.

---

## Komentarze: izolacja danych, eksport i migracja
Model lokalny:
- Przechowywanie: `localStorage["comments:{articleSlug}"] = JSON.stringify(Comment[])`
- Import/eksport: UI pozwala pobrać/załadować plik `.json` (per artykuł lub całość).
- Moderacja: lokalny filtr (np. prosta czarna lista słów), brak auth.

Ścieżka migracji (Supabase):
- Tablice:
  - `comments(id uuid pk, article_slug text, author text, body text, created_at timestamptz, parent_id uuid null, reactions jsonb)`
  - `articles(slug pk, title, ...)`
- Realtime: subskrypcja kanału `comments:article_slug`.
- Auth: anon komentarze → token gość lub rejestracja (później).

Decyzja: Lokalnie + eksport (MVP), projekt schematu pod przyszłość.

---

## „Prawo dla ofiar” – model treści i taksonomia
Cel: spójne metadane i filtrowanie dla treści prawnych.

Taksonomia:
- `domain = "prawo"`
- `legal.code` – `"KC" | "KK" | "KPC" | "KRiO"`
- `legal.article` – np. `"art. 207 KK"` (przemoc w rodzinie), `"art. 908 KC"` (dożywocie)
- `type` – `"article" | "qa" | "video"`
- `topic` – np. `"przemoc psychiczna"`, `"manipulacja"`, `"służebność vs dożywocie"`

Przykład metadanych:
```
{
  "slug": "prawo-dla-ofiar-art-207-kk",
  "title": "Art. 207 KK: Znęcanie się — wyjaśnienie dla ofiar",
  "excerpt": "Co oznacza znęcanie się w rozumieniu KK i jakie masz narzędzia prawne.",
  "tags": ["prawo", "kk", "przemoc-psychiczna"],
  "type": "article",
  "taxonomy": { "domain": "prawo", "legal": { "code": "KK", "article": "207" }, "topic": "przemoc psychiczna" }
}
```

---

## Radio: losowe odtwarzanie i „Top 10 najnowszych”
Założenia:
- Kanały: `Podcasty`, `Muzyka`, `Mix` (z `playlist.json` — `category` per utwór).
- Losowość: Fisher–Yates shuffle per kanał.
- Top 10: sortowanie po `createdAt` (ISO) malejąco; fallback: heurystyka z nazw plików (parsowanie wzorców `YYYY-MM-DD`, `YYYYMMDD`, etc.).

Moduły:
- `services/radio/AudioEngine.ts`
  - `loadChannel(category: "podcast" | "music" | "mix"): Track[]`
  - `play(track: Track)`, `pause()`, `next()`, `prev()`, `shuffle()`
  - zdarzenia: `onTrackEnd -> auto-advance`
- `services/radio/TopTen.ts`
  - `computeTopTen(tracks: Track[], now = new Date()): Track[]`
  - `parseDateFromFilename(name: string): Date | null` (fallback)

Struktura danych:
```
type Track = {
  id: string;
  title: string;
  url: string;
  category: "podcast" | "music";
  createdAt?: string; // ISO preferowane
  duration?: number;
};
```

---

## ASCII diagramy

Architektura warstw:
```
+-------------------+         +-------------------+
|    UI Components  |<------->|   PluginManager   |
| (Articles, Radio) |         | (ReadMore, Anim)  |
+---------^---------+         +---------^---------+
          |                             |
          | uses                        | injects
          v                             v
+-------------------+         +-------------------+
|     Services      |<------->|       I18n       |
| (content/search/  |         | (UI strings)     |
|  radio/comments)  |         +-------------------+
+---------^---------+
          |
          | reads/writes
          v
+-------------------+         +-------------------+
|   Public Data     |         |   localStorage    |
| (content_index,   |         | (comments, stats) |
|  articles,        |         +-------------------+
|  playlist, search)|
+---------^---------+
          |
          v
+-------------------+
|   Service Worker  |
| (cache strategies)|
+-------------------+
```

Przepływ build-time (treści i indeksy):
```
public/content + public/articles
        |
        v
 scripts/build-content.js  &  scripts/process-articles.js
        | normalize + md + TOC + meta
        v
 public/generated/articles/*.md
        |
        v
 public/data/articles.json  &  public/data/content_index.json
        |
        v
 scripts/build-search.js  (tokenizacja PL + stop words)
        |
        v
 public/data/search_index.json  &  public/data/tags_index.json
```

Radio (runtime):
```
playlist.json -> Services.radio.loadChannel(category)
        |
        v
 shuffle -> AudioEngine.play() -> onTrackEnd -> next()
        |
        +--> TopTen.computeTopTen() -> UI (NowPlaying: "Top 10")
```

---

## Lista decyzji i uzasadnienia

1. Warstwa usług (services/*) oddziela UI od źródeł danych  
   Uzasadnienie: czystsza architektura, łatwiejsze testy unit, wymienność źródeł (lokalne pliki → Supabase).

2. PluginManager jako lekki system efektów UI (np. „czytaj dalej”)  
   Uzasadnienie: modułowość, brak tight coupling; łatwe rozszerzenia.

3. PWA cache: cache-first dla statyków, stale-while-revalidate dla indeksów, no-store dla audio  
   Uzasadnienie: bezpieczeństwo, przewidywalność, brak „psucia” streamów.

4. SEO meta: `react-helmet-async` + indeksy  
   Uzasadnienie: SPA bez SSR – dynamiczne `<head>`; gotowość na ewentualne SSR w przyszłości.

5. Wyszukiwarka lokalna (lunr/elasticlunr) + build-time indeksy  
   Uzasadnienie: brak backendu; szybkie i lekkie; łatwa migracja do Supabase.

6. Komentarze: localStorage + eksport/import JSON  
   Uzasadnienie: prywatność, brak zależności; możliwość backupu i migracji.

7. Taksonomia „Prawo dla ofiar” w metadanych  
   Uzasadnienie: lepsza nawigacja, filtrowanie, możliwość zasilenia quizów/checklist.

8. Radio: algorytm Top 10 oparty na `createdAt` (zachęta do uzupełnienia playlist.json)  
   Uzasadnienie: wiarygodny ranking; fallback z nazw plików dla zgodności wstecznej.

---

## Ryzyka i mitigacje
- Brak `createdAt` → Top 10 mniej precyzyjne.  
  Mitigacja: uzupełnić `createdAt` w `playlist.json`; dodać parser dat z nazw.

- Audio cache może powodować problemy z rozmiarem i „stare” streamy.  
  Mitigacja: no-store dla audio; ewentualnie mały LRU cache + rozmiarowe limity.

- Duże indeksy wyszukiwarki (waga JS/JSON).  
  Mitigacja: paginacja wyników, lazy load indeksu na pierwsze użycie, kompresja (gzip przez serwer).

- SEO w SPA bez SSR.  
  Mitigacja: poprawne og meta, canonical, JSON-LD; rozważyć prerender istotnych stron w przyszłości.

---

## Plan wdrożenia (architektura)
- Tydzień 1: refaktoryzacja `services/*`, PluginManager, komponenty ArticleCard/TocSidebar/RadioControls, dodanie `SeoHelmet`.
- Tydzień 2: `sw.js` – strategia cache, `build-search.js` – generacja indeksów, integracja wyszukiwarki (UI), TopTen + fallback parser.
- Tydzień 3: CommentsStore (eksport/import), taksonomia „Prawo dla ofiar” w `articles.json`, telemetria lokalna (odsłuchy, interakcje).
- Tydzień 4: polishing, testy unit/e2e, dokumentacja architektury i kontraktów API.

---

## Checklist Definition of Done (Architektura)
- Warstwy: UI ↔ Services ↔ Data ↔ SW działają zgodnie z kontraktami.
- `sw.js` wdrożone z opisanymi strategiami.
- `SeoHelmet` generuje meta z indeksów.
- `build-search.js` generuje `search_index.json` i `tags_index.json`.
- `AudioEngine` i `TopTen` działają (shuffle, auto-advance, ranking).
- `CommentsStore` wspiera eksport/import JSON.
- Metadane zawierają taksonomię dla sekcji „Prawo dla ofiar”.
