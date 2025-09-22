## Task Breakdown, Owners, Estimates, Dependencies, and Schedule

1) Estimation scale and capacity assumptions
- We use Planning Poker with a Fibonacci scale (0.5, 1, 2, 3, 5, 8, 13) to estimate relatively by complexity, uncertainty, and effort, engaging all roles to converge on a shared understanding [1](https://www.easyagile.com/blog/planning-poker).
- Do not equate story points (SP) to fixed hours; the indicative hour ranges below are for planning communication only, not a conversion rule, and we will manage scope via velocity and empirical delivery rather than time-per-point math [2](https://www.mountaingoatsoftware.com/blog/dont-equate-story-points-to-hours).
- We cap individual tasks at 8 SP; if a task feels larger, we split it and re-estimate to improve predictability and flow before scheduling into a sprint [3](https://www.atlassian.com/agile/project-management/estimation).
- Initial team capacity assumption: 30–35 SP per two-week sprint across the team, subject to calibration after Sprint 1; forecasts are not guarantees and will be updated as new information emerges [4](https://www.scrum.org/forum/scrum-forum/33290/age-old-question-story-points-vs-hours).

Indicative hour ranges per SP (guidance, not a contract) [3](https://www.atlassian.com/agile/project-management/estimation):
- 1 SP ≈ 2–6 hours
- 2 SP ≈ 4–10 hours
- 3 SP ≈ 6–15 hours
- 5 SP ≈ 12–25 hours
- 8 SP ≈ 20–40 hours

2) Per-feature task breakdowns (F1–F9)
Feature assumptions, aligned to the prior plan:
- F1: Top 10 computation based on createdAt in playlist.json using ISO 8601 and deterministic client-side sorting [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
- F2: Client-side search using MiniSearch with accessible combobox/listbox UI [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html).
- F3: Static JSON data schema/loader and validation pipeline (no backend) [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
- F4: Date/time presentation via Intl.DateTimeFormat with explicit timeZone policy [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).
- F5: Accessibility patterns (combobox/listbox keyboarding and ARIA) [8](https://www.digitala11y.com/combobox-role/).
- F6: Performance and indexing optimizations (runtime vs prebuilt index, fuzzy tuning) [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html).
- F7: QA automation and regression (DST/date parsing, search, a11y) [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
- F8: UI integration and pages (Home with Top 10, Search, Detail, Empty/Error states) [9](https://www.w3.org/WAI/ARIA/apg/).
- F9: Optional future-backend abstraction (non-blocking; Supabase disabled) [9](https://www.w3.org/WAI/ARIA/apg/).

F1 — Top 10 by createdAt (client-side, deterministic)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F1-T1 | Define createdAt spec (ISO 8601 with Z/offset) and update sample playlist.json | David | 2 SP, 4–10h | All sample items use unambiguous ISO 8601 with Z/offset; schema doc updated [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | — |
| F1-T2 | Implement safe parser: createdAt→Date, guard NaN, define fallback/exclusion policy | Bob | 3 SP, 6–15h | Invalid strings produce NaN and are excluded/logged per policy; unit tests cover null/empty/invalid [10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) | F1-T1 |
| F1-T3 | Implement Top 10 sort descending by timestamp with stable tie-break | Alex | 2 SP, 4–10h | Sorting uses getTime/compareDesc; ties break by title to ensure stable order; unit tests green [11](https://devdocs.io/date_fns/) | F1-T2 |
| F1-T4 | Edge-case tests: date-only vs date-time, explicit offsets, DST boundaries | Iris | 3 SP, 6–15h | Tests assert deterministic ordering across locales/timezones; DST cases included [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | F1-T2 |
| F1-T5 | Top 10 UI component (shadcn/ui list/cards), empty/error states | Emma | 3 SP, 6–15h | Renders 10 items max; graceful empty/error UI; responsive layouts | F1-T3 |
| F1-T6 | Data ingestion doc: publisher checklist for createdAt | David | 1 SP, 2–6h | Markdown doc committed; linked from repo; examples include Z/offset [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | F1-T1 |

F2 — Search with MiniSearch and accessible UI
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F2-T1 | Choose MiniSearch config (fields, boosting, id) and initialize index | Alex | 3 SP, 6–15h | Index builds at runtime; fields/boosts documented; memory within budget [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html) | F3-T2 |
| F2-T2 | AddAll documents from loader; handle adds/removals | Bob | 2 SP, 4–10h | Dataset indexes without errors; reindex path documented [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html) | F2-T1,F3-T3 |
| F2-T3 | Combobox input with aria attributes and keyboard focus mgmt | Emma | 5 SP, 12–25h | role=combobox, aria-expanded/controls wired; Down Arrow moves into popup per APG [8](https://www.digitala11y.com/combobox-role/) | F5-T1 |
| F2-T4 | Results popup listbox with option items and navigation | Emma | 5 SP, 12–25h | role=listbox with option children; Up/Down/Home/End, aria-activedescendant tracked [12](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role) | F2-T3,F5-T2 |
| F2-T5 | Auto-suggest and prefix/fuzzy tuning for typeahead | Alex | 3 SP, 6–15h | Suggestions appear <100ms at 5k docs; minimal prefix enforced before fuzzy [13](https://www.elastic.co/blog/found-fuzzy-search) | F2-T2 |
| F2-T6 | Search result selection → navigation | Bob | 2 SP, 4–10h | Enter/click navigates; focus returns predictably; tests pass | F2-T4 |
| F2-T7 | Search unit tests (query variants, fuzzy/prefix) | Iris | 2 SP, 4–10h | Tests for exact/prefix/fuzzy; latency assertions in CI [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html) | F2-T5 |

F3 — Static data schema, loader, validation (no backend)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F3-T1 | Define JSON schema/types; required fields incl. createdAt | David | 2 SP, 4–10h | Schema published; type checks in build; createdAt required [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | — |
| F3-T2 | Implement loader to fetch static JSON and cache in memory | Bob | 3 SP, 6–15h | Single network fetch; memoized; retries with backoff | F3-T1 |
| F3-T3 | Validation: reject malformed createdAt; sanitize missing fields | Alex | 3 SP, 6–15h | Invalid items dropped with reason; metrics logged; tests cover NaN parse [10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) | F3-T2 |
| F3-T4 | Data pipeline hook: emit normalized docs to search index | Bob | 2 SP, 4–10h | Emits normalized docs with stable ids; order-agnostic | F3-T3,F2-T1 |
| F3-T5 | CI step: schema validation on PR | David | 1 SP, 2–6h | PR fails on invalid JSON; report lists offending items | F3-T1 |

F4 — Date/time presentation and locale policy
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F4-T1 | Implement Intl.DateTimeFormat wrapper with explicit timeZone | Alex | 2 SP, 4–10h | Dates render consistently given locale/timeZone; snapshot tests [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) | F1-T2 |
| F4-T2 | Apply formatter in Top 10 and Detail views | Bob | 2 SP, 4–10h | All visible dates use wrapper; no direct Date.toString calls [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) | F4-T1,F8-T2 |
| F4-T3 | Documentation: display policy (UTC vs local) | David | 1 SP, 2–6h | Policy recorded; examples for “medium/short” styles [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) | F4-T1 |

F5 — Accessibility baseline (combobox/listbox patterns)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F5-T1 | A11y design review: combobox interaction model | Emma | 2 SP, 4–10h | Interaction spec aligns with APG; flows documented [9](https://www.w3.org/WAI/ARIA/apg/) | — |
| F5-T2 | aria-activedescendant and selection state handling | Bob | 3 SP, 6–15h | Active option tracked correctly; aria-selected reflects state [12](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role) | F5-T1 |
| F5-T3 | Keyboard support: type-ahead, Esc, Tab/Shift+Tab | Alex | 3 SP, 6–15h | Behavior matches combobox/listbox expectations [8](https://www.digitala11y.com/combobox-role/) | F5-T2 |
| F5-T4 | Automated a11y checks (axe) + manual screen reader smoke | Iris | 2 SP, 4–10h | No critical violations; SR announces roles/states properly [9](https://www.w3.org/WAI/ARIA/apg/) | F2-T4 |

F6 — Performance and indexing
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F6-T1 | Runtime indexing budget and metrics (TTI/memory) | David | 2 SP, 4–10h | Budget set; metrics dashboard in CI for index size/time [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html) | F2-T1 |
| F6-T2 | Lazy-load index and code-split search route | Alex | 3 SP, 6–15h | Search bundle loads on demand; TTI unaffected on Home | F6-T1 |
| F6-T3 | Prefix-length tuning and fuzzy distance guardrails | Bob | 2 SP, 4–10h | prefix_length enforced; 95th percentile query <150ms [13](https://www.elastic.co/blog/found-fuzzy-search) | F2-T5 |
| F6-T4 | Optional: prebuilt JSON index script (build-time) | Alex | 5 SP, 12–25h | Prebuilt index generated from playlist.json; behind flag; not used by default [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html) | F3-T1 |
| F6-T5 | Bundle size budget and CI check | David | 1 SP, 2–6h | CI fails if bundle exceeds budget; action items auto-created | F6-T2 |

F7 — QA automation and regression
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F7-T1 | Unit tests for Date.parse vs ISO and NaN handling | Iris | 2 SP, 4–10h | Invalid formats → NaN; ISO parses as expected; tests green [10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) | F1-T2 |
| F7-T2 | DST boundary regression pack | Iris | 2 SP, 4–10h | Cases around spring/fall transitions; deterministic results [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | F7-T1 |
| F7-T3 | E2E: Top 10 ordering and search flows | Bob | 3 SP, 6–15h | Cypress/Playwright scenarios pass reliably | F1-T5,F2-T6 |
| F7-T4 | A11y automated checks in CI | Alex | 2 SP, 4–10h | axe checks run per PR; no critical violations [9](https://www.w3.org/WAI/ARIA/apg/) | F5-T4 |

F8 — UI integration and pages (static React/shadcn/ui)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F8-T1 | Home page with Top 10 section and entry points | Emma | 3 SP, 6–15h | Home renders Top 10; link to Search; responsive | F1-T5 |
| F8-T2 | Detail page: metadata and formatted createdAt | Bob | 2 SP, 4–10h | Visible date via Intl wrapper; deep linkable [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) | F4-T1 |
| F8-T3 | Search page layout using combobox/listbox | Emma | 3 SP, 6–15h | Layout integrates F2 widgets; empty states | F2-T4 |
| F8-T4 | Empty/error states for data fetch | Alex | 2 SP, 4–10h | Network errors surfaced; retry; accessible alerts | F3-T2 |

F9 — Optional future-backend abstraction (non-blocking; Supabase disabled)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| F9-T1 | Define DataSource interface (static JSON vs future API) | David | 2 SP, 4–10h | Interface documented; default impl = static JSON; feature-flagged | F3-T2 |
| F9-T2 | Adapter skeleton for Supabase (disabled path) | Alex | 3 SP, 6–15h | Stub compiles; not bundled by default; behind env flag | F9-T1 |
| F9-T3 | Risk check: ensure no runtime backend calls in MVP | Iris | 1 SP, 2–6h | CI check verifies adapters disabled in production build | F9-T2 |

3) Cross-cutting tasks (supporting multiple features)
| Task ID | Description | Owner | Estimate (SP,hours) | Acceptance checks | Dependencies |
| --- | --- | --- | --- | --- | --- |
| X-T1 | Definition of Ready/Done adoption and board policies | David | 1 SP, 2–6h | DoR/DoD visible; used in PR templates; reduces rework [3](https://www.atlassian.com/agile/project-management/estimation) | — |
| X-T2 | RICE rubric snapshot and trace links to backlog | David | 1 SP, 2–6h | Each feature links to RICE decision; exceptions documented [14](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/) | — |
| X-T3 | Performance smoke in CI (Lighthouse run) | Alex | 2 SP, 4–10h | Failing thresholds block merges; report attached to PR | F6-T1 |
| X-T4 | Documentation hub for data/date/search policies | Emma | 2 SP, 4–10h | Central README links to F1/F2/F4 policies; kept updated [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) | F1-T6,F4-T3 |
| X-T5 | Accessibility checklist for UI stories (AC templates) | Iris | 1 SP, 2–6h | AC templates include roles, keyboard, name/role/value [15](https://www.visual-paradigm.com/scrum/definition-of-done-vs-acceptance-criteria/) | F5-T1 |

4) Dependency map summary and risk hotspots
- Critical chains
  - F1-T1→F1-T2→F1-T3→F1-T5→F8-T1: Data spec to Top 10 UI to Home integration is on MVP’s critical path [5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).
  - F3-T2→F3-T3→F2-T1→F2-T2→F2-T3→F2-T4→F2-T6: Loader/validation to indexed, accessible search flow is the second MVP critical path [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html).
  - F4-T1→F4-T2: Date formatting wrapper before applying across views [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).
  - F5-T1→F5-T2→F5-T3→F5-T4: A11y pattern spec through to checks to keep search usable for keyboard/AT users [9](https://www.w3.org/WAI/ARIA/apg/).
  - F6-T2→F6-T3: Lazy-load then tune prefix/fuzzy for responsive search UX at scale [13](https://www.elastic.co/blog/found-fuzzy-search).
- Risk hotspots
  - Ambiguous dates in incoming JSON causing non-deterministic ordering; mitigated by strict ISO requirement and NaN guards in F1/F3 [10](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
  - Search latency under fuzzy queries on low-end devices; mitigated by prefix_length and lazy-loading search bundle [13](https://www.elastic.co/blog/found-fuzzy-search).
  - Accessibility regressions with custom combobox/listbox; mitigated by APG alignment and automated checks [9](https://www.w3.org/WAI/ARIA/apg/).
  - Scope creep into backend work; mitigated by keeping F9 optional and feature-flagged; MVP uses static JSON only [9](https://www.w3.org/WAI/ARIA/apg/).

5) Schedule: MVP (Sprint 1) and Sprint 2 allocation
Two-week sprints; sequencing honors critical dependencies; all tasks are frontend/static-only. Any future-backend abstraction work in F9 is optional and must not block MVP; Supabase remains disabled in all production builds for MVP and Sprint 2 [9](https://www.w3.org/WAI/ARIA/apg/).

Sprint 1 (MVP focus: Top 10, Search baseline, Data pipeline, A11y baseline, Core pages)
| Area | Tasks |
| --- | --- |
| F1 Top 10 | F1-T1, F1-T2, F1-T3, F1-T5, F1-T6, F1-T4 |
| F2 Search (baseline) | F2-T1, F2-T2, F2-T3, F2-T4 |
| F3 Data pipeline | F3-T1, F3-T2, F3-T3, F3-T4 |
| F4 Date/locale | F4-T1 |
| F5 Accessibility | F5-T1, F5-T2 |
| F7 QA | F7-T1, F7-T3 |
| F8 UI integration | F8-T1, F8-T3 |
| Cross-cutting | X-T1, X-T4 |

Notes:
- Critical path items are front-loaded: F1-T1→T3 and F3-T2→F2-T4 to ensure Home and Search are shippable; keyboarding and ARIA are included to avoid rework [9](https://www.w3.org/WAI/ARIA/apg/).
- Estimates sum within 30–35 SP capacity; any overflow moves to Sprint 2 after Planning Poker calibration [3](https://www.atlassian.com/agile/project-management/estimation).

Sprint 2 (Enhancements: formatting, performance, advanced a11y/tests, detail page, optional prebuilt index)
| Area | Tasks |
| --- | --- |
| F2 Search (enhancements) | F2-T5, F2-T6, F2-T7 |
| F4 Date/locale | F4-T2, F4-T3 |
| F5 Accessibility | F5-T3, F5-T4 |
| F6 Performance | F6-T1, F6-T2, F6-T3, F6-T5, F6-T4 (optional) |
| F7 QA | F7-T2, F7-T4 |
| F8 UI integration | F8-T2, F8-T4 |
| F9 Backend abstraction | F9-T1, F9-T2, F9-T3 (all optional, behind flags) |
| Cross-cutting | X-T2, X-T3, X-T5 |

Sequencing highlights:
- Apply the date formatter across views after wrapper stability (F4-T2 after F4-T1) [7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).
- Performance tuning follows baseline search completion to measure real impact (F6 chain after F2 baseline) [6](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html).
- A11y verification (F5-T4) and DST regressions (F7-T2) finalize quality gates before Sprint 2 release [9](https://www.w3.org/WAI/ARIA/apg/).