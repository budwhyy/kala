# Phase 1 quality gates (brief §8)

Run on 2026-10-14 at the end of Phase 1, step 8. All automated checks also run in CI on every push.

| #   | Gate                                                                                                          | Result                                                                                      | How it is checked                                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Schema tests: all §4.4 rules; every seed file validates                                                       | **Pass** — 60 tests                                                                         | `packages/schema/test/*` (rules, loader on `content/`, guide examples, scholarship log); the web build also fails on invalid content                               |
| 2   | Graph: sourced path for ≥10 known pairs                                                                       | **Pass** — 12 pairs                                                                         | `apps/web/lib/graph/trace.test.ts`. Brief examples Krishna ↔ Arjuna and Shakuni ↔ Duryodhana need Phase 3 content (OQ-019)                                         |
| 3   | Geo: no cosmological place has coordinates; every terrestrial place has confidence, modern admin, ≥1 evidence | **Pass**                                                                                    | Zod `Place` rules, Postgres CHECK constraints (`packages/db/test`), map layer test (`apps/web/lib/geo/features.test.ts`)                                           |
| 4   | Navigation: Place → Kingdom → Dynasty → Character → Text round trip; mode switch keeps entity                 | **Pass**                                                                                    | `e2e/navigation.spec.ts`, plus the brief's full "Phase 1 is done when" journey in `e2e/phase1-journey.spec.ts` (desktop and mobile)                                |
| 5   | Accessibility: 2D alternative for every 3D view; reduced motion; keyboard path                                | **Pass** — 0 serious/critical axe violations on 14 page types; Lighthouse accessibility 100 | `e2e/a11y.spec.ts` (axe WCAG 2.1 A/AA + keyboard test). List view on every mode, automatic without WebGL                                                           |
| 6   | Performance: Lighthouse mobile ≥ 70 on entity pages; cosmic scene interactive < 4 s                           | **Pass** — entity 82–89; cosmic 85, interactive 3.8 s                                       | Lighthouse 12, default mobile throttling (slow 4G, 4× CPU) on the production build. Genealogy's 3D page scores ~58 (not gated; its list view is fast) — see OQ-020 |
| 7   | Scholarship log: every cited source in SOURCES.md; disagreements in OPEN_QUESTIONS.md                         | **Pass**                                                                                    | `packages/schema/test/scholarship.test.ts`; OQ-001…020                                                                                                             |
| 8   | Decision log with timestamps                                                                                  | **Pass**                                                                                    | `docs/DECISIONS.md`                                                                                                                                                |

## Fixed while running the gates

- **Links relied on colour alone** inside text (axe `link-in-text-block`, 55 instances). All
  in-text links are now underlined.
- **Cosmic page was too slow** (Lighthouse 56, interactive 7.7 s) because it loaded WebGL to draw
  flat rings. The wheel is now SVG tilted in 3D with CSS; same interaction, no 3D engine.

## Not automated

- Testing on a physical mid-range Android phone. The Lighthouse mobile profile is used as a
  stand-in; a real-device check is recommended before a public launch.
- A human visual review of IAST diacritics in every font size.
