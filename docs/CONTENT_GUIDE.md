# Content guide

How to add or change KĀLA content. Read [DATA_MODEL.md](DATA_MODEL.md) for the full field list and
[SOURCES.md](SOURCES.md) for the editions we cite. The principles in the
[build brief](../KALA_BUILD_BRIEF.md) §2 are binding on every change.

> The YAML examples below are checked by an automated test (`packages/schema/test/guide.test.ts`),
> so they always match the real rules. Locators written as `<…>` are placeholders: look up the real
> passage before using an example as a starting point.

## 1. The five rules that matter most

1. **Cite everything.** Every claim needs a reference to a specific edition and passage. If you
   cannot find the passage, do not add the claim.
2. **Never flatten disagreement.** If texts disagree, store each version under its own variant, and
   note the disagreement in [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) if it is unresolved.
3. **Never date a myth.** Stories get cosmic positions (yuga, manvantara…) or narrative order. Only
   historically attested things get years.
4. **Never put a heavenly realm on the map.** Cosmological places have no coordinates.
5. **Never quote what you cannot quote.** Quote only public-domain or openly licensed translations,
   word for word, with the exact locator. Never present a paraphrase as a quotation.

## 2. Files and names

- One folder per collection under `content/`: `sources`, `texts`, `traditions`, `variants`,
  `entities`, `relationships`, `events`, `dynasties`, `places`, `kingdoms`, `concepts`, `routes`,
  `battlefields`, `cosmic`.
- **One record per file**, named after its slug: `content/entities/kashyapa.yaml`.
- **Relationships are grouped** by the figure or family they are mainly about, as a YAML list:
  `content/relationships/kashyapa-family.yaml`. Each still has its own unique `id`.
- **Slugs** are lowercase kebab-case ASCII, without diacritics: `kashyapa`, `hastinapura`,
  `kuru-kingdom-epic`. A slug never changes once published, because it is part of a URL.
- When two records would share a name, say how they differ in the slug:
  `kailash-mountain` / `kailasa-cosmological`, `kuru-kingdom-epic` / `kuru-mahajanapada`.

Check your work at any time:

```bash
pnpm --filter @kala/schema validate:content
```

## 3. Names

Every record needs an English display name. Add Sanskrit in Devanagari with IAST, and Hindi when
the Hindi form or spelling differs.

```yaml
# collection: entities
slug: kashyapa
names:
  - text: Kashyapa # English display name: no diacritics
    lang: en
    script: Latn
  - text: कश्यप # Sanskrit in Devanagari
    lang: sa
    script: Deva
    iast: Kaśyapa # required for Sanskrit, Pali and Prakrit
kinds: [rishi, prajapati]
traditions: [puranic]
summary_beginner: >-
  A sage counted among the seven great rishis, described in several texts as the father of gods,
  asuras, nagas and birds through his many wives.
references:
  - source: ganguli-mahabharata
    locator: "<parva>.<section>"
```

- `lang` is an ISO 639 code (`en`, `hi`, `sa`, `pi` for Pali, `pra` for Prakrit, `ta` for Tamil).
- `script` is an ISO 15924 code (`Latn`, `Deva`, `Taml`…).
- Use `meaning` for a literal gloss only when a source or standard dictionary supports it.
- Put titles and descriptive names (e.g. "Vainateya", son of Vinata) in `epithets`, not `names`.

## 4. Citing

A reference is `{ source, locator, note? }`:

- `source` is a slug from `content/sources/` — a specific edition, never just a work.
- `locator` is required. Use the convention listed for that edition in [SOURCES.md](SOURCES.md)
  (e.g. book.chapter.verse, or volume:page for scholarship).
- `note` explains anything a reader would need: "names Vinata as mother", "Bombay recension only".

Prefer primary texts for narrative claims. Use scholarship (`cited_only` sources) for dates,
archaeology and identifications of places. Never cite a modern copyrighted translation as the basis
for content.

## 5. Variants: storing disagreement

Create a variant whenever a claim belongs to one account rather than to the tradition as a whole:

```yaml
# collection: variants
slug: vishnu-purana-genealogy
names:
  - text: Vishnu Purana genealogy
    lang: en
    script: Latn
kind: genealogy
tradition: vaishnava
text: vishnu-purana
description: The genealogies as given in the Vishnu Purana (Wilson's translation).
references:
  - source: wilson-vishnu-purana
    locator: "<book>.<chapter>"
```

- **Leave `variant` out** only when the claim is not disputed in any source we hold.
- **Two different parents** for the same child (same role and mode) must each carry a different
  variant, or validation fails. A legal and a divine father are different `mode`s and do not
  conflict.
- **Creation pathways** (§6.1 of the brief) are variants with `kind: creation_pathway`. Never write
  any one of them as "the" origin story.
- If you cannot tell which account a claim belongs to, do not guess: add it to
  [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) and leave it out of the data.

## 6. Relationships

```yaml
# collection: relationships
- id: kashyapa-father-of-garuda
  from: kashyapa
  to: garuda
  type: parent
  role: father
  mode: biological
  explanation: Garuda is born to Kashyapa and Vinata.
  references:
    - source: ganguli-mahabharata
      locator: "<parva>.<section>"
- id: vinata-mother-of-garuda
  from: vinata
  to: garuda
  type: parent
  role: mother
  mode: biological
  explanation: Garuda hatches from the second of Vinata's eggs.
  references:
    - source: ganguli-mahabharata
      locator: "<parva>.<section>"
- id: garuda-vahana-of-vishnu
  from: garuda
  to: vishnu
  type: vahana_of
  explanation: Garuda becomes Vishnu's mount after a boon exchanged between them.
  references:
    - source: ganguli-mahabharata
      locator: "<parva>.<section>"
```

- Store **parent**, not child; **teacher**, not disciple. The site derives the reverse.
- Directed types read "from … to": `curse` (from cursed to), `avatar_of` (from is an avatar of to).
- Symmetric types (`partner`, `sibling`, `ally`, `enemy`, `identified_with`) are stored once, in
  either direction.
- `avatar_of`, `manifestation_of`, `aspect_of` and `identified_with` mean different things. Use the
  one the source uses; do not upgrade an identification into an avatar.
- `member_of` puts a figure in a named group (a Vasu in `vasus`, a rishi in `saptarishis`). When texts give different lists, give each membership the variant of its list.
- `descendant_of` links distant generations (Rama to Manu) when the intermediate line is not yet
  entered. Add `generations` only if the source counts them.
- The `explanation` is your own plain-English summary, not a quotation.

## 7. Places: choosing the confidence class

```
Is it a heavenly / underworld / cosmic realm?  ──yes──► realm: cosmological, confidence: mythical, no geometry
        │ no
Is the identification supported by excavation, inscriptions or datable records?
        │ yes ──► verified       (needs an archaeological or historical evidence item)
        │ no
Do scholars or traditions propose more than one location?
        │ yes ──► debated        (list each in alternative_identifications; geometry optional)
        │ no
        └──────► traditional     (living tradition locates it here; geometry required)
```

A verified town does **not** verify the epic events set there. Say so in the summary when it matters.

Cosmological realm:

```yaml
# collection: places
slug: vaikuntha
names:
  - text: Vaikuntha
    lang: en
    script: Latn
  - text: वैकुण्ठ
    lang: sa
    script: Deva
    iast: Vaikuṇṭha
realm: cosmological
kind: realm
confidence: mythical
traditions: [vaishnava]
summary_beginner: The abode of Vishnu in Vaishnava cosmology. It is not a place on Earth.
references:
  - source: dutt-bhagavata-purana
    locator: "<skandha>.<adhyaya>"
```

Debated terrestrial place (note: coordinates go inside each identification, and `modern_admin`
describes where the leading candidates lie):

```yaml
# collection: places
slug: example-debated-site
names:
  - text: Example Debated Site
    lang: en
    script: Latn
realm: terrestrial
kind: city
confidence: debated
modern_admin:
  country: India
alternative_identifications:
  - label: Candidate A
    confidence: debated
    geometry:
      type: Point
      coordinates: [80.0, 20.0] # [longitude, latitude]
    argument: Why some scholars place it here, in one or two sentences.
    references:
      - source: cunningham-ancient-geography
        locator: "<page>"
  - label: Candidate B
    confidence: traditional
    argument: Where local tradition places it, and on what basis.
    references:
      - source: cunningham-ancient-geography
        locator: "<page>"
evidence:
  - type: textual
    summary: What the texts say about its location.
    references:
      - source: ganguli-mahabharata
        locator: "<parva>.<section>"
summary_beginner: One or two plain sentences a newcomer can follow.
references:
  - source: cunningham-ancient-geography
    locator: "<page>"
```

- Coordinates are `[longitude, latitude]` (GeoJSON order), WGS 84. Use a point for a town, a line for
  a river, a polygon only for a region whose extent is genuinely known.
- Take coordinates from a citable source (an excavation report, a gazetteer). Never estimate a
  location from a story.
- `modern_admin` is for orientation only: it never means the ancient place "belonged to" a modern
  country.
- Link terrestrial Mount Kailash and cosmological Kailasa with `related_places`
  (`relation: cosmological_counterpart`), never by merging them.

## 8. Kingdoms: legendary and historical are separate

When a name belongs to both an epic kingdom and a historical polity, write **two records** and link
them both ways with `same_name_as`:

```yaml
# collection: kingdoms
slug: kuru-kingdom-epic
names:
  - text: Kuru (Mahabharata)
    lang: en
    script: Latn
kind: epic_legendary
same_name_as: [kuru-mahajanapada]
summary_beginner: The kingdom of the Kuru dynasty as described in the Mahabharata.
references:
  - source: ganguli-mahabharata
    locator: "<parva>.<section>"
```

- `epic_legendary` kingdoms have no `historical_time` and no `attested: true` rulers.
- Historical polities need `historical_time` and carry no `cosmic_time`.
- `extent` is an approximate region with its own confidence and references; it is drawn as a soft
  shaded area. Never draw a crisp border, and never project modern borders backwards.

## 9. Time

- **Cosmic time** (`cosmic_time`) places something inside one account's cycle model. It always names
  the `variant` and is an ordinal position, never a number of years:

  ```yaml
  # collection: entities
  slug: example-figure
  names:
    - text: Example Figure
      lang: en
      script: Latn
  kinds: [king]
  traditions: [puranic]
  summary_beginner: Placeholder used to show the cosmic_time shape.
  cosmic_time:
    - variant: vishnu-purana-genealogy
      yuga: treta
      references:
        - source: wilson-vishnu-purana
          locator: "<book>.<chapter>"
  references:
    - source: wilson-vishnu-purana
      locator: "<book>.<chapter>"
  ```

- **Historical time** (`historical_time`) is only for things with archaeological or documentary
  evidence. Years are signed integers: `-500` = 500 BCE. Always give `precision` and `confidence`,
  and cite the scholarship.
- Never convert one into the other. "Kali Yuga began in 3102 BCE" is a traditional reckoning to be
  described in text and cited, not a `historical_time`.

## 10. Writing summaries

- `summary_beginner`: one to three sentences for someone with no background. Plain words; explain
  any Sanskrit term the first time.
- `summary_scholar` (optional): textual history, variants, debates, with the nuance a specialist
  expects.
- Write about **living traditions** respectfully and in the present tense where people still
  practise them ("Vaishnavas regard…", not "the ancient Indians believed…").
- Attribute claims: "In the Vishnu Purana, …", "According to Valmiki's Ramayana, …".
- Do not translate passages yourself and present them as quotations. Summaries are your own words.

## 11. When you are unsure

Do not put uncertain material into `content/` as fact. Add an entry to
[OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) with the question, the sources you checked and the
conservative reading you adopted, then continue with what is certain.

## 12. Checklist before opening a pull request

- [ ] `pnpm --filter @kala/schema validate:content` passes.
- [ ] Every new claim has a reference with a real locator (no `<…>` placeholders).
- [ ] Every source you cited is listed in [SOURCES.md](SOURCES.md) with its licence.
- [ ] Disagreements are stored as variants, and unresolved ones are in OPEN_QUESTIONS.md.
- [ ] No cosmological place has coordinates; every terrestrial place has evidence and a modern location.
- [ ] No myth has a historical date.
