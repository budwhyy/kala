# Phase 2 quality gates

Run on 2026-10-14 at the end of Phase 2. The brief's §8 gates apply to every phase. All automated
checks also run in CI on every push.

| #   | Gate                                                                                                      | Result                                                                                                            | How it is checked                                                                                                                                                                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Schema tests; every seed file validates                                                                   | **Pass** — 83 schema tests                                                                                        | `packages/schema/test/*` incl. new rules (positions, networks, journeys, retellings) and a loader test over all of `content/` (122 figures, 284 relationships, 69 places, 10 networks, 16 concepts, 10 events). The site build also fails on invalid content |
| 2   | Graph: sourced path for ≥10 known pairs                                                                   | **Pass**                                                                                                          | `apps/web/lib/graph/trace.test.ts` (Phase 1 pairs still pass with 122 figures). Epic pairs wait for Phase 3 (OQ-019)                                                                                                                                         |
| 3   | Geo: no cosmological place has coordinates; terrestrial places have confidence, modern admin and evidence | **Pass**                                                                                                          | Zod, Postgres CHECKs, map-layer test. New cosmological places (Mandara, Ocean of Milk) carry no coordinates                                                                                                                                                  |
| 4   | Navigation: place → … round trip; mode switch keeps entity                                                | **Pass**                                                                                                          | `e2e/navigation.spec.ts`, `e2e/phase1-journey.spec.ts` (still passes), `e2e/phase2.spec.ts` (avatars, philosophy, pilgrimage, journey, retellings), `e2e/i18n.spec.ts`                                                                                       |
| 5   | Accessibility: 2D alternative for every 3D view; reduced motion; keyboard                                 | **Pass** — 0 serious/critical axe violations on 29 page types, English and Hindi; Lighthouse accessibility 100    | `e2e/a11y.spec.ts`                                                                                                                                                                                                                                           |
| 6   | Performance: Lighthouse mobile ≥ 70 on entity pages; cosmic interactive < 4 s                             | **Pass** — entity 77–91; cosmic interactive 3.8 s (simulated) / 3.3 s (real throttling); avatars 84; geography 80 | Lighthouse 12 on the production build. Genealogy (not gated) scores 56–74 with 4.5–4.7 s to interactive: its list is the default on narrow screens, but it hydrates a large data set (OQ-020/034)                                                            |
| 7   | Scholarship log: every cited source listed; disagreements logged                                          | **Pass**                                                                                                          | `packages/schema/test/scholarship.test.ts` (32 sources, all listed in SOURCES.md); OQ-022…034                                                                                                                                                                |
| 8   | Decision log with timestamps                                                                              | **Pass**                                                                                                          | `docs/DECISIONS.md`                                                                                                                                                                                                                                          |

Phase 2 additional checks: Hindi/English message files have identical keys and placeholders, every
schema enum has a label in both languages (`apps/web/i18n/*.test.ts`); no `next/link` or raw internal
hrefs remain (locale-aware links only).

## Fixed while running the gates

- **Page prefetching:** after load, Next prefetched every mode's data (genealogy ~47 KB) in the
  background; with six modes this pushed cosmic interactive time to 4.7 s. Header, language-switcher and
  opening links no longer prefetch (3.8 s).
- **Mode pages shipped the whole search index** (now ~350 records with their search keys) to label one
  box; they now ship only five record types' labels.
- **Heavy 3D scenes** (constellation, map) start as lists on narrow screens and load 3D code only on
  request, and never before the browser has been inspected.
- **Local build blocker:** the next-intl Next plugin pulls in a native SWC addon that cannot start on
  this Windows machine; the one alias it provides is now set directly in `next.config.mjs`.
- **Middleware matcher** excluded every route (a backslash lost in a string) — English URLs were 404 until fixed.

## Not automated / open

- Hindi wording needs a native reader (OQ-022). Hindi names on the map need a glyph check (OQ-024).
- Real-device testing on a mid-range Android remains recommended (OQ-021).
- Several page numbers read from OCR (OQ-015, OQ-033).
