Warsztat: „Przyszłość Radia Adamowo”
Perspektywa: Product / UX / Content / Marketing

1. Ocena UX
- Nawigacja
  - Dobrze: jasne wejście do Bazy wiedzy („Artykuły”), separacja sekcji (Analizy/Fakty/Opowieści/Edukacja prawna).
  - Do poprawy: breadcrumbs (np. Baza wiedzy > Psychologia > Artykuł), stały przycisk „powrót do listy”.
  - Propozycja: dodać sticky sub‑nav dla sekcji edukacyjnych.
- Dostęp do treści
  - Dobrze: listy kart + detail, TOC/scrollspy (desktop) i rozwijany TOC (mobile).
  - Do poprawy: widoczność „czas czytania” i „ostatnio czytane”.
  - Propozycja: „reader view” (większa interlinia, szerokość kolumny ~65–75 znaków), „kopiuj link do sekcji”.
- Scrollspy i kotwice
  - Działa; dodać przy ikonach „#” przy H2/H3 (po najechaniu) + przycisk „Kopiuj”.
- Radio
  - Dobrze: losowe odtwarzanie w obrębie kategorii, Top 10, tryb „w tle”.
  - Do poprawy: wizualny wskaźnik odtwarzania (mini equalizer), subtelne mikroanimacje.

2. Content ops (Markdown, infografiki, wideo)
- Standaryzacja
  - Docelowo wszystkie treści w Markdown z front‑matter (title, date, tags, lang, summary).
  - Konwencja tagów: manipułacja, prawo, psychologia, edukacja, opowieści, case‑study etc.
- Infografiki/wideo
  - Infografiki: SVG preferowane (skalowalne, dostępne); fallback PNG/WebP.
  - Wideo: krótkie leady 30–60 s obok TL;DR; osadzanie z opisem/alt.
- Pull quotes
  - Wyróżnione cytaty (łamane) co 3–5 akapitów; krótko i jasno; używać do najważniejszych idei.

3. SEO i dostępność
- Techniczne SEO
  - Dynamiczne title/description/og: wdrożone (detail).
  - Dodać: structured data (Article/Podcast); sitemap.xml, RSS/Atom dla artykułów i podcastów.
- A11y
  - aria‑labels dla nawigacji, rola „navigation”, „main”, „complementary”.
  - Konsekwentna hierarchia H1/H2/H3; focus styles; skip‑link do #main.
  - Alt text dla obrazów; transkrypcje podcastów.
- Performance/PWA
  - PWA: dodać ikony 192/512 px; offline fallback; strategia cache dla /generated i /data.

4. Struktura „Baza wiedzy/Artykuły”
- Lista
  - Karty: tytuł, lead, tagi, czas czytania, data.
  - Filtry tagów + wyszukiwarka (client‑side fuse.js, później build‑time indeks).
- Detail
  - Kotwice H2/H3, TOC lewy (desktop) + rozwijany (mobile).
  - PluginManager: „czytaj dalej” z delikatną animacją, pull‑quotes, „kopiuj link”.
  - CTA: „Udostępnij”, „Zapisz na później”, „Powiązane artykuły”.

5. I18n (PL/EN/NL)
- MVP: UI PL/EN/NL (już jest), treści PL; plan sukcesywnego dodawania EN/NL w /public/articles/en, /nl.
- Strategia: fallback per‑slug (jeśli brak tłumaczenia).
- Redakcja: glosariusz terminów, guidelines tłumaczeniowe (ton neutralny, prosty).

6. Marketing/komunikacja
- Komunikaty
  - „Najpopularniejsze w tym tygodniu”, „Nowe artykuły”, „Nowe odcinki podcastu”.
- Kanały
  - Newsletter (Buttondown/Mailchimp), cross‑promo podcastów (Spotify/Apple).
- CTA
  - „Zapisz na później”, „Subskrybuj newsletter”, „Zgłoś temat/Q&amp;A z prawnikiem”.

7. Braki i jak uzupełnić
- Dokumentacja: „Jak dodawać artykuły” (front‑matter, obrazy, wideo).
- Testy użyteczności: 5 osób, nagranie sesji, heatmapy (lokalne metryki).
- Ikony PWA, offline fallback.

8. Priorytety i kroki
- MVP (2 tyg.)
  - Ikony PWA + offline fallback; breadcrumbs; „kopiuj link do sekcji”.
  - Wyszukiwarka z fuse.js; structured data Article/Podcast; sitemap + RSS.
  - Pull‑quotes i „reader view”.
- Sprint 2 (2–3 tyg.)
  - Transkrypcje + rozdziały podcastów; „Zapisz na później”.
  - EN wersje kluczowych artykułów; infografiki do „rachunku krzywd”.
  - Newsletter + sekcja „Najpopularniejsze”.

Uwagi: Supabase wyłączony – komentarze/Q&amp;A lokalnie, opcjonalne przełączenie później.