# Stage 4 research brief (shared by all content agents)

You are authoring seed content for KĀLA, an educational atlas of Indian mythology. Repo root:
`C:\Projects\Kala`. Read, in this order, before writing anything:

1. `KALA_BUILD_BRIEF.md` §2 (principles) and §10 (do-not list) — binding.
2. `docs/CONTENT_GUIDE.md` — how to write every record type.
3. `docs/DATA_MODEL.md` — fields and rules.
4. `docs/SOURCES.md` and `content/sources/*.yaml` — the ONLY sources you may cite.
5. Existing `content/texts`, `content/traditions`, `content/variants`.

## Non-negotiable rules

- **Every locator must be confirmed by reading the actual passage online.** Fetch the translation
  page (see URLs below) and check the passage says what your record claims. If you cannot fetch it
  or cannot find the passage, DO NOT add the claim; list it in your notes file instead. Never write
  a locator from memory alone. Never use `<…>` placeholders.
- Locator formats: Ganguli Mahabharata `parva.section` using Ganguli's numbering (Adi Parva = 1;
  section LXVI → `1.66`). Wilson Vishnu Purana `book.chapter`. Griffith Rigveda
  `mandala.hymn.verse`. Griffith Ramayana `book.canto`. Devi Bhagavata `book.chapter`. SBE works:
  give the text and section as printed (e.g. `Svetasvatara Upanishad 3.2`, `Manu 1.68`).
- Summaries and explanations are in your own words. No quotations.
- When texts disagree (different fathers, different lists of the seven rishis, different wives),
  create a variant per account (use existing variants where they fit, or add new ones in
  `content/variants/`) and give each conflicting claim its variant.
- Write respectfully about living traditions; attribute claims ("In the Vishnu Purana, …").
- No historical dates on mythological figures. No coordinates on cosmological places.
- Only cite sources that exist in `content/sources/`. Do not add new sources; if you need one,
  put it in your notes file.
- Only touch the files you own (listed in your task). You may ADD variants in `content/variants/`
  with a filename prefix of your agent name to avoid clashes, e.g. `content/variants/genealogy-…`.
  Never edit or delete files you did not create.
- Use only the agreed slugs below for records owned by other agents. Do not create records for
  slugs another agent owns.

## Online texts (try these first)

- Ganguli Mahabharata: https://www.sacred-texts.com/hin/maha/ (Adi Parva sections:
  https://www.sacred-texts.com/hin/m01/m01065.htm style URLs — section number zero-padded to 3)
- Wilson Vishnu Purana: https://www.sacred-texts.com/hin/vp/ (index lists books and chapters)
- Griffith Rigveda: https://www.sacred-texts.com/hin/rigveda/ (e.g. rv10129.htm for 10.129)
- Griffith Ramayana: https://www.sacred-texts.com/hin/rama/
- Devi Bhagavata: https://www.sacred-texts.com/hin/db/
- Müller Upanishads: https://www.sacred-texts.com/hin/sbe15/ and /hin/sbe01/
- Bühler Manu: https://www.sacred-texts.com/hin/manu.htm
- Griffith Kumarasambhava: https://www.sacred-texts.com/hin/bwg/
- Dutt Harivamsha: https://www.gutenberg.org/ebooks/61937
- Others: search archive.org for the edition named in content/sources.

## Agreed slugs and owners

**genealogy agent** (entities + relationships about Kashyapa's family): `kashyapa`, `aditi`,
`diti`, `danu`, `vinata`, `kadru`, `garuda`, `aruna`, `indra`, `surya` (Vivasvat), `varuna`,
`hiranyakashipu`, `hiranyaksha`, `shesha`, `vasuki`, `takshaka`, `adityas` (group), `daityas`
(group), `danavas` (group), `nagas` (group), `vasus` (group), `rudras` (group), `ashvins`.

**deities agent** (entities + relationships for Brahma, sages, the great gods, early royal lines,
plus creation-pathway variants): `brahma`, `marichi`, `atri`, `angiras`, `pulastya`, `pulaha`,
`kratu`, `vasishtha`, `bhrigu`, `daksha`, `saptarishis` (group), `vishnu`, `lakshmi`, `shiva`,
`parvati`, `sati`, `ganesha`, `kartikeya`, `devi` (the Goddess, Shakta), `svayambhuva-manu`,
`vaivasvata-manu`, `ikshvaku`, `rama`, `chandra`, `budha`, `ila`, `pururavas`, `yayati`, `yadu`,
`puru`, `kuru`, `brahman` (principle), `purusha` (principle), `prakriti` (principle),
`hiranyagarbha` (principle).
Owns cross-links: `marichi` → `kashyapa` (parent), `daksha` → `aditi`/`diti`/`danu`/`vinata`/
`kadru` (parent), `surya` → `vaivasvata-manu` (parent).

**geography agent**: `content/places/*`, `content/kingdoms/*`, `content/dynasties/*`. Dynasties:
`suryavansha`, `chandravansha`, `kuru-dynasty`, `yadava-dynasty` (legendary stubs; founders may
reference `ikshvaku`, `pururavas`, `chandra`, `kuru`, `yadu`, `vaivasvata-manu`). Place and kingdom
entity associations may reference ONLY slugs listed in this file.

**cosmic agent**: `content/cosmic/*` and cosmic-model variants.

## Notes file

Write `docs/research/<agent-name>-notes.md`: what you added, every claim you dropped because you
could not confirm it, every disagreement between sources, and any source you wished you had.

## Before finishing

Run `pnpm --filter @kala/schema validate:content` from the repo root. Fix every issue in YOUR files.
Issues about slugs owned by other agents not existing yet are expected while they work; list them in
your notes. Report briefly: counts, dropped claims, open questions.
