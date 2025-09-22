Warsztat: Konsolidacja priorytetów i roadmapy
Źródła: Product/UX/Marketing, Architektura, Frontend, Data/Search/Analytics, Edukacja

1. Zasady i ograniczenia
- Supabase wyłączony (MVP lokalny; backend jako opcja przyszłościowa).
- Filar: PWA, dostępność (WCAG), SEO, edukacyjna misja.

2. Priorytety (MVP → Sprint 2)
- MVP (2 tyg.)
  - PWA: ikony 192/512, offline fallback, SW cache strategia.
  - Wyszukiwarka (fuse.js) + facety tagów; prototyp search_index.json, tags_index.json.
  - Breadcrumbs, reader view, „kopiuj link do sekcji”.
  - Structured data (Article/Podcast), sitemap.xml + RSS/Atom.
  - Pull‑quotes (PluginManager.read‑more + pull‑quote).
  - Playlist.json: uzupełnić createdAt dla precyzyjnego Top 10.
- Sprint 2 (2–3 tyg.)
  - Archiwum podcastów: serie, filtry, transkrypcje i rozdziały.
  - Edu: quiz samooceny + checklisty; Symulator rozmów (MVP JSON).
  - EN wersje kluczowych artykułów; i18n fallback per‑slug.
  - Testy e2e (Playwright); monitoring błędów (Sentry/alternatywa OSS).

3. Zadania, właściciele, estymacje
- FE
  - lazy routes + prefetch (0.5 d) – Alex
  - PluginRegistry + wtyczki (2 d) – Alex
  - MetaTags + structured data (1 d) – Alex
  - Wyszukiwarka + UI facetów (1.5 d) – Alex + David
  - Breadcrumbs + reader view + copy‑link (1.5 d) – Alex
- Architektura
  - SW strategia + offline fallback (1.5 d) – Bob
  - Sitemap/RSS build‑time (1 d) – Bob
- Data/Search
  - search_index.json, tags_index.json generator (1 d) – David
  - createdAt pola w playlist.json (0.5 d) – Redakcja + David (walidacja)
- Edukacja/Content
  - 3 artykuły „Prawo dla ofiar” + 2 infografiki (1.5 tyg.) – Iris + Redakcja
  - Quiz + checklisty (1 tydz.) – Iris + Alex (UI)
- Marketing
  - Newsletter integracja + sekcja „Najpopularniejsze” (1 d + ciągłe) – Emma

4. Zależności
- Top 10 zależne od createdAt w playlist.json (fallback działa, ale mniej precyzyjny).
- Wyszukiwarka zależna od search_index.json i tags_index.json (build‑time).
- Structured data wymaga uzupełnionego front‑matter w MD.

5. Kamienie milowe
- Koniec MVP (T+14 dni): Lighthouse ≥ 90, działają wyszukiwarka i TOC, PWA offline, sitemap/RSS, Top 10 po createdAt.
- Koniec Sprint 2 (T+35 dni): Archiwum podcastów, quiz + checklisty, i18n EN dla kluczowych materiałów, testy e2e.

6. Mierniki (KPI)
- Techniczne: Lighthouse 90+, brak błędów w konsoli prod.
- Produktowe: średni czas czytania +20%, ukończenie quizu ≥ 30%, subskrypcje newslettera/tydz.
- Edu/Prawo: pobrania wzorów pism, przejścia do sekcji pomocy.

7. Ryzyka i mitigacje
- Brak backendu: ograniczona moderacja komentarzy/Q&amp;A → lokalny eksport/import + plan migracji Supabase.
- Obciążenie treściami: standaryzacja front‑matter i pipeline build‑time (już jest).