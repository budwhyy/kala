# Decision log

Architectural decisions, newest last. Each entry: timestamp (UTC), decision, why, alternatives considered.

## 2026-10-14 — Monorepo with pnpm workspaces, no Turborepo

- **Decision:** `apps/web`, `packages/schema`, `packages/db` as pnpm workspaces; root scripts fan out with `pnpm -r`.
- **Why:** Three packages don't need a task-graph cache. Fewer moving parts while the data model settles.
- **Revisit:** if CI time exceeds ~5 minutes or more apps are added.

## 2026-10-14 — Node 22 LTS instead of Node 20

- **Decision:** `.nvmrc`, CI and Netlify pin Node 22; `engines.node` is `>=22`.
- **Why:** The brief (§0) asks for "Node 20 LTS", but Node 20 reached end-of-life in April 2026 and current Vitest requires Node ≥22. Node 22 is the oldest still-supported LTS, which keeps the brief's intent (a stable LTS).

## 2026-10-14 — Toolchain pinned to the Next 15–compatible line

- **Decision:** Next 15.5, React 19, TypeScript 5.9, ESLint 9 (flat config via `FlatCompat` for `eslint-config-next`), Tailwind 4.
- **Why:** The brief fixes Next 15. TypeScript 7 and ESLint 10 are out but not supported by Next 15 / `eslint-config-next@15` / `typescript-eslint`.

## 2026-10-14 — Workspace packages ship TypeScript source

- **Decision:** `@kala/schema` and `@kala/db` export `src/index.ts` directly; the web app compiles them via `transpilePackages`.
- **Why:** No separate build step for internal packages; types flow without a `dist` to keep in sync.

## 2026-10-14 — Fonts: EB Garamond + Noto Serif Devanagari

- **Decision:** Self-hosted via `next/font/google`, EB Garamond with `latin-ext` for IAST diacritics (ā ī ū ṛ ṝ ḷ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ), Noto Serif Devanagari for Devanagari.
- **Why:** §7 asks for a Devanagari-capable pair with IAST diacritics tested. Diacritic rendering will get a visual test when names are rendered (step 5).

## 2026-10-14 — CI on GitHub Actions; deploys on Netlify

- **Decision:** GitHub Actions runs lint → typecheck → Vitest, then build + Playwright (desktop + Pixel 7 profiles). Netlify builds from `netlify.toml` and handles deploy previews on PRs.
- **Why:** Keeps quality gates independent of the hosting provider.

## 2026-10-14 — Drizzle (not Prisma) for the database layer

- **Decision:** Drizzle ORM + drizzle-kit migrations (plain SQL files in `packages/db/drizzle/`).
- **Why:** PostGIS geometry columns, GiST/trigram indexes and CHECK constraints are first-class and
  visible as SQL in review. Prisma treats PostGIS types as `Unsupported`. Owner approved defaults.

## 2026-10-14 — YAML is the source of truth; Postgres is a derived copy

- **Decision:** Content is authored in `content/**/*.yaml`, validated by Zod + `validateDataset`,
  then seeded into Postgres by wiping and reloading in one transaction.
- **Why:** Scholarship is reviewed in pull requests (brief §3.2). Rebuilding is simpler and safer than
  incremental sync at this scale.

## 2026-10-14 — Tables store the full record as jsonb plus lifted columns

- **Decision:** Each table has `data jsonb` with the validated record, plus typed columns for keys,
  joins, filters, geometry and CHECK constraints. Names and navigation links get their own tables.
- **Why:** The Zod schema will grow during Phase 1; adding an optional field should not need a
  migration. Rules that matter (§4.4) are still enforced in SQL.

## 2026-10-14 — Text (work) vs Source (edition)

- **Decision:** `Text` = a work with structure and composition date; `Source` = a specific edition,
  translation or piece of scholarship. References point at Sources, with a required locator.
- **Why:** The brief lists both. Citing editions, not works, makes every claim checkable and lets the
  licence live on the edition actually used.

## 2026-10-14 — Links stored once, reversed on read

- **Decision:** `parent` (not child), `teacher` (not disciple); place→kingdom, event→place, etc.
  Reverse directions are derived.
- **Why:** Storing both directions guarantees they eventually disagree.

## 2026-10-14 — Database tests run on PGlite with PostGIS

- **Decision:** `packages/db` tests apply the real migrations to `@electric-sql/pglite` with the
  PostGIS and pg_trgm extensions, in-process.
- **Why:** No Docker or Postgres on the dev machine, and CI stays simple. The same SQL runs on
  Supabase/Neon.

## 2026-10-14 — Phase 1 site is generated from the YAML at build time (resolves OQ-004)

- **Decision:** Every page is static HTML built from `content/` via `@kala/schema/load`. The build
  fails if content is invalid. Search runs in the browser over a small name index made at build time.
  Postgres stays the scalable store (schema, migrations, seed) and is wired in when content outgrows
  static generation or search needs it.
- **Why:** Static-first (brief §3.1), no database account needed to deploy, nothing to keep in sync.

## 2026-10-14 — URL is the selection; Zustand remembers it

- **Decision:** `?entity=`, `?place=`, `?kingdom=` … carry the selection across modes. Detail pages pass
  their record as context to the mode switcher; a Zustand store keeps the last selection for pages
  without one (e.g. search).

## 2026-10-14 — Link extraction shared by site and database

- **Decision:** `extractLinks` moved from `packages/db` to `@kala/schema` so the site's navigation and
  the database's `links` table derive the graph the same way.

## 2026-10-14 — `member_of` relationship type added (owner approved)

- **Decision:** New directed type `member_of` (member → group), so the Vasus, Rudras and differing
  seven-rishi lists can be linked, each list under its own variant. Not in brief §4.1; added at the
  owner's request (OQ-011).

## 2026-10-14 — Hindi interface strings deferred to Phase 2

- **Decision:** Names already show in Devanagari and search accepts Hindi. Translating the interface
  itself (next-intl, en/hi) is Phase 2 ("Hindi UI complete", brief §9).

## 2026-10-14 — Relationship trace written in-house, not with graphology

- **Decision:** `lib/graph/trace.ts` enumerates all shortest paths with a breadth-first search over
  relationships in both directions, keeping parallel edges so that routes which differ by account
  appear separately. Hidden accounts are excluded before the search.
- **Why:** graphology's shortest-path helpers return a single path; the brief needs every shortest
  route and per-variant filtering. ~60 lines, fully tested.

## 2026-10-14 — Constellation layout in a Web Worker, scaled to a fixed radius

- **Decision:** d3-force-3d runs in `workers/layout.worker.ts` (main-thread fallback). Output is
  centred and scaled so 85% of figures fall within a fixed radius; the camera frames the selected
  figure with drei CameraControls (instant under reduced motion).

## 2026-10-14 — Globe and local map are one MapLibre view

- **Decision:** The 3D Earth is MapLibre's globe projection, which zooms continuously into the local
  map, instead of a separate React Three Fiber globe handing off to MapLibre. Basemap: OpenFreeMap
  "dark" style (no API key). Relief: hillshade from the public AWS Terrarium elevation tiles.
- **Why:** The brief (§6.4) asks for a smooth globe → local-map zoom; one engine does it without a
  hand-off seam, ships far less JavaScript, and keeps the brief's MapLibre choice. Both tile services
  are free and keyless; if either becomes unavailable, the list view still works.
- **Note:** Places with a geometry are drawn as markers at their first vertex in Phase 1; kingdom
  extents are not drawn because no extent has a citable source yet (brief §10: no crisp borders).
