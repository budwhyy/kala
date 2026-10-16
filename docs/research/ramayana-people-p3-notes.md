# ramayana-people agent: Phase 3 notes

## Editions read

- **Griffith, _The Rámáyan of Válmíki_** (`griffith-ramayana`): Project Gutenberg ebook 24869, split into
  cantos from the printed `BOOK n` / `Canto N` headings. Locators are `book.canto` with Griffith's own canto
  numbers, which skip cantos he leaves out (e.g. 1.37-38, 5.5, 6.76-92). Griffith ends with Book VI; his
  Uttarakanda is a prose summary in the closing matter, so Book VII is not cited from him.
- **Dutt, prose _Ramayana_** (`dutt-ramayana`): archive.org scans. Bala and Ayodhya Kandas from
  `the-ramayana-volume-one`; Uttara Kanda from `TheRamayanaUttaraKandam` (Google scan), checked against
  `india.history.resource.78151` (the same printing). Locator `kanda.sarga`, using Dutt's printed SECTION
  numbers. Dutt's sections do not always match Griffith's cantos (Tataka's birth is Griffith 1.27 but
  Dutt 1.25).
- **Macdonell, _A History of Sanskrit Literature_** (1900): Gutenberg ebook 41563. The HTML keeps the
  printed page numbers. The passage on Book VII as a later addition is on pp. 304-305.

## What I added

- **80 entities.** The Ayodhya family: dasharatha, kausalya, kaikeyi, sumitra, lakshmana, bharata,
  shatrughna, lava, kusha. Mithila: sita, janaka, kushadhvaja, urmila, mandavi, shrutakirti. Sages:
  vishvamitra, valmiki, ahalya, plus **gautama-rishi**, which is not on my slug list (see below). Forest
  allies: guha, shabari, jatayu, sampati. Vanaras: group `vanaras`, sugriva, vali, hanuman, **anjana**,
  angada, tara-vanara, jambavan, nala-vanara, nila-vanara. Rakshasas: group `rakshasas`, vishravas,
  kaikasi, sumali, ravana, kumbhakarna, vibhishana, shurpanakha, indrajit, mandodari, tataka, maricha,
  subahu, khara, dushana. Also the 32 Ikshvaku kings between Ikshvaku and Dasharatha in Bala Kanda 1.70:
  kukshi, vikukshi, bana-ikshvaku, anaranya, prithu-ikshvaku, trishanku, dhundhumara, yuvanashva,
  mandhata, susandhi, dhruvasandhi, bharata-son-of-dhruvasandhi, asita-ikshvaku, sagara, asamanja,
  anshuman, dilipa, bhagiratha, kakutstha, raghu, kalmashapada, shankhana, sudarshana-ikshvaku,
  agnivarna, shighraga, maru-ikshvaku, prashushruka, ambarisha-ikshvaku, nahusha-ikshvaku,
  yayati-ikshvaku, nabhaga-ikshvaku, aja. Where a name clashes with a different figure (the lunar-line
  Yayati, the asura Bana, the rishi Asita, Vishnu's Sudarshana, Janaka's ancestor Maru), I added a
  suffix to the slug. Each king and Dasharatha has a `dynasties` association to `suryavansha`.
- **160 relationships** in 7 files, `content/relationships/ramayana-*.yaml`: ikshvaku-line (34),
  ayodhya-family (30), mithila-family (7), teachers-sages (8), allies-enemies (18), vanaras (25),
  rakshasas (38).
- **2 variants**: `ramayana-people-ikshvaku-line-bala-kanda` (genealogy; Vasishtha's recital in 1.70,
  repeated in 2.110) and `ramayana-people-ikshvaku-line-ayodhya-kanda`, which holds only the one link
  where 2.110 differs.
- **1 source**: `macdonell-history-sanskrit-literature`.
- **Uttara-only claims** use the ramayana-story agent's `ramayana-story-valmiki-uttara-kanda`. I first
  created `ramayana-people-uttara-kanda`, found theirs, and deleted mine to avoid two variants for one
  layer. Claims under it: Sita as mother of Kusha and Lava; Kaikasi as mother of the four; Sumali as
  Kaikasi's father; Vishravas as father of Vibhishana and Shurpanakha; Vishravas-Kaikasi partner;
  Mandodari as Indrajit's mother; Kaikasi and Sumali as members of the rakshasas.
- **Existing records reused, not duplicated:** `rama descendant_of ikshvaku` and `rama avatar_of vishnu`.
  The chain from Ikshvaku through Kukshi down to Aja and then Dasharatha joins the existing `ikshvaku` to
  Rama. Other existing slugs linked: vishnu, lakshmi, indra, surya, vayu, agni, vishvakarma, brahma,
  aruna, pulastya, kubera, vasishtha.

## Modelling decisions

- **Sita**: `janaka → sita`, father, mode `adoptive`. In Griffith 1.66 and 2.118, Janaka finds her under
  his plough and declares her his daughter. A voice from the sky confirms it, and his chief queen raises
  her. The text says she was not born of a mortal mother, so no other parent is entered. Urmila is
  Janaka's daughter ("thy daughters", 1.70), mode `biological`. The text does not describe her birth.
- **Kusha and Lava**: the father link `rama → kusha/lava` has **no** variant, because Bala Kanda 1.4
  already calls the twins Rama's sons (Dutt 7.109-110 is also cited). Only Sita as their mother is
  Uttara-only (Dutt 7.79). This departs from the instruction to tag Lava and Kusha as Uttara. Macdonell
  (p. 304) treats Book I as largely a later layer too, but our Uttara variant is about Book VII only.
- **Vishravas as Ravana's father** (Griffith 1.22, 3.69, 5.23) and Kumbhakarna's father (6.61) are in
  Books I-VI, so they carry no variant. Kubera is Ravana's brother in 1.22, 3.48 and 3.69, so the sibling
  link has no variant.
- **Divine fathers** (mode `divine`): Indra → Vali, Surya → Sugriva, Vayu → Hanuman, Vishvakarma → Nala,
  Agni → Nila (1.16; 4.66; 6.22). Anjana is Hanuman's mother, mode `biological` (4.66).
- **avatar_of vishnu for Bharata, Lakshmana and Shatrughna** (1.15, 1.19): Vishnu divides himself into
  four, and each brother is born of a portion of him. **Sita `identified_with` lakshmi** (6.119): Brahma
  says that she is Lakshmi. I did not upgrade this to avatar.
- **Enemies** are entered only where the text shows open hostility or a killing: Rama with Ravana,
  Kumbhakarna, Tataka, Subahu, Maricha, Khara and Dushana; Lakshmana with Indrajit and Shurpanakha;
  Jatayu with Ravana; Vali with Sugriva. **Rama–Vali is not entered as `enemy`.** Rama presents the
  killing as a king's punishment (4.17-4.18), and Vali says he never harmed Rama.

## Claims dropped (could not confirm)

- **Subahu as Tataka's son.** Neither Griffith nor Dutt says so. Dutt 1.20 calls Maricha and Subahu "the
  sons of Sunda and Upasunda", and only Maricha is Tataka's son (1.26-27).
- **Vishravas → Kubera as parent** (Dutt 7.3, Uttara). The gods agent's `pulastya-father-of-kubera`
  (MBh 2.10) has no variant, so adding a second biological father would fail validation. Proposed fix:
  give that link a Mahabharata variant. Vishravas → Kubera could then go in under the Uttara variant.
- **Brahma → Jambavan.** Griffith 1.16 has Brahma make "the lord of bears" from his yawn without naming
  him.
- Agastya's curses on Tataka and Maricha (1.27) are not entered because there is no `agastya` entity.
- These figures are also not entered, as nobody listed them: Prachetas (Valmiki's father, Dutt 7.109);
  Kalindi (Sagara's mother); Keshini and Sumati; Shyeni (Jatayu's mother); Sushena (Tara's father, 4.22);
  the male vanara Tara, son of Brihaspati (1.16); Kesari (4.39, not named as Hanuman's father); Janaka's
  ancestors from Nimi to Hrasvaroma (1.71); Prasenajit and Suvrata; Maya and Hema (Dutt 7.12);
  Devavarnini and Trinavindu's daughter (7.2-3); Ketumati (7.5); and the wives of Kumbhakarna and
  Vibhishana and the husband of Shurpanakha (7.12).

## Disagreements between versions

- **Ikshvaku line**: in Bala 1.70 the line runs Nahusha → Yayati → Nabhaga. In Ayodhya 2.110 it runs
  Nahusha → Nabhaga. Griffith and Dutt agree on both readings, so they are stored as two variants.
  Dutt also reports in his footnotes that the Bengal text has Ikshvaku → Vikukshi, with no Kukshi, and
  Marichi → Angiras → Prachetas → Manu at the top. That is another recension and not our edition, so
  it is not stored.
- **Khara and Dushana**: Shurpanakha calls them her brothers (3.17), and the sibling links are stored on
  that basis. The Uttara (Dutt 7.9) gives Kaikasi only four children. I did not check Khara's
  parentage in the Uttara.
- **Kubera's father**: Pulastya in MBh 2.10, but Vishravas in the Uttara (Dutt 7.3), where Kubera is
  Pulastya's grandson.
- **Indrajit's death**: Griffith abridges it into a prose note at the end of 6.75, which I cite with a
  note.

## Numbering cautions

- Dutt's Uttara scans read the section headings around 74-78 irregularly. A printed LXXIV seems to be
  missing and LXXVIII seems to appear twice. The twins' birth is under the printed heading LXXIX in both
  scans, so it is cited as 7.79. Kusha and Lava are given their kingdoms in section CXX (7.120).

## Proposed SOURCES.md row

| `macdonell-history-sanskrit-literature` | _A History of Sanskrit Literature_, New York: D. Appleton, 1900 | Arthur A. Macdonell (1854-1930; death year to verify) | page | public_domain | Title page and page numbers read in Gutenberg 41563; pre-1931 US publication |

The schema test `scholarship.test.ts` fails until this row (and the story agent's Growse row) is added.

## Cross-agent issues

- **Macdonell source slug collision.** The ramayana-story agent's Uttara variant cites the same slug,
  `macdonell-history-sanskrit-literature`. My generator wrote that source file without checking whether
  it already existed. If the story agent had already written it, my version replaced theirs. The current
  file describes the same 1900 edition. Please confirm with the story agent's notes.
- I rely on `ramayana-story-valmiki-uttara-kanda` (story agent's file). If they rename it, update the 13
  relationships that use it (2 in ayodhya-family, 11 in rakshasas).
- Suggest that the gods agent adds a variant to `pulastya-father-of-kubera` (see above).
- `gautama-rishi` and `anjana` are new slugs outside the P3 list. Gautama is needed so that Ahalya has
  sourced relationships (partner; Gautama's curses on Indra and Ahalya, 1.48). The lead asked for Anjana.

## Open questions

- Should the Uttara variant also cover Book I material, given Macdonell's view? I have kept it to
  Book VII.
- A Ramcharitmanas account of these families (e.g. the illusory Sita) belongs to the story agent's
  variant and was not entered here.
