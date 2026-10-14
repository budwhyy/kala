# KĀLA — Build Brief for Claude Code

**The Living 3D Universe of Indian Mythology, Cosmology, Epics, Genealogy and Geography**

> This brief merges two source documents: the core KĀLA product vision (cosmic time, genealogy, avatars, epics, philosophy, AI guide) and the Geography & Kingdoms extension (3D map, ancient Bharatavarsha, kingdom atlas, epic routes, pilgrimage, cross-civilisational atlas). Geography is treated here as a first-class module of the one application, not an add-on.
>
> It is written for an AI coding agent. Read the whole file before writing code. Sections 1–4 are binding. Section 9 is the execution order. Section 11 is the kick-off prompt.

---

## 0. Run configuration (fill in before starting)

| Setting | Value |
|---|---|
| Repo | `budwhyy/kala` (create new, public or private as owner prefers) |
| Deploy target | Netlify (preferred, matches MYTHOS) — Vercel acceptable |
| Package manager | pnpm |
| Node | 20 LTS |
| Default branch | `main` |
| Languages at launch | English (UI + content), Hindi (UI strings + place/character names), Sanskrit (IAST transliteration + Devanagari for names/terms) |
| Current build scope | **Phase 1 only** (see §9). Do not start Phase 2 without explicit instruction. |

---

## 1. What KĀLA is

An immersive, interactive 3D web application that lets a person with **zero prior knowledge** explore Indian mythology, cosmology, divine and royal genealogies, the epics, philosophical traditions, sacred geography, ancient kingdoms and the historical spread of these traditions across South and Southeast Asia.

It must feel like navigating a living universe, not reading an encyclopedia.

A user should be able to:

- Start from "what was existence?" and move through cosmic cycles → divine lineages → legendary dynasties → the epics → living traditions.
- Pick any two characters and trace their familial, narrative or spiritual relationship.
- Click a place (e.g. **Hastinapura**) and immediately see its kingdom, dynasty, rulers, events, texts, timeline position and modern location.
- Search **Gandhara**, see its approximate ancient region, its modern association (NW Pakistan / E Afghanistan), its epic and historical contexts, then navigate to Gandhari → Shakuni → Kuru dynasty → Mahabharata.
- Switch between exploration modes without losing the entity they are looking at.
- Always see *which text says this*, *which traditions disagree*, and *how confident the identification is*.

**Navigation graph the whole product rests on:**

`Place ↔ Kingdom ↔ Dynasty ↔ Character ↔ Event ↔ Text ↔ Timeline (cosmic + historical) ↔ Tradition`

Every arrow above must be a clickable, searchable, source-backed link.

---

## 2. Non-negotiable product principles (binding on every commit)

1. **Accuracy over spectacle.** No invented relationships, chronology, quotations or coordinates to make a visual work.
2. **Respect living traditions.** These are living religions, not extinct "mythologies". No sacred imagery used as decorative props without context.
3. **No false universal canon.** Texts, sects, regions and periods disagree. Preserve variations; never flatten them into one tree, one creation story, one Dashavatara list, one Shakti Peetha list.
4. **Mythic time is not historical time.** Two separate temporal systems. Never place a Yuga event and a Mauryan date on the same absolute axis. Never fabricate historical dates for mythological events.
5. **Every connection is explainable.** Each edge in the graph carries a *why* and a *source*.
6. **Progressive complexity.** Beginner view by default; intermediate and scholarly depth one click away.
7. **3D must be functional.** Every 3D view answers a question (relationship, sequence, concept, location). If a view only looks good, cut it.
8. **Scalability by design.** Thousands of entities, relationships, events, sources, places and regional variants without rework.
9. **Geography has four confidence classes** (historically verified / traditionally identified / debated / cosmological-mythical) and every place record carries one. A verified town never verifies the epic events set there.
10. **Nothing hardcoded.** No mythological relationships, places or text inside React or Three.js components. Everything comes from the data layer.
11. **Distinct traditions stay distinct.** Hinduism, Buddhism, Jainism and Indigenous traditions are never collapsed into one religion or one cosmology.
12. **Copyright.** Public-domain translations only unless licensed. No pasting modern translations.

If a requirement in this brief conflicts with a principle, the principle wins and the requirement is logged as an open question.

---

## 3. Technical architecture

### 3.1 Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript strict | Server components for data, client components for 3D |
| 3D | Three.js via React Three Fiber + drei | Cosmic wheel, genealogy constellation, globe |
| Graph layout | `d3-force-3d` (genealogy constellation), `graphology` for in-memory graph ops | Layout computed off the main thread (Web Worker) for >500 nodes |
| 2D maps | MapLibre GL JS | Modern basemap, GeoJSON overlays, ancient/modern slider |
| 3D globe | R3F globe + terrain tiles (lazy-loaded) | Indian subcontinent starting view |
| Styling | Tailwind CSS + CSS variables for palette | Gold / indigo / copper / deep red / celestial blue |
| State | Zustand (exploration context), URL as source of truth for selected entity + mode | Mode switching preserves entity via URL |
| Data | PostgreSQL + PostGIS (Supabase or Neon), Prisma or Drizzle | Graph-shaped relational model, spatial columns |
| Search | Postgres full-text + trigram; multilingual columns | Typesense/Meilisearch optional later |
| AI guide | Phase 5 only — RAG over the entity/source store | Not in Phase 1 |
| i18n | `next-intl` | en, hi; IAST + Devanagari fields on all names |
| Testing | Vitest (data integrity), Playwright (navigation flows) | Data tests are mandatory, see §8 |
| Hosting | Netlify (or Vercel) | Static-first; dynamic routes for entities |

### 3.2 Repository layout

```
kala/
  apps/web/                  Next.js app
    app/                     routes: /(modes)/cosmic, /genealogy, /epic, /avatar,
                             /geography, /civilization, /philosophy, /guided,
                             /entity/[slug], /place/[slug], /kingdom/[slug],
                             /text/[slug], /search
    components/3d/           CosmicWheel, GenealogyConstellation, Globe, MandalaNav
    components/2d/           Fallback/accessible views for every 3D scene
    components/cards/        EntityCard, PlaceCard, KingdomCard, SourceCard, VariantPanel
    lib/graph/               relationship tracing, path finding, variant resolution
    lib/time/                cosmic-time model, yuga/manvantara/kalpa maths
    lib/geo/                 confidence helpers, projection, GeoJSON loaders
  packages/schema/           Zod schemas + TS types for all content (single source of truth)
  packages/db/               Prisma/Drizzle schema, migrations, seed runner
  content/                   YAML/JSON seed data, one file per entity, validated against schema
    entities/  relationships/  events/  places/  kingdoms/  texts/  traditions/  variants/
  docs/
    DATA_MODEL.md  CONTENT_GUIDE.md  SOURCES.md  OPEN_QUESTIONS.md  DECISIONS.md
```

Content lives in version-controlled YAML, validated by Zod at build time, then seeded into Postgres. This keeps scholarship reviewable in pull requests.

### 3.3 Performance and accessibility

- Progressive loading: cosmic scene first, genealogy and map chunks on demand.
- Mobile: reduced particle counts, capped node counts, LOD on globe; test on a mid-range Android.
- `prefers-reduced-motion` respected; every 3D scene has a 2D/text equivalent reachable in one click.
- Keyboard navigation for all cards and mode switching.
- Bookmarks, learning progress and saved journeys stored per user (local-first in Phase 1, account-backed later).

---

## 4. Data model (the heart of the product)

Design the schema before any 3D work. Document it in `docs/DATA_MODEL.md`. The schema must natively represent: **narrative variants, cyclical time, incarnation relationships, uncertain dates, source provenance, conflicting genealogies, and geographic uncertainty.**

### 4.1 Core entities

| Entity | Key fields |
|---|---|
| `Entity` (character / deity / sage / being) | `slug`, `names[]` (lang, script, IAST, meaning), `epithets[]`, `kind` (deva, asura, naga, rishi, human king, avatar…), `dynasty_ids[]`, `tradition_ids[]`, `summary_beginner`, `summary_scholar`, `timeline_positions[]` |
| `Relationship` | `from`, `to`, `type` (parent, partner, sibling, teacher, disciple, ally, enemy, curse, blessing, avatar_of, manifestation_of, aspect_of, identified_with), `variant_id`, `source_ids[]`, `explanation` |
| `Variant` | `slug`, `description`, `tradition_id`, `source_ids[]` — a named account (e.g. "Valmiki Ramayana", "Ramcharitmanas", "Bhagavata Purana genealogy of Kashyapa") |
| `Event` | `slug`, `title`, `summary`, `participants[]`, `place_ids[]`, `cosmic_time`, `narrative_order` (within an epic), `variant_id`, `source_ids[]` |
| `Source` | `slug`, `title`, `tradition`, `language`, `approx_date_range` (academic, with confidence), `edition/translation` (public-domain only), `licence` |
| `Reference` | `source_id`, `locator` (book/canto/chapter/verse), `note` — attached to any relationship, event, place, claim |
| `Tradition` | Vedic, Puranic, Vaishnava, Shaiva, Shakta, Smarta, Buddhist, Jain, regional/Indigenous (with sourcing note), plus cross-cultural (Thai, Khmer, Javanese/Balinese, Tibetan, Sri Lankan…) |
| `Dynasty` | `slug`, `name`, `lineage_type` (Suryavansha, Chandravansha, Yadava…), `founder_ids[]`, `kingdom_ids[]`, `variant_id` |
| `Place` | see §4.3 |
| `Kingdom` | see §4.3 |
| `Concept` | dharma, karma, moksha, atman, Brahman, maya, yoga, bhakti… with per-school explanations |
| `Text` | user-facing view of `Source` with structure (kandas, parvas, chapters) for the Epic mode |

### 4.2 Cosmic time

Two independent temporal systems, never joined on one axis:

- **`CosmicTime`**: `{ kalpa?, manvantara?, mahayuga?, yuga: 'satya'|'treta'|'dvapara'|'kali', sub_position?, variant_id }`. Positions are ordinal within tradition, not numeric years.
- **`HistoricalTime`**: `{ start, end, precision: 'year'|'decade'|'century'|'period', confidence, source_ids[] }`. Only for historically attested things (Mahajanapadas, Mauryan, Gupta, temple foundation dates, archaeological layers).

An entity or place may have both (e.g. Kashi: cosmic associations + archaeological record). The UI shows them in separate rails.

Cosmic cycle maths (Yuga lengths, Mahayuga, Manvantara = 71 Mahayugas, Kalpa = 14 Manvantaras = 1000 Mahayugas, day/night of Brahma) is implemented in `lib/time` from the Puranic figures, with the source cited and the note that figures vary between texts.

### 4.3 Geography

**`Place`**

| Field | Notes |
|---|---|
| `slug`, `names[]` | ancient/traditional, modern, Hindi, IAST |
| `realm` | `terrestrial` \| `cosmological` |
| `confidence` | `verified` \| `traditional` \| `debated` \| `mythical` |
| `geometry` | PostGIS point/polygon — **null when `realm = cosmological` or `confidence = mythical`** |
| `modern_admin` | country, state/province, district, nearest city |
| `alternative_identifications[]` | each with `confidence`, `argument`, `source_ids[]` |
| `evidence[]` | archaeological / historical / textual / traditional, each with references |
| `kingdom_ids[]`, `dynasty_ids[]`, `entity_ids[]`, `event_ids[]`, `tradition_ids[]` | |
| `cosmic_time[]`, `historical_time[]` | |
| `pilgrimage_networks[]` | Char Dham, Jyotirlinga, Shakti Peetha (list variant), river tirthas, Buddhist, Jain |

**`Kingdom`**

| Field | Notes |
|---|---|
| `slug`, `names[]` | Kosala, Videha/Mithila, Kashi, Kuru, Panchala, Matsya, Gandhara, Madra, Anga, Magadha, Avanti, Chedi, Vatsa, Surasena, Kamboja, Kalinga, Yadava regions, others |
| `kind` | `epic_legendary` \| `historical_mahajanapada` \| `historical_empire` \| `historical_regional` — **a legendary kingdom and a historical polity of the same name are separate records linked by `same_name_as`** |
| `extent_geometry` | approximate shaded polygon, `extent_confidence`, never crisp national-style borders |
| `capitals[]`, `rulers[]` (legendary vs attested flagged), `neighbours[]`, `dynasty_ids[]` | |
| `relations[]` | war, alliance, marriage, trade, succession — each sourced |
| `historical_time` / `cosmic_time` | |

**`Route`** (epic journeys): ordered `stops[]` each with `place_id`, `event_id`, `variant_id`; flagged `literary_reconstruction: true`. Never presented as a verified itinerary.

**`Battlefield`** (Kurukshetra): `day`, `formations[]` (literary), `encounters[]`, `warriors[]`, sources — flagged literary, not archaeological.

### 4.4 Rules enforced by schema/tests

- A `Relationship` without at least one `Reference` fails validation.
- A `Place` with `realm = cosmological` and non-null geometry fails validation.
- A `Kingdom` of kind `epic_legendary` with a `HistoricalTime` fails validation.
- Every `Entity` in the seed has ≥1 relationship and ≥1 source.
- Conflicting relationships (e.g. two different fathers) are allowed **only** when they carry different `variant_id`s.

---

## 5. Exploration modes (shared shell, one selected entity in URL)

| Mode | Route | What it shows | Phase |
|---|---|---|---|
| Cosmic | `/cosmic` | 3D Cosmic Time Wheel: existence/creation layer → cycles (Yugas, Manvantaras, Kalpas, Pralaya) → mythological eras; zoom from whole cycle to one event | 1 |
| Genealogy | `/genealogy` | 3D constellation of divine, sage and royal lineages; node cards; two-node relationship trace; variant toggle | 1 |
| Geography | `/geography` | 3D globe → MapLibre map; place/kingdom cards; ancient/modern slider; mythological vs historical time selector; confidence legend | 1 |
| Epic | `/epic/ramayana`, `/epic/mahabharata` | Story worlds, narrative order, geography-linked, battlefield | 3 |
| Avatar | `/avatar` | Dashavatara (variant-aware), Shiva manifestations, goddess traditions; avatar vs incarnation vs manifestation vs aspect vs identification clearly typed | 2 |
| Civilization | `/civilization` | Tradition branches; cross-cultural transmission typed as direct / shared ancestry / reinterpretation / independent similarity / uncertain hypothesis | 4 |
| Philosophy | `/philosophy` | Concepts with per-school differences | 2 (light), 4 |
| Guided Discovery | `/guided` | Narrated progressive journey | 5 |

Switching mode keeps `?entity=` / `?place=` / `?time=` in the URL so context persists.

---

## 6. Feature specifications

### 6.1 Opening experience (Phase 1)
Dark infinite cosmic field → subtle soundscape (muted by default, user-enabled) → gradual light → text: **"Before kingdoms. Before heroes. Before the stories of gods and mortals — what was existence?"** → a luminous structure forms → user is offered pathways: *Brahman (Vedanta)*, *Purusha–Prakriti (Samkhya)*, *Nasadiya Sukta (Rigveda)*, *Hiranyagarbha*, *Brahma's creation (Puranic)*, *Vishnu / Shiva / Shakti cosmological roles*. Each pathway is a `Variant`-tagged entry point. Never presented as one origin story.

### 6.2 Cosmic Time Wheel (Phase 1)
- Rotating 3D wheel; rings = Kalpa → Manvantara → Mahayuga → Yuga.
- Mandala-inspired geometric navigation.
- Click a Yuga → events and entities positioned there (ordinal).
- Pralaya forms and reincarnation/karma/moksha explained per tradition.
- Clear banner: *traditional chronology, not historical dating*.

### 6.3 Genealogy constellation (Phase 1 subset, expanded Phase 3)
Node card shows: names (English, Devanagari, IAST), meaning/epithets, parents/partners/siblings/children, associated deities/manifestations, teachers/disciples/allies/enemies, dynasties, major stories/curses/blessings, places, sources + alternative accounts, cosmic position.

Relationship trace: select any two nodes → shortest path(s) across familial, narrative and spiritual edges, listed with each edge's explanation and source; where paths differ by variant, show both.

Phase 1 content: Brahma and attributed genealogies; Prajapatis; Saptarishis; Kashyapa with Aditi, Diti, Danu, Vinata, Kadru lineages; Adityas, Vasus, Rudras, Ashvins; Devas/Asuras; Nagas, Garuda; Shiva–Parvati–Ganesha–Kartikeya; Vishnu–Lakshmi + avatar hooks; Shakti traditions. Suryavansha and Chandravansha top lines (Manu → Ikshvaku; Chandra → Budha → Pururavas → Yayati → Yadu/Puru) as stubs for Phase 3.

### 6.4 Geography explorer (Phase 1 core)
- 3D Earth, Indian subcontinent starting view, Himalayan terrain, smooth zoom to MapLibre local view.
- **≥25 places** at launch, each a full `Place` record with confidence class, modern association, evidence and links. Required set: Ayodhya, Mathura, Vrindavan, Dwarka, Hastinapura, Indraprastha, Kurukshetra, Kashi, Ujjain, Prayagraj, Mithila, Kishkindha, Lanka (Ramayana), Rameswaram, Chitrakoot, Panchavati, Gandhara (region), Magadha (region), Kalinga (region), Avanti (region), Kailash (terrestrial Mount Kailash **and** separate cosmological Kailasa record), Meru (cosmological), Patala (cosmological), Vaikuntha (cosmological), Svarga/Brahmaloka (cosmological), plus sacred rivers Ganga, Yamuna, Sarasvati (with debated identification).
- Kingdom overlays as approximate shaded regions with confidence; legendary/historical variants separately selectable.
- Ancient/modern comparison slider; current national boundaries shown for orientation, never projected backwards.
- Mythological vs historical time selector with explicit "these are not equivalent dating systems" affordance.
- Place card → kingdom → dynasty → characters → events → texts → timeline: all live links.
- Search in English, Hindi, IAST.

### 6.5 Epic universes (Phase 3)
**Ramayana:** Ayodhya & dynasty, birth/education, Sita/Janaka/Mithila, exile, Dandakaranya, Panchavati, Kishkindha (Hanuman, Sugriva, Vali, Vanaras), search, Lanka war, return, Uttara Kanda with textual differences flagged. Animated stage-by-stage route with selectable versions (Valmiki, Ramcharitmanas, regional) and a "literary reconstruction, not verified itinerary" note.

**Mahabharata:** Kuru origins, Bhishma's vow, Pandu/Dhritarashtra families, Krishna's role, Draupadi/Karna/Shakuni/Drona, political conflict, Gita in narrative setting, 18 days of Kurukshetra (interactive battlefield: day selector, formations, encounters, warriors, sources, all flagged literary), aftermath, final journeys. Sub-journeys: Pandavas' exile, Krishna's life (Mathura → Vrindavan → Dwarka), political geography of alliances.

### 6.6 Avatars and manifestations (Phase 2)
Dashavatara with the Buddha/Balarama variant preserved per tradition; why each avatar appears, narrative, scriptural placement. Shiva manifestations; Durga, Kali, Parvati, Lakshmi, Saraswati and regional goddesses. Relationship types `avatar_of`, `manifestation_of`, `aspect_of`, `identified_with` rendered distinctly, with a glossary explaining the difference.

### 6.7 Sacred geography and pilgrimage (Phase 2)
Char Dham, Jyotirlingas, Shakti Peethas (multiple lists as variants), river tirthas, major historical temples, Buddhist and Jain sites within their own traditions, Himalayan sacred geography. Each: original sacred name, modern city/region, country, historical development, mythological links.

### 6.8 Civilisation atlas (Phase 4)
Traditions as separate branches. Transmission overlays to Pakistan, Afghanistan, Nepal, Sri Lanka, Tibet, Central Asia, Bangladesh, Myanmar, Thailand, Cambodia, Laos, Vietnam, Indonesia/Bali, plus Indo-Iranian connections. Example flow: Ramayana in India vs Ramakien (Thailand) vs Reamker (Cambodia) vs Kakawin Ramayana (Java/Bali). Modern nations never depicted as extensions of ancient territories.

### 6.9 AI Mythology Guide (Phase 5)
RAG over the entity/relationship/source store only. Answers cite identifiable traditions, separate consensus from interpretation, state uncertainty, support beginner/intermediate/scholar depth, give IAST + pronunciation. Never invents quotations. Example questions it must handle: "How is Krishna related to the Pandavas?", "Why did Bhishma take his vow?", "How does Valmiki differ from Ramcharitmanas?", "How many generations separate Rama and Manu in the Vishnu Purana genealogy?"

---

## 7. Visual direction

- Palette: gold, indigo, copper, deep red, celestial blue on near-black. Define as CSS variables.
- Cinematic lighting, ambient particles, mandala geometry, layered cosmological realms, subtle temple-inspired architecture.
- Smooth zoom from cosmic scale to a single character.
- Culturally researched references; **no generic fantasy art**, no AI-generated deity imagery, no sacred iconography as decoration.
- Typography: a Devanagari-capable pair (e.g. Noto Serif Devanagari + a Latin serif) with IAST diacritics tested.

---

## 8. Quality gates

Every phase ends with these passing:

1. **Schema tests** (Vitest): all §4.4 rules; every seed file validates.
2. **Graph tests**: relationship trace returns a sourced path for ≥10 known pairs (e.g. Krishna ↔ Arjuna, Rama ↔ Manu, Kashyapa ↔ Garuda, Shakuni ↔ Duryodhana).
3. **Geo tests**: no cosmological place has coordinates; every terrestrial place has confidence + modern admin + ≥1 evidence item.
4. **Navigation tests** (Playwright): Place → Kingdom → Dynasty → Character → Event → Text → Timeline round trip; mode switch preserves entity.
5. **Accessibility**: every 3D view has a reachable 2D alternative; reduced-motion honoured; keyboard path through cards.
6. **Performance**: Lighthouse mobile ≥ 70 on entity pages; cosmic scene interactive < 4 s on mid-range Android.
7. **Scholarship log**: every claim added this phase lists its source in `docs/SOURCES.md`; unresolved disagreements go to `docs/OPEN_QUESTIONS.md`, not into the data as fact.
8. **Decision log**: architectural choices recorded in `docs/DECISIONS.md` with timestamp.

---

## 9. Execution plan

### Phase 1 — Foundation + Core Geography Prototype (current scope)

Deliver a deployed site where the opening experience, Cosmic Wheel, a working genealogy constellation and a working 3D/2D geography explorer are all live and interlinked.

1. Scaffold monorepo (§3.2), CI (lint, typecheck, Vitest, Playwright), deploy pipeline to Netlify, preview deploys on PRs.
2. Write `docs/DATA_MODEL.md` and implement `packages/schema` (Zod) + `packages/db` migrations with PostGIS. Implement §4.4 validators and tests **before** any content.
3. Write `docs/CONTENT_GUIDE.md`: how to author an entity/place/kingdom YAML, how to tag variants, how to cite. Public-domain source list in `docs/SOURCES.md` (e.g. Griffith Rigveda, Ganguli Mahabharata, Griffith/Dutt Ramayana, Wilson Vishnu Purana — verify licence status; list which editions are used).
4. Seed content: Phase 1 genealogy set (§6.3), ≥25 places (§6.4), ≥8 kingdoms (legendary + historical records where both exist, e.g. Magadha, Gandhara, Kuru), Yuga/Manvantara/Kalpa structure, creation-variant entry points (§6.1), with references on every relationship.
5. Build app shell: mode switcher, URL-state, entity/place/kingdom/text routes, cards, VariantPanel, SourceCard, confidence badges, search.
6. Build Cosmic Time Wheel (§6.2) + 2D fallback.
7. Build Genealogy constellation (§6.3) with worker-based layout, node cards, two-node trace, variant toggle + 2D tree fallback.
8. Build Geography explorer (§6.4): globe → map handoff, place/kingdom cards, overlays, slider, time selector, legend + list fallback.
9. Build opening experience (§6.1).
10. Integrate: every card link live across modes; run §8 gates; fix; deploy; write `README.md` with run/seed/deploy instructions.

**Phase 1 is done when:** a new user can land, choose a creation pathway, open the Cosmic Wheel, jump to Kashyapa, trace Kashyapa → Garuda with sources, open the Geography mode without losing Kashyapa in context, click Hastinapura, see its confidence class and modern location, and reach the Kuru dynasty stub — all on mobile and desktop.

### Phase 2 — Working Prototype depth
Avatar mode (§6.6); Philosophy mode (light); sacred geography & pilgrimage (§6.7); Yuga introduction journey; expanded Deva/Asura, Vishnu/Shiva/Shakti content; Hindi UI complete.

### Phase 3 — Epic Expansion
Ramayana and Mahabharata universes (§6.5): full family trees, narrative order, routes, Krishna's life, Kurukshetra battlefield, Pandavas' exile, political geography.

### Phase 4 — Wider Traditions & Historical Geography
Additional Puranic material; regional variants; Buddhist and Jain narrative universes; historically grounded territory datasets (Indus/Harappan, Vedic contexts, Mahajanapadas, Mauryan, Gupta, regional kingdoms); archaeological markers; period-specific maps; civilisation atlas (§6.8); expanded languages.

### Phase 5 — Intelligent Knowledge Explorer
Source-grounded AI guide (§6.9); personalised journeys; comparative mythology; disagreement mapping; accounts, bookmarks, progress sync.

Each phase ships usable functionality, not static demos.

---

## 10. Do-not list

- Do not place cosmic and historical time on one axis.
- Do not give coordinates to Meru, Patala, Vaikuntha, Svarga, Brahmaloka or divine Kailasa.
- Do not draw crisp borders for any ancient kingdom.
- Do not merge a legendary kingdom with a historical polity of the same name into one record.
- Do not present a Ramayana route or Kurukshetra formation as verified history.
- Do not store one father/mother per character when sources differ; store variants.
- Do not invent or paraphrase-as-quote any scripture.
- Do not use modern copyrighted translations.
- Do not put relationship, place or text data inside components.
- Do not start Phase 2 features during Phase 1.
- Do not depict modern nations as heirs of ancient territories.
- Do not use AI-generated images of deities.

---

## 11. Kick-off prompt (paste this into Claude Code as the first message)

```
You are building KĀLA, an interactive 3D atlas of Indian mythology, cosmology, genealogy and sacred/ancient geography. The complete brief is in KALA_BUILD_BRIEF.md at the repo root. Read it fully before doing anything.

Scope for this run: Phase 1 only, as defined in §9. Sections 2, 4, 8 and 10 are binding.

Work in this order and stop for review at the end of each step:
1. Scaffold the monorepo per §3, with CI and a Netlify deploy pipeline. Commit.
2. Write docs/DATA_MODEL.md and implement packages/schema and packages/db with all §4.4 validation rules and their tests. Commit.
3. Write docs/CONTENT_GUIDE.md and docs/SOURCES.md (public-domain editions only, licence verified). Commit.
4. Author Phase 1 seed content per §6.1, §6.3 and §6.4. Every relationship cites a source; every place carries a confidence class; cosmological realms have no coordinates. Commit.
5. Build the app shell, routes, cards, search and URL-state mode switching. Commit.
6. Build the Cosmic Time Wheel, the Genealogy constellation, and the Geography explorer, each with a 2D fallback. Commit after each.
7. Build the opening experience. Commit.
8. Run every quality gate in §8, fix failures, deploy, and write README.md.

Rules: never hardcode mythological data in components; never fabricate dates, quotations, coordinates or relationships; when sources disagree, store variants and record the disagreement in docs/OPEN_QUESTIONS.md; log architectural decisions in docs/DECISIONS.md with timestamps. If something in the brief is ambiguous, pick the most conservative scholarly reading, note it in OPEN_QUESTIONS.md, and continue.

Report after each step: what was built, what tests pass, what is open.
```
