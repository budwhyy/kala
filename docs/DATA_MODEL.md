# KĀLA data model

The data model is the heart of KĀLA (brief §4). This document explains how it is shaped and why.
The code is the authority: Zod schemas in [`packages/schema/src`](../packages/schema/src) and
Postgres tables in [`packages/db/src/schema.ts`](../packages/db/src/schema.ts). If this document
and the code disagree, the code wins and this document is out of date.

## 1. How data flows

```
content/**/*.yaml ──► Zod (per record) ──► validateDataset (cross-record) ──► seed ──► Postgres + PostGIS
   (source of truth,       packages/schema           packages/schema            packages/db     (derived copy)
    reviewed in PRs)
```

- **YAML in `content/` is the source of truth.** Scholarship is reviewed as pull requests.
- **Zod** checks each record on its own (required fields, enums, per-record rules).
- **`validateDataset`** checks rules that need the whole dataset: unique keys, every link and
  citation resolves, every entity is connected, conflicting claims only across variants.
- **Postgres** is a derived, rebuildable copy for search, spatial queries and graph traversal.
  The seed runner wipes and reloads it in one transaction. The most important rules are repeated as
  `CHECK` constraints so the database refuses bad rows even if the Zod layer is bypassed.

Commands:

| Command                                       | What it does                                             |
| --------------------------------------------- | -------------------------------------------------------- |
| `pnpm --filter @kala/schema validate:content` | Load and validate everything in `content/`               |
| `pnpm --filter @kala/db db:generate`          | Generate a SQL migration after editing the table schema  |
| `pnpm --filter @kala/db db:seed`              | Validate, migrate and reload a database (`DATABASE_URL`) |

## 2. Conventions

- **Field names** are `snake_case`, matching the brief.
- **Slugs** identify every record: lowercase kebab-case, stable forever (they are URLs).
  Relationships use an `id` instead of a slug.
- **Links name the target collection by field**, not by suffix: `traditions: [vaishnava]`,
  `variant: valmiki-ramayana`. (The brief's `tradition_ids[]` etc. are written without `_ids`.)
- **Unknown fields are errors.** Every object is strict, so a typo like `fatehr:` fails loudly.
- **Each link is stored once**, in the direction listed in §4. Reverse links (child, disciple,
  "events at this place") are derived, never stored, so they cannot drift out of sync.
- **Names** carry `lang` (ISO 639: `en`, `hi`, `sa`, `pi`…) and `script` (ISO 15924: `Latn`,
  `Deva`…). Every record has an English display name. Sanskrit, Pali and Prakrit names must also
  carry `iast`.

## 3. Provenance: Text, Source, Reference

| Record        | Is                                                                        | Example                                            |
| ------------- | ------------------------------------------------------------------------- | -------------------------------------------------- |
| **Text**      | A work, with its structure (kandas, parvas) and academic composition date | the Mahabharata                                    |
| **Source**    | A specific edition, translation or piece of scholarship                   | K. M. Ganguli's translation, 1883–1896             |
| **Reference** | `{ source, locator, note? }` — a pointer into a Source                    | `{ source: ganguli-mahabharata, locator: "1.66" }` |

The brief lists `Source` and `Text` separately; KĀLA uses Text for the work and Source for the
edition, so every citation names the exact edition relied on. A Reference's `locator` is required:
there are no vague "see the Mahabharata" citations.

**Licences** (principle 12): `public_domain` and `open_licence` sources may be quoted;
`cited_only` sources (modern scholarship, copyrighted critical editions) are cited by locator and
never reproduced. A `translation` may not be `cited_only` — content relies only on open translations.

References are required on every claim-bearing record: entities, relationships, events, dynasties,
places, kingdoms, traditions, variants, evidence items, associations and both kinds of time.

## 4. Records

### Traditions and variants

- **Tradition** — `family` is one of `vedic`, `hindu`, `buddhist`, `jain`, `indigenous`,
  `cross_cultural`. A sub-tradition's `parent` must be in the same family, so Hindu, Buddhist, Jain
  and Indigenous traditions can never be nested under each other (principle 11). Indigenous
  traditions must carry a `sourcing_note`.
- **Variant** — a named account: one text's or tradition's version of a story, genealogy, list,
  creation pathway (§6.1) or cosmic model. `kind` says which. Variants are how disagreement is stored.

### Entity (character, deity, sage, being)

`kinds[]` (one or more of deity, deva, asura, daitya, danava, naga, suparna, rishi, prajapati, manu,
human, king, gandharva, apsara, yaksha, rakshasa, vanara, principle, other), `names`, `epithets`,
`traditions` (≥1), `dynasties` (sourced associations), `summary_beginner`, optional
`summary_scholar`, `cosmic_time[]`, `historical_time[]` (historically attested people only),
`references` (≥1).

"Avatar" is deliberately not a kind: being an avatar is a relationship (`avatar_of`).

### Relationship

`{ id, from, to, type, role?, mode?, generations?, variant?, explanation, references }`

| Type                                                     | Reads as                                                       | Direction |
| -------------------------------------------------------- | -------------------------------------------------------------- | --------- |
| `parent`                                                 | from is a parent of to                                         | directed  |
| `teacher`                                                | from taught to                                                 | directed  |
| `curse`, `blessing`                                      | from cursed / blessed to                                       | directed  |
| `avatar_of`, `manifestation_of`, `aspect_of`             | from is an avatar/… of to                                      | directed  |
| `vahana_of`                                              | from is the mount of to                                        | directed  |
| `descendant_of`                                          | from descends from to (`generations` if stated)                | directed  |
| `member_of`                                              | from is one of the group to (lists that differ go in variants) | directed  |
| `partner`, `sibling`, `ally`, `enemy`, `identified_with` | symmetric                                                      | either    |

`child` and `disciple` are not stored; they are the reverse of `parent` and `teacher`.

**Parents** need a `role` (`father`, `mother`) and a `mode` (`biological`, `mind_born`, `divine`,
`legal`, `adoptive`, `foster`, `other`). Modes let one account give, say, a legal and a divine
father without a conflict.

**Conflicting genealogies** (§4.4): if two records name different parents for the same child in the
same role and mode, every one of them must carry a `variant`, and no two may share one. A
variant-less claim means "undisputed in the sources we hold", so it cannot coexist with a rival.

### Event

Narrative events: `participants[]` (entity + role), `places[]`, `cosmic_time?`,
`narrative_order? { text, position, section? }`, `variant?`, `references`.
Events have **no historical-time field at all** — the schema cannot express a date for a myth.

### Dynasty

`kind: legendary | historical`, `lineage_type` (suryavansha, chandravansha, yadava, kuru, other),
`founders[]`, `kingdoms[]` (associations), `variant?`. Legendary dynasties cannot carry historical
time.

### Concept

A concept (dharma, karma, moksha…) with one `interpretation` per school, each sourced.

## 5. Time: two systems, never one axis

| Field            | For                                  | Shape                                                                                  |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `CosmicTime`     | mythic position inside a cycle model | `{ variant, phase, kalpa?, manvantara?, mahayuga?, yuga?, sub_position?, references }` |
| `HistoricalTime` | historically attested things only    | `{ start, end, precision, confidence, references }`                                    |

- Cosmic positions are **ordinals within a tradition's model**, never years. Every cosmic time
  names the `variant` (account) that places it there. `phase` covers `before_creation`,
  `creation`, `within_cycle` and `pralaya`.
- Historical years are signed integers: `-500` is 500 BCE, `1200` is 1200 CE. Year 0 does not exist
  and is rejected.
- A record may carry both (Kashi has cosmic associations and an archaeological record); the UI shows
  them in separate rails.
- **CosmicCycleModel** holds one account's yuga lengths (in divine years), mahayugas per manvantara,
  manvantaras per kalpa, named manvantaras and forms of pralaya — with references. `lib/time`
  computes from these numbers; no cycle figures are hardcoded (principle 10). Multiple models can
  coexist as variants.

## 6. Geography

### Place

- `realm`: `terrestrial` or `cosmological`.
- `confidence` — the four classes (principle 9):

| Class         | Meaning                                                            | Geometry      |
| ------------- | ------------------------------------------------------------------ | ------------- |
| `verified`    | Identification backed by archaeological or historical evidence     | required      |
| `traditional` | Held by living tradition, not independently verified               | required      |
| `debated`     | Competing identifications, listed in `alternative_identifications` | optional      |
| `mythical`    | Cosmological realm; not on Earth                                   | **forbidden** |

- **Cosmological places** (Meru, Vaikuntha, Patala, divine Kailasa…) must be `mythical`, with no
  geometry, no modern location, no historical dates, and no coordinates hidden inside alternative
  identifications.
- **Terrestrial places** must have a `modern_admin` (country etc., for orientation only), at least
  one `evidence` item, and cannot be `mythical`.
- `verified` requires at least one `archaeological` or `historical` evidence item. Tradition alone
  never verifies a site, and a verified site never verifies the epic events set there.
- `related_places` links, for example, terrestrial Mount Kailash to cosmological Kailasa
  (`cosmological_counterpart`, which must cross realms).
- `geometry` is GeoJSON in WGS 84 (`[longitude, latitude]`), validated for range and closed rings.

### Kingdom

- `kind`: `epic_legendary`, `historical_mahajanapada`, `historical_empire`, `historical_regional`.
- **A legendary kingdom and a historical polity of the same name are two records**, linked by
  `same_name_as`, which must join a legendary record to a historical one.
- `epic_legendary`: no historical time, no attested rulers.
- historical kinds: historical time required, no cosmic time.
- `extent` is an approximate area with a `confidence`, a note and references. It is rendered as a
  soft shaded region, never as a crisp border.
- `rulers[]` flag `attested` (true only with historical evidence); `relations[]` (war, alliance,
  marriage, trade, succession, vassalage) are each sourced and may carry a variant.

### Route and Battlefield (schema now, content in Phase 3)

- **Route**: ordered stops (place, optional event), tied to a text and variant, with
  `literary_reconstruction: true` as a required literal — a route cannot be stored as verified.
- **Battlefield**: days with formations and encounters, `literary: true` required.

## 7. Database

Each table keeps the full validated record in `data` (jsonb) plus the columns needed for joins,
filters and indexes. This keeps the database in step with the Zod schema without a migration for
every new optional field.

| Table           | Notable columns and constraints                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `entities`      | `display_name`, `kinds[]`; CHECK has references                                                     |
| `relationships` | FKs to entities and variants; indexes on from/to; CHECK has references, not self                    |
| `places`        | `geom geometry(Geometry, 4326)` with GiST index; CHECK no geometry if cosmological or mythical      |
| `kingdoms`      | `extent` geometry with GiST index; CHECK legendary kingdoms undated                                 |
| `dynasties`     | CHECK legendary dynasties undated                                                                   |
| `sources`       | CHECK translations are public-domain or open                                                        |
| `names`         | every name of every record (en, hi, Devanagari, IAST) with trigram indexes for fuzzy search         |
| `links`         | the navigation graph flattened: `(from_type, from_slug, to_type, to_slug, role)`, indexed both ways |
| others          | `texts`, `traditions`, `variants`, `events`, `concepts`, `routes`, `battlefields`, `cosmic_models`  |

Migrations live in `packages/db/drizzle/`. `0000_extensions.sql` enables `postgis` and `pg_trgm`.
Tests apply the real migrations to an in-process Postgres (PGlite) with PostGIS, so no database
server is needed to run them.

## 8. Where each §4.4 rule is enforced

| Rule (§4.4)                                            | Zod (per record)     | `validateDataset`             | Postgres CHECK                       | Tests                               |
| ------------------------------------------------------ | -------------------- | ----------------------------- | ------------------------------------ | ----------------------------------- |
| Relationship without a Reference fails                 | `References.min(1)`  | citation must resolve         | `relationship_has_references`        | `rules.test.ts`, `db.test.ts`       |
| Cosmological Place with geometry fails                 | `Place` refinement   | —                             | `cosmological_place_has_no_geometry` | both                                |
| `epic_legendary` Kingdom with HistoricalTime fails     | `Kingdom` refinement | —                             | `legendary_kingdom_undated`          | both                                |
| Every Entity has ≥1 relationship and ≥1 source         | `references.min(1)`  | "entity has no relationships" | `entity_has_references`              | `rules.test.ts`                     |
| Conflicting relationships only with different variants | —                    | `relationshipConflicts`       | —                                    | `rules.test.ts`                     |
| Every seed file validates (§8 gate 1)                  | —                    | `loadContent`                 | —                                    | `load.test.ts` (runs on `content/`) |
