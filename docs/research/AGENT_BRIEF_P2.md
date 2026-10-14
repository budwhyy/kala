# Phase 2 research brief (addendum to AGENT_BRIEF.md)

Read `docs/research/AGENT_BRIEF.md` first: **every rule there still applies** (verify every locator
by reading the actual passage online; own words only; no placeholders; variants for disagreement; no
coordinates for cosmological places; no historical dates for myths; only touch your own files).
This addendum covers what is new in Phase 2. The owner has approved Phase 2 scope.

Also read the Phase 1 notes in `docs/research/*-notes.md` (what was dropped and why), the current
`content/` (so you reuse existing slugs instead of duplicating), `docs/CONTENT_GUIDE.md`, and
`docs/DATA_MODEL.md` (new in Phase 2: `position`, `networks`, `journeys`).

## Online texts

sacred-texts.com blocks automated access. Use instead: Project Gutenberg, archive.org full-text
scans, the Wayback Machine copies of sacred-texts pages (web.archive.org/web/2023/https://www.sacred-texts.com/...),
wisdomlib.org reprints of the same editions, HathiTrust full view. Ganguli's Mahabharata is Gutenberg
#15474 (vol. 1 only); other volumes are on archive.org. Check that you are reading the same
edition that `content/sources/*.yaml` names, and use that edition's numbering.

## Adding sources

You MAY add a new source if you verify (1) bibliographic details and (2) that it is public domain:
USA — first published before 1 Jan 1931; and the author died before 1 Jan 1956 (UK/EU) — or the work
is otherwise clearly free. Put it in `content/sources/<slug>.yaml` (follow existing files; kind
`translation`, `original_edition`, `reference_work` or `secondary_scholarship`; `licence_note` says
how you verified it and what is still unverified). Translations must be `public_domain`. Do NOT
edit `docs/SOURCES.md` (several agents run at once): instead list each new source, with the table
row you would add, in your notes file; the lead will merge them.

## New data-model features

- **Ordered lists.** A list-kind variant (e.g. a Dashavatara) is stored as relationships with
  `variant` and `position` (1 = first in that list): `avatar_of`, `manifestation_of`, `aspect_of`,
  `member_of` accept `position`. Positions in one list must be unique. Create one variant per list
  (`kind: list`), one relationship per member. A figure in two lists = two relationships.
- **Pilgrimage networks** (`content/networks/<slug>.yaml`): `kind`, `traditions`, `variants` (list
  variants defining membership), summaries, references. Membership is stored on each Place as
  `pilgrimage_networks: [{ network, variant?, references }]`; the variant must be listed on the network.
- **Events** (`content/events/<slug>.yaml`): `names`, `participants` (entity + role), `places`,
  `cosmic_time` (variant + ordinal yuga etc., never years), `narrative_order`, `variant`, summaries,
  references. Events never carry historical dates.
- **Concepts** (`content/concepts/<slug>.yaml`): one `interpretation` per school/tradition, each with
  its own references. Different schools disagree; show that, never merge them.
- **Journeys** (`content/journeys/<slug>.yaml`): steps with `title`, `body`, optional `detail`,
  `references`, `cosmic_model`, `focus_yuga`, `links`.
- Traditions: you may add traditions (`content/traditions/`) when needed, with references. A sub-school
  must have the same `family` as its parent. Hindu, Buddhist, Jain and Indigenous traditions stay in
  separate families and are never nested under each other.

## Living-tradition respect

Pilgrimage sites, avatars and goddesses are objects of living worship. Write with respect, attribute
claims to texts ("In the Bhagavata Purana…"), avoid exoticising language, never present one sect's list
or account as the only one, and never say a tradition's belief "is false". Say what the sources say
and where they differ.

## Slug ownership (Phase 2)

Existing entity slugs from Phase 1 are usable by everyone (list `content/entities`). New slugs:

**avatars agent** — entities: `matsya`, `kurma`, `varaha`, `narasimha`, `vamana`, `parashurama`,
`krishna`, `balarama`, `buddha-avatar` (the *Puranic* avatar; never merge with the historical
Buddha or Buddhism), `kalki`, `mohini`, plus any further avatars of the Bhagavata Purana's list that
you confirm; Shiva manifestations; goddess entities `durga`, `kali`, `saraswati`, `mahalakshmi`,
`mahakali`, `mahasaraswati` and the Matrikas/Navadurga only where confirmed. Owns lists (variants
`avatars-*`) and events `narasimha-slays-hiranyakashipu`, `vamana-three-strides`, `varaha-rescues-earth`,
`matsya-and-the-flood`, `mohini-and-the-amrita` (only those you can source). Relationship files
`content/relationships/avatars-*.yaml`.

**gods agent** — entities: `prahlada`, `virochana`, `bali`, `vritra`, `tvashtri`, `vishvakarma`,
`brihaspati`, `shukra`, `agni`, `vayu`, `yama`, `kubera`, `dhanvantari`, `airavata`, `uchchaihshravas`,
and others you confirm; events `samudra-manthana`, `devasura-war` (only sourced). Relationship files
`content/relationships/gods-*.yaml`. Fill in the Indra, Brihaspati, Varuna etc. relationships that
connect them to existing figures (parent, enemy, teacher…).

**philosophy agent** — `content/concepts/*`, new traditions for schools (e.g. `advaita-vedanta`,
`vishishtadvaita`, `yoga`), new sources (Thibaut's Vedanta-Sutras with Shankara and Ramanujan SBE 34, 38,
48; a public-domain Yoga Sutras translation; etc., if you verify them).

**hindu-pilgrimage agent** — `content/networks/*`, new places (`content/places/*`) for sites not yet
present (Badrinath, Puri/Jagannath, Kedarnath, the Jyotirlinga sites, Shakti Peetha sites, Haridwar,
Kanchi, Gangotri, Yamunotri, Rishikesh, etc.), list variants `pilgrimage-*`, and pilgrimage_networks
entries on existing places (you may edit only the `pilgrimage_networks` field of Phase 1 places).

**buddhist-jain agent** — Buddhist and Jain sacred sites and circuits in their own right: new
traditions are NOT needed (`buddhist`, `jain` exist); new places, networks (`buddhist-*`, `jain-*`
slugs), list variants, sources (Rhys Davids' Mahaparinibbana Sutta SBE 11; Beal's Si-yu-ki 1884;
Legge's Fa-hien 1886; Jacobi's Jaina Sutras SBE 22, 45; Cunningham's Archaeological Survey reports and
Mahabodhi 1892; Imperial Gazetteer already present — verify what you use). Keep these networks separate
from Hindu ones. If a site is sacred to several traditions, create one place and tag it in each network.

**journey agent** — `content/journeys/*` only.

Cross-references between agents (e.g. the gods agent's event naming `kurma`) are resolved when all
agents finish; list unresolved cross-references in your notes.

## Place rules recap (from CONTENT_GUIDE §7)

Terrestrial places need confidence, `modern_admin`, ≥1 evidence item, geometry (unless debated). Be
conservative: "verified" needs archaeological/historical evidence from a citable source; temples with
a historical founding date cited from the Gazetteer or scholarship can be `verified` as sites but say
that this does not verify any legend. Coordinates: well-established location of the present-day site,
2 decimals, `[lon, lat]`. Never estimate from a story.

## Finish

Run `pnpm --filter @kala/schema validate:content` from the repo root and fix every issue in your files.
Unresolved cross-agent slugs are expected; note them. Do NOT run git commands. Write
`docs/research/<agent>-p2-notes.md`: what you added, every claim you dropped (couldn't confirm), all
disagreements between sources, proposed SOURCES.md rows, and open questions. Final report under 300 words.
