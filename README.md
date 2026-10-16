# KĀLA

**An interactive atlas of Indian mythology, cosmology, genealogy and sacred geography.**

Live: **https://kala-rosy-one.vercel.app** (Vercel). The earlier Netlify site, kalacircle.netlify.app, stopped building at Phase 3.

KĀLA lets someone with no background explore the cycles of cosmic time, the families of gods,
sages and kings, and the places of the epics and Puranas — always showing _which text says this_,
_where texts disagree_, and _how confident an identification is_. The full product brief is
[KALA_BUILD_BRIEF.md](KALA_BUILD_BRIEF.md); Phases 1–3 are complete.

## What is in the site (Phases 1–3)

| Mode                           | What it does                                                                                                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Opening** (`/`)              | The opening question, then nine creation accounts offered side by side as starting paths                                                                                                                                                                                     |
| **Cosmic time** (`/cosmic`)    | A wheel of yugas → mahayuga → manvantara → kalpa for each text's figures (Vishnu Purana, Manusmriti), never placed on a calendar; a **guided Yuga journey** (`/journey/yugas`)                                                                                               |
| **Genealogy** (`/genealogy`)   | A 3D constellation of 294 figures; trace any two and see every step with its source; hide claims from one account                                                                                                                                                            |
| **Geography** (`/geography`)   | A globe that zooms into a map of 86 places, coloured by confidence class; filter by pilgrimage network; cosmological realms listed but never mapped                                                                                                                          |
| **Avatars** (`/avatar`)        | Avatar lists from four texts compared side by side (where they differ is highlighted), plus manifestations, aspects and identifications, each kind explained and kept separate                                                                                               |
| **Philosophy** (`/philosophy`) | 16 concepts (dharma, karma, moksha, atman, Brahman…) with each school's own explanation and sources, side by side                                                                                                                                                            |
| **Pilgrimage** (`/pilgrimage`) | Hindu, Buddhist and Jain sacred sites and circuits in their own right; lists that differ between texts are shown as separate lists                                                                                                                                           |
| **Epics** (`/epic`)            | The Ramayana (Valmiki, with the Ramcharitmanas as another telling) and the Mahabharata: the story book by book, family trees, journeys drawn stage by stage on a map (literary reconstructions), the eighteen days of Kurukshetra day by day, and the kingdoms and alliances |
| **Record pages**               | Every figure, place, kingdom, dynasty, event, concept, pilgrimage network, text, source edition, account and tradition, all cross-linked                                                                                                                                     |
| **Search**                     | English, Devanagari or IAST, diacritics optional                                                                                                                                                                                                                             |

**Languages.** The interface is available in English and Hindi (`/hi/…`); names show in Devanagari on the
Hindi site. Descriptions and source passages stay in English for now.

Every 3D view has a **List view** (also used automatically without WebGL, and by default on narrow
screens for the heavier scenes), and the site honours `prefers-reduced-motion`. The current selection
travels in the URL (`?entity=kashyapa`), so switching modes keeps it.

## How it is built

```
apps/web/            Next.js 15 site (static pages built from content/)
packages/schema/     Zod schemas, cross-record validation, YAML loader  — the data model
packages/db/         Postgres + PostGIS tables, migrations, seed runner  — the scalable store
content/             The scholarship: one YAML record per figure, place, kingdom, source…
docs/                Data model, content guide, sources, decisions, open questions
```

Content is the source of truth. It is validated on every build; **the build fails if any claim
lacks a citation, a cosmological realm has coordinates, a legendary kingdom has historical dates,
or two texts' conflicting claims are not kept as separate accounts.** See
[docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## Run it locally

Requires Node 22+ and pnpm 11.

```bash
pnpm install
```

```bash
pnpm dev
```

Then open http://localhost:3000.

## Check it

```bash
pnpm --filter @kala/schema validate:content
```

```bash
pnpm lint && pnpm typecheck && pnpm test
```

```bash
pnpm --filter @kala/web build && pnpm test:e2e
```

The first run of the browser tests needs `pnpm --filter @kala/web exec playwright install chromium`.

## Add or change content

Read [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) first. In short: one YAML file per record in
`content/<collection>/`, every claim cites a specific edition and passage from
[docs/SOURCES.md](docs/SOURCES.md), disagreements become separate variants, and anything unresolved
goes to [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) rather than into the data. Run the
validator before opening a pull request.

## Database (optional in Phase 1)

The site is generated from `content/` at build time and needs no database. To load the same data
into Postgres with PostGIS (Supabase or Neon both work):

```bash
DATABASE_URL=postgres://user:password@host:5432/kala pnpm --filter @kala/db db:seed
```

This validates the content, applies the migrations in `packages/db/drizzle/` and reloads every
table in one transaction. After changing `packages/db/src/schema.ts`, generate a migration with
`pnpm --filter @kala/db db:generate`.

## Deploy

The site is hosted on Vercel (project `kala`, root directory `apps/web`, Node 22). The project is
connected to the GitHub repository, so every push to `main` deploys to production and pull requests
get preview deployments. GitHub Actions runs formatting, lint, types, unit tests, the production build
and the browser tests on every push and pull request. (`netlify.toml` is kept for the earlier Netlify
site, which skipped its Phase 3 builds.)

## Documentation

| Document                                         | For                                          |
| ------------------------------------------------ | -------------------------------------------- |
| [KALA_BUILD_BRIEF.md](KALA_BUILD_BRIEF.md)       | The product brief and its binding principles |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md)         | Every record type, rule and table            |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)   | How to write content                         |
| [docs/SOURCES.md](docs/SOURCES.md)               | The editions cited, with licence checks      |
| [docs/DECISIONS.md](docs/DECISIONS.md)           | Architectural decisions, dated               |
| [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md) | Unresolved scholarly and product questions   |
| [docs/PHASE1_GATES.md](docs/PHASE1_GATES.md)     | Results of the Phase 1 quality gates         |

## Sources and copyright

KĀLA quotes only public-domain or openly licensed translations, and cites modern scholarship by
page without reproducing it. Map data © OpenStreetMap contributors via OpenFreeMap; elevation from
the public Terrarium tiles.
