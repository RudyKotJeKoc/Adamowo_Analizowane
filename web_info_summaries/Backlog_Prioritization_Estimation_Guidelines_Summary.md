Purpose-aligned synthesis techniques (to consolidate multi-stakeholder inputs into a traceable backlog)
- Opportunity Solution Tree (OST): A visual plan to reach a desired outcome that maps outcome → customer opportunities → solutions → assumption tests; it makes implicit assumptions explicit, aligns teams, and frames decisions as compare-and-contrast rather than yes/no [ref: 3-3].
- OST process (prerequisites and steps): Start with a clearly defined product outcome at the top; continuously interview customers to identify unmet needs/pains/desires; map the opportunity space (use an experience map of stories, group by moments); choose one target opportunity; brainstorm multiple solutions; break solutions into assumptions; test riskiest assumptions; iterate the tree and share appropriate detail with stakeholders for communication and alignment [ref: 3-4].
- User Story Mapping: A visual representation of the customer journey that arranges work under activities to provide context, prioritize by outcomes, and avoid a “flat backlog” of context-free items; helps teams focus development on customer value and desired outcomes [ref: 4-4].

Prioritization frameworks overview and selection (for a frontend MVP backlog)
- RICE (Reach, Impact, Confidence, Effort): An objective scoring system that quantifies “total impact per time worked” to help prioritize features by balancing users affected, expected impact, certainty of estimates, and delivery effort; choose when you need a proven, data-informed scoring model [ref: 1-1].
- MoSCoW (Must/Should/Could/Won’t): Helps communicate fixed-timeframe release inclusion/exclusion; useful for setting minimum-to-ship criteria; limitation is it doesn’t rank items within buckets [ref: 1-1].
- Kano (Basic/Performance/Excitement/Indifferent): Categorizes features by customer-perceived value (delight vs. must-have); useful to incorporate customer value perception; limitation is it doesn’t account for effort/complexity and surveys can be time-consuming [ref: 1-1].

RICE scoring rubric and how to tailor it
- RICE factors and formula: Score Reach (number affected in a time period), Impact (effect on goal per person), Confidence (certainty in estimates), Effort (person-months across roles); RICE Score = (Reach × Impact × Confidence) / Effort [ref: 1-0].
- Impact scale (Intercom): 3 massive, 2 high, 1 medium, 0.5 low, 0.25 minimal; Confidence scale: 100% high, 80% medium, 50% low; Effort typically in whole person-months (use 0.5 for well under a month); Reach is a numeric count over a defined period (e.g., customers per quarter) [ref: 1-0].
- Practical guidance: Estimate with real product metrics for Reach, agree one primary goal for Impact, use discrete Confidence tiers to avoid paralysis, stick to whole-number Effort to keep it rough; sort by RICE, then review dependencies/table-stakes and adjust transparently [ref: 1-0].

RICE rubric template (ready to apply)
- Use this rubric with agreed scales and one outcome per scoring cycle (derived from the roadmap goal); the rubric follows Intercom’s scales and formula [ref: 1-0].

| Criterion | Scale/Units | Guidance |
| --- | --- | --- |
| Reach | Number affected over a defined period (e.g., customers per quarter) | Use analytics or historical usage; set a consistent period |
| Impact | 3, 2, 1, 0.5, 0.25 | Tie to one primary outcome (e.g., conversion, adoption) |
| Confidence | 100%, 80%, 50% | Reflect strength of data backing Reach/Impact/Effort |
| Effort | Person-months (whole numbers or 0.5 if well under a month) | Include design, frontend, QA, PM; round up for risk |
| RICE Score | (Reach × Impact × Confidence) / Effort | Sort, then review dependencies/table-stakes |

Why recommend RICE for this project
- RICE provides transparent, quantitative prioritization aligned to “impact per time worked,” which is well-suited to ranking frontend UI features for an MVP under time/resource constraints; it is a proven, widely used framework with clear scales and a formula, aiding stakeholder buy-in and repeatability [ref: 1-1].

Estimation best practices for small UI work (story points vs. hours; Planning Poker; pitfalls)
- Story points (SP) vs hours: Story points are a relative measure of effort/complexity/uncertainty and avoid the emotional attachment and variability of time-based estimates; use SP to focus on size and to support velocity-based forecasting [ref: 4-4].
- Do not equate story points to hours: Equating SP to fixed hours defeats the purpose of relative estimation; time per point varies by individual/team, and the relationship is a distribution, not a constant; use velocity and historical data instead, and if needed, convert SP to dollars by cost-per-point rather than hours [ref: 2-1].
- Planning Poker (how-to): Engage the whole team; use Fibonacci-based cards (e.g., 0, 1/2, 1, 2, 3, 5, 8, 13, 20, 40, 100); discuss a backlog item briefly; each estimator selects a card and reveals simultaneously to reduce bias; converge via discussion; repeat to build consensus for each item [ref: 4-3].
- Atlassian estimation guidance: Keep estimations high-level; involve all roles; use Planning Poker; cap individual tasks to an upper threshold (e.g., no single task >16 hours or define an upper SP cap); break down large items and re-estimate; calibrate estimates in retrospectives using completed items of the same SP value [ref: 4-4].
- Forecasting and realism: Estimates are guesses made before work starts; provide sprint forecasts, not guarantees; recognize that backlog composition (e.g., unplanned work) affects capacity; communicate change as new info emerges [ref: 2-2].

Backlog grooming and traceability practices
- Backlog refinement: Groom the backlog before sprint planning to keep it healthy, ready, and prioritized; consistent refinement supports efficient sprint planning and avoids time wasted detailing items during the meeting [ref: 4-4].
- Definition of Done (DoD) vs. Acceptance Criteria (AC): DoD is a shared checklist of quality/completion standards applied to every backlog item/increment (e.g., code reviewed, tests passed, PO accepted) to ensure shippable quality; AC are item-specific testable conditions that define when a particular story is acceptable (e.g., form requires mandatory fields, data persisted, email acknowledgment) [ref: 4-0].
- Definition of Ready (DoR): Criteria signaling a backlog item is ready to start (clear goals, detailed requirements, AC present, resources available, realistic timeline), reducing churn and increasing sprint predictability [ref: 4-2].
- Visualizing and standardizing DoD/AC: Make DoD and AC visible and apply them consistently as explicit policies; this standardizes quality, reduces rework, and creates a reliable, traceable process from “in progress” to “done” [ref: 4-1].
- Stakeholder traceability via OST: Use the opportunity solution tree as a living artifact to communicate how customer opportunities link to solutions and tests, tailoring the level of detail to stakeholders to keep them aligned and enable meaningful feedback [ref: 3-3].

Actionable synthesis guideline (steps and artifacts)
- Step 1: Define the desired product outcome (one product outcome per team) for MVP/Sprint 2 to scope discovery and prioritization [ref: 3-4].
- Step 2: Conduct continuous customer/stakeholder interviews; build an experience map and extract opportunities (needs, pain points, desires) to populate the OST’s opportunity space [ref: 3-4].
- Step 3: Create a User Story Map linked to the OST opportunities to contextualize features along the customer journey and avoid a flat backlog; group work under activities and prioritize by outcome [ref: 4-4].
- Step 4: Select a target opportunity (assess by opportunity sizing, company/customer factors) and brainstorm multiple UI solutions; capture assumptions; plan tests [ref: 3-4].
- Step 5: Run assumption tests; feed learnings back into the OST and story map; update backlog items with AC/DoR and trace links to opportunities for auditability [ref: 3-4].
- Step 6: Score backlog items using the RICE rubric; sort by score; then adjust for dependencies/table-stakes; document exceptions and decisions for transparency [ref: 1-0].
- Step 7: Refine backlog (ready state): Ensure AC present, DoR met, and apply DoD for completed items; schedule Planning Poker to estimate with SP; break down items exceeding the size cap and re-estimate [ref: 4-4].
- Step 8: Communicate: Share OST snapshots and prioritized backlog with stakeholders; use sprint reviews to gather feedback and keep alignment [ref: 3-3].

Estimation guide (process and examples)
- Scale: Use Fibonacci story points with reference stories calibrated to past work; avoid mapping SP to hours; estimate collaboratively via Planning Poker [ref: 4-3].
- Process: For each UI backlog item (e.g., search UI, sortable list), discuss complexity, uncertainty, and scope; select cards and reveal simultaneously; converge on SP; cap size and split if over the threshold; track velocity and recalibrate in retrospectives [ref: 4-4].
- Pitfalls to avoid: Equating SP to hours, over-precision, estimating deep backlog likely to change, excluding roles from estimation, ignoring confidence/uncertainty in prioritization [ref: 2-1].

DoR/DoD/AC checklists (ready to adapt)
- DoD (example categories): Code peer reviewed; code checked-in; unit/functional/acceptance tests passed; PO reviewed and accepted; shippable increment [ref: 4-0].
- AC (examples): Form cannot submit without mandatory fields; data stored in registrations database; payment via credit card; acknowledgment email sent; each AC is testable and specific to the story [ref: 4-0].
- DoR (example items): Goals clear; requirements/AC defined; resources available; timeline realistic; ready to start without major unknowns [ref: 4-2].
- Standardization: Keep DoD as a common checklist; tailor AC per story; visualize and apply consistently to reduce rework and ensure traceability [ref: 4-1].

Framework comparison summary (quick reference)
- RICE: Objective scoring; pros—quantifies impact per time worked; cons—predefined factors may limit customization [ref: 1-1].
- MoSCoW: Clear inclusion/exclusion for releases; pros—establishes strict launch criteria; cons—no prioritization within categories [ref: 1-1].
- Kano: Customer perception of value; pros—identifies delight vs. basics; cons—doesn’t account for effort; surveys/time cost [ref: 1-1].

Key references (titles and URLs)
- Intercom Blog: “RICE: Simple prioritization for product managers” — https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/ [ref: 1-0].
- Productboard: “Product Prioritization Frameworks” — https://www.productboard.com/blog/product-prioritization-frameworks/ [ref: 1-1].
- Product Talk (Teresa Torres): “Opportunity Solution Trees: Visualize Your Discovery to Stay Aligned and Drive Outcomes” — https://www.producttalk.org/2024/06/opportunity-solution-tree/ [ref: 3-3].
- Product Talk (Teresa Torres): OST prerequisites and steps — https://www.producttalk.org/2024/06/opportunity-solution-tree/ [ref: 3-4].
- Atlassian Agile Coach: “Story points and estimation” — https://www.atlassian.com/agile/project-management/estimation [ref: 4-4].
- Easy Agile: “How to Play Planning Poker and Involve the Whole Team in Estimates” — https://easyagile.com/blog/how-to-play-planning-poker/ [ref: 4-3].
- Visual Paradigm: “Definition of Done vs Acceptance Criteria” — https://www.visual-paradigm.com/scrum/definition-of-done-vs-acceptance-criteria/ [ref: 4-0].
- Nulab: “Definition of Done vs. Acceptance Criteria: A complete guide” — https://nulab.com/learn/software-development/definition-of-done-vs-acceptance-criteria/ [ref: 4-2].
- Mike Cohn (Mountain Goat): “Don’t Equate Story Points to Hours” — https://www.mountaingoatsoftware.com/blog/dont-equate-story-points-to-hours [ref: 2-1].
- Scrum.org Forum: “The age old question - Story Points vs Hours” — https://www.scrum.org/forum/scrum-forum/36777/age-old-question-story-points-vs-hours [ref: 2-2].

Implementation notes for MVP and Sprint 2 planning
- Use OST to trace stakeholder asks (Emma, Bob, Alex, David, Iris) to opportunities, then derive UI features prioritized via RICE; maintain links from backlog items to OST nodes to preserve traceability and rationale [ref: 3-3].
- Run Planning Poker with Fibonacci SP for UI tasks; split items exceeding the size cap; calibrate with reference stories and use velocity for sprint scoping; avoid SP→hours conversion [ref: 4-4].
- Formalize AC per UI story (testable conditions) and apply common DoD; enforce DoR before sprint inclusion; visualize these standards on the board to reduce rework and ensure quality [ref: 4-0].