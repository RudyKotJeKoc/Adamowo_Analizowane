# Research Framework
- Project context and constraints: Clarify the current stack and limitations (shadcn/ui-based frontend, static assets, playlist.json as data source, Supabase disabled, backend only in future). Research authoritative docs on shadcn/ui usage in pure-frontend workflows and static deployment patterns to ensure feasibility and best practices.

- Stakeholder input consolidation: Define a method to merge Emma, Bob, Alex, David, and Iris’s reports into a single backlog. Research established templates and techniques for synthesizing multi-stakeholder requirements (e.g., opportunity solution trees, thematic clustering) to avoid bias and ensure traceability to sources.

- Prioritization methodology and MVP scoping: Select a defensible framework (e.g., RICE, MoSCoW, Kano) tailored to a frontend-only MVP. Research current product management guidance (Atlassian, Intercom, Mind the Product) and case studies to justify the prioritization approach and produce a scoring rubric.

- Feature set definition (features and content): Enumerate candidate features/content for MVP and Sprint 2 with acceptance criteria. Research UI/UX patterns for “Top 10” lists and site-wide search in content/media apps to ensure usability and accessibility; cite component and interaction guidelines (ARIA, WAI).

- Data model and “Top 10” logic from playlist.json: Validate createdAt formats (ISO 8601), sorting stability, timezone considerations, and potential edge cases (missing or malformed dates). Research authoritative sources (MDN, date-fns/dayjs docs) and examples for robust client-side date parsing and sorting.

- Client-side search and indexing: Evaluate libraries (Fuse.js, MiniSearch, Lunr.js) for index size, performance on medium datasets, fuzzy vs exact search, language support, and build-time vs runtime indexing trade-offs. Research library docs and independent benchmarks to choose the most suitable approach and integration patterns with React/shadcn/ui.

- Content architecture without backend: Define how content (docs, playlists) will be stored, loaded, and rendered statically (JSON, MD/MDX) and how navigation is generated. Research React/Next.js static content patterns (even if not using Next.js, the concepts apply), MDX pipelines, and static hosting constraints to avoid runtime data fetching.

- Task decomposition, ownership, and estimation: Break features into measurable frontend tasks (data loading, components, state, a11y, tests), assign owners, and estimate using a consistent scale (story points or hour ranges). Research Agile estimation best practices (Scrum Guide, Atlassian) and typical ranges for similar UI tasks to produce grounded estimates.

- Dependency mapping and sequencing: Identify and document technical and content dependencies (e.g., Top 10 requires validated createdAt; search requires built indexes; UI library tokens ready). Research techniques for visualizing dependencies (DAGs, critical path) and backlog ordering (user story mapping) to minimize blockers.

- Quality, accessibility, and performance: Define test strategy (unit, integration, E2E), accessibility checks (axe, ARIA), and performance budgets (Lighthouse). Research current accessibility standards (WAI-ARIA), performance optimization for client-side search and list rendering (virtualization), and testing tools best practices (Vitest/Jest, Playwright).

- Future backend integration strategy (Supabase): Plan an abstraction layer (repository/service pattern) to swap data sources later. Research Supabase schema and client patterns, migration strategies from local JSON to Supabase, and API shape parity to reduce refactor risk.

- Delivery workflow and documentation: Decide on tooling for task tracking and visibility (GitHub Projects, Issues) and ensure the roadmap document location and update cadence. Research lightweight documentation templates for roadmaps and changelogs to keep the team aligned.



# Search Plan
1. Compare prioritization frameworks (RICE vs MoSCoW vs Kano) for frontend-only MVPs and gather authoritative templates/rubrics from Atlassian, Intercom, and product management communities to synthesize multi-stakeholder inputs into a single prioritized backlog.

2. Investigate robust client-side handling of createdAt for a “Top 10” list: ISO 8601 parsing, timezone handling, stable sorting, and edge cases; collect code examples and guidance from MDN, date-fns/dayjs, and reputable engineering blog posts.

3. Evaluate client-side search libraries (Fuse.js, MiniSearch, Lunr.js) for a playlist/content dataset: benchmark index size and latency, fuzzy matching quality, language/stemming support, and build-time vs runtime index generation; derive integration patterns with React and shadcn/ui from official docs and independent benchmarks.

4. Research static content architectures without a backend (JSON and/or MDX pipelines): best practices for loading/rendering content, generating navigation, and handling updates on static hosting; reference Next.js/React documentation and community examples applicable to shadcn/ui-based UIs.

5. Gather best practices for Agile task decomposition and estimation for UI features (search, sortable lists): story slicing patterns, estimation scales (points/hours), common pitfalls, and sample velocity ranges; use Scrum Guide, Atlassian resources, and credible agile coaching sources.

6. Identify patterns for future-proofing a frontend for later Supabase integration: repository/service abstractions, schema alignment, data migration steps, and examples of swapping local JSON to Supabase with minimal refactor; consult Supabase docs and case studies/blogs demonstrating staged migrations.