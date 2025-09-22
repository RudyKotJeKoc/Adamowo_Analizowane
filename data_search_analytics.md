Warsztat: „Przyszłość Radia Adamowo”
Perspektywa: Data / Search / Analytics

1. Pełnotekstowe indeksowanie – projekt
- Zakres: tytuł, excerpt, ewentualnie pierwsze 1–2 akapity i H2/H3.
- Tokenizacja PL
  - Normalizacja diakrytyków (ą→a, ż→z).
  - Stop‑words (pl): „i”, „oraz”, „że”, „który”, „jest”, „na”, „to”, „się”, „w”…
  - Opcjonalnie stemming (porter‑pl) – później.
- Scoring
  - tf‑idf/BM25 (upraszczamy do tf‑idf z boostem tytułu x3, H2 x2, excerpt x1.5).
  - Boost po tagach dopasowanych.
- Architektura (MVP bez backendu)
  - Build‑time: generacja /public/data/search_index.json (po process-articles).
  - Runtime: klient ładuje indeks, filtruje po tagach i skali trafności.
- Przyszłość: Supabase/pg_trgm/fts – gdy backend zostanie włączony.

2. Filtracja po tagach
- tags_index.json: mapowanie tag → lista slugów, counts, topN.
- UI: facety (wielokrotne), AND logic.

3. Radio Top 10 – metodologia
- createdAt desc (jeśli obecne w playlist.json).
- Fallback: porządek alfabetyczny nazwy pliku malejąco, następnie tytuł.
- Opcja: lokalne liczniki odsłuchań (popularność tygodnia).

4. Analytics (lokalnie)
- Dashboard (przyszłość): /analytics (lokalny, bez wysyłki).
  - Metryki: odsłony list/detail, kliknięcia CTA, czas czytania (heurystyka), odsłuchy, komentarze.
  - Dane lokalne: localStorage → eksport JSON; brak cookies/trackerów zewnętrznych (na start).
  - Później: Plausible/Umami (anonymized) – za zgodą.

5. Prototypy indeksów (struktura)
- search_index.json (MVP)
  - { generatedAt, version, fields: [title, excerpt, headings[], tags], items: [{ slug, title, excerpt, headings: [{id,text}], tags, lang }] }
- tags_index.json
  - { generatedAt, tags: [{ tag, count, slugs[] }] }

6. Kroki wdrożeniowe
- Sprint 1: generator build‑time (Node) → search_index.json + tags_index.json, integracja z UI (fuse.js).
- Sprint 2: scoring z boostem nagłówków, podświetlanie fraz, sort „najtrafniejsze” vs „najnowsze”.

Uwagi: Supabase wyłączony – aparatura analityczna wyłącznie lokalna lub zewnętrzna bez danych osobowych.