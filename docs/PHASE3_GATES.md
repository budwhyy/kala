# Phase 3 quality gates

Run on 2026-10-16 at the end of Phase 3 (the Ramayana and Mahabharata universes). All automated checks
also run in CI on every push.

| #   | Gate                                                                                         | Result                                                                                                           | How it is checked                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Schema tests; every seed file validates                                                      | **Pass** — 90 schema tests                                                                                       | incl. new battlefield and route rules; loader over all of `content/` (294 figures, 684 relationships, 101 events, 86 places, 27 kingdoms, 6 routes, 1 battlefield, 34 sources)                             |
| 2   | Graph: sourced path for ≥10 known pairs                                                      | **Pass** — 19 pairs                                                                                              | `apps/web/lib/graph/trace.test.ts`, now including the brief's Krishna ↔ Arjuna and Shakuni ↔ Duryodhana, plus Bhishma ↔ Arjuna, Karna ↔ Arjuna, Rama ↔ Hanuman, Ravana ↔ Vibhishana, Dasharatha ↔ Ikshvaku |
| 3   | Geo: no cosmological coordinates; terrestrial places have confidence, modern admin, evidence | **Pass**                                                                                                         | Zod, Postgres CHECKs, map-layer test. New epic places are mostly `traditional` or `debated`; debated places without a citable location carry no map point                                                  |
| 4   | Navigation round trip; mode switch keeps entity                                              | **Pass**                                                                                                         | all earlier specs plus `e2e/phase3.spec.ts` (epic pages, route steps, battlefield days, Krishna ↔ Arjuna trace, journeys and battle role on character pages)                                               |
| 5   | Accessibility: 2D alternative for every 3D view; reduced motion; keyboard                    | **Pass** — 0 serious/critical axe violations on 36 page types (English and Hindi); Lighthouse accessibility 100  | `e2e/a11y.spec.ts`. The route map's stop list and the battlefield's day buttons/table are the accessible equivalents                                                                                       |
| 6   | Performance: Lighthouse mobile ≥ 70 on entity pages; cosmic interactive < 4 s                | **Pass** — entity 79–85; cosmic interactive 3.8 s; Mahabharata page 75; battlefield 84; genealogy 65 (not gated) | Lighthouse 12, default mobile throttling, production build                                                                                                                                                 |
| 7   | Scholarship log                                                                              | **Pass**                                                                                                         | `scholarship.test.ts` (34 sources, all in SOURCES.md); OQ-035…043                                                                                                                                          |
| 8   | Decision log                                                                                 | **Pass**                                                                                                         | `docs/DECISIONS.md`                                                                                                                                                                                        |

Phase 3 additional check: **no sideways scrolling at phone width** on the epic, battlefield, route and
character pages (`e2e/phase3.spec.ts`), English and Hindi.

## Fixed while running the gates

- **Family trees overflowed phones** (the Ikshvaku line is ~40 generations): single lines of descent are
  now listed straight down; indentation only where families branch.
- **Links inside the tree's disclosure control** (axe `nested-interactive`): names moved outside; each
  branch has its own "Descendants (n)" toggle with a large enough touch target.
- **Sticky header covered content on phones** once there were seven modes: it now scrolls away on small
  screens.

## Literary and historical framing (brief §2, §10)

- Every route says it is a literary reconstruction, not a verified itinerary.
- The battlefield says formations, encounters and deaths are the epic's narrative, not a historical or
  archaeological record; no dates are attached.
- Divine fathers are stored as `divine`, alongside legal or biological fathers, never replacing them.
- The Ramayana's Book VII claims carry a "later layer" variant citing Macdonell (1900).
