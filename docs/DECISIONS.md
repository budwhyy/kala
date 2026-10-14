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
