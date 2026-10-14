# Avatars agent, Phase 2 notes

## How passages were read

- Wilson's Vishnu Purana: sacred-texts `vp.txt.gz` (Wayback copy), split by book and chapter.
- Ganguli's Mahabharata: sacred-texts `mahatxt.zip` (Wayback copy), sections located by Ganguli's printed numbering
  (12.340 = Section CCCXL; 3.186 = Section CLXXXVI; 4.6; 6.23; 12.284; 13.14).
- Dutt's Harivamsha: Project Gutenberg 61937. Locator is the chapter number in the Harivamsha Parva ("41"); Dutt's
  numbering restarts in the Bhavishya Parva, so the locator is ambiguous for chapters 1-48 (reference notes say which parva).
- Dutt's Bhagavata (1895): archive.org `proseenglishtran12dutt` (University of Toronto scan). It holds **only
  skandhas 1 and 2** ("Vols 1, 2"). The Narasimha (7), Vamana (8), Matsya (8.24), Varaha (3.13), Kurma/Mohini (8) and
  Parashurama (9) chapters are therefore **not read**; only the lists in 1.3 and 2.7 are used.
- Pargiter's Markandeya Purana (1904): archive.org `in.ernet.dli.2015.47519` OCR. Cited at canto level (81, 82, 85, 87,
  88, 90, 91, 92) because OCR verse numbers are unreliable. Existing record `devi` uses 81.43 and 81.66; those verse
  numbers still need a scan check.
- Devi Bhagavata (Vijnanananda): Wayback copy of sacred-texts chapters. Eggeling's Satapatha Brahmana: archive.org `wg912`.

## What was added

- **21 entities**: matsya, kurma, varaha, narasimha, vamana, parashurama, krishna, balarama, buddha-avatar, kalki,
  mohini, dattatreya; virabhadra, ardhanarishvara; durga, kali, mahakali, saraswati, mahalakshmi, mahasaraswati, matrikas.
- **8 variants**: four lists (`avatars-list-bhagavata-1-3`, `-bhagavata-2-7`, `-harivamsha-41`,
  `-mahabharata-santi-340`) and four accounts (`avatars-harivamsha-account`, `avatars-daksha-sacrifice-mahabharata`,
  `avatars-daksha-sacrifice-vishnu-purana`, `avatars-durga-mahabharata`).
- **2 relationship files**: `avatars-vishnu-lists.yaml` and `avatars-shiva-goddess.yaml`.
- **5 events**: varaha-rescues-earth, narasimha-slays-hiranyakashipu, vamana-three-strides, matsya-and-the-flood,
  mohini-and-the-amrita.

## The lists as the sources give them

| List                               | Contents (in order)                                                                                                                                                                                                  | Balarama                    | Buddha                                        |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------- |
| Bhagavata 1.3 (22 forms)           | Kumaras, boar, Narada, Nara-Narayana, Kapila, Dattatreya, Yajna, Rishabha, Prithu, fish, tortoise, Dhanvantari, Mohini, man-lion, dwarf, Parashurama, Vyasa, king (Rama), Rama (Balarama), Krishna, Buddha, Kalki    | yes (19)                    | yes (21)                                      |
| Bhagavata 2.7 (order of narration) | boar, Yajna, Kapila, Dattatreya, Kumaras, Nara-Narayana, Prithu, Rishabha, Hayagriva, fish, tortoise, man-lion, dwarf, Dhanvantari, Parashurama, Rama, Krishna (+ Balarama as another portion), Vyasa, Buddha, Kalki | as a portion beside Krishna | yes                                           |
| Harivamsha 41 (ten, Kalki tenth)   | lotus form, boar, man-lion, dwarf, Dattatreya, Parashurama, Rama, Krishna, Vyasa, Kalki                                                                                                                              | no                          | no (Kalki debates Buddhists)                  |
| Mahabharata 12.340 (ten)           | swan, tortoise, fish, boar, man-lion, dwarf, Parashurama, Rama, Krishna, Kalki                                                                                                                                       | no                          | no                                            |
| Vishnu Purana                      | no numbered list; forms mentioned in passing                                                                                                                                                                         | portion of Shesha (5.1)     | illusory form (3.17-18), not called an avatar |

- **Buddha / Balarama**: the sources I could read never put them in the same ten. No PD source I could access gives a
  ten-form list that **replaces Buddha with Balarama** (or the common Matsya-Kurma-...-Buddha-Kalki Dashavatara). Dutt's
  footnote to the Harivamsha (note 78) gives such a "ten principal forms" list (fish, tortoise, boar, man-lion, dwarf,
  "the two Ramas", Krishna, Buddha, Kalki), but that is the translator's gloss, not the text, and it is not stored.
  Garuda, Agni, Matsya and Padma Puranas, Jayadeva and the Dashavatara lists they support are not available here and
  are listed as gaps.
- **Buddha**: `buddha-avatar` is stored only as the Vaishnava Puranic figure. The Vishnu Purana (3.17-18) never calls the
  deluding figure an avatar; the text is stored as `manifestation_of`, with the Bhagavata supplying the `avatar_of` link in
  its two lists. Summaries say plainly that this is not the historical Buddha and that Buddhists do not regard him as
  an avatar. Nothing links this record to Buddhist records.
- Position notes: in Bhagavata 1.3 the text numbers the forms from the fifth to the twentieth; the fish (10th), Buddha
  (21st) and Kalki (22nd) are inferred from the sequence. In 2.7 the text gives no numbers; positions count the forms
  named in order and are marked as such. The "king, Naradeva" at 18 is not named Rama by Dutt in 1.3; the sea-taming
  detail and the parallel in 2.7 are the basis.

## Glossary: how the four goddess/avatar link types were used

- **`avatar_of`** (from descends into the world as a form of to; used only for Vishnu). Example:
  `varaha` avatar_of `vishnu`. The Vishnu Purana (1.4) has Narayana take the boar form to lift the earth.
- **`manifestation_of`** (from is a form, emanation or power brought forth by to; may be a separate being). Example:
  `virabhadra` manifestation_of `shiva`. In the Santi Parva (12.284) Mahadeva creates him from his mouth as the embodiment of
  his wrath, but Virabhadra says he is neither Rudra nor Uma. Also `mahasaraswati` manifestation_of `devi`: the Devi
  Bhagavata (3.6) has the Devi call her "my bibhuti".
- **`aspect_of`** (from is a side or mode of the same deity, not a separate being). Example: `ardhanarishvara` aspect_of
  `shiva`: the half-male, half-female form in Mahabharata 13.14. Also `durga` aspect_of `vishnu` in the Vishnu Purana
  (Yoganidra, Vishnu's own illusory energy).
- **`identified_with`** (symmetric: sources treat two names or figures as the same). Example: `durga` identified_with `kali`:
  Yudhishthira's hymn (Mahabharata 4.6) calls the goddess he praises as Durga "the great Kali", and Arjuna's hymn (6.23) adds
  Mahakali, Uma and Saraswati. No avatar claim is made; the Devi Mahatmya, by contrast, makes Kali a separate emanation
  from Ambika's brow (`kali` manifestation_of `durga`).
- Nothing in the goddess material is an `avatar_of`: the Devi Mahatmya (92) does use incarnation language for the
  Goddess's future births (as Yashoda's child, Shakambhari and so on), but `avatar_of` is kept for Vishnu, and those
  forms have no records yet.

## Disagreements preserved

- Durga: formed from the gods' energies (DM 82) / issues from Parvati's body (DM 85) / is Parvati and Kali by other names
  (Mbh hymns) / is Yoganidra, Vishnu's power (VP 5.1) / is the Devi herself (DB 3.6) / is the first of five forms of
  Prakriti (DB 9.1). Each is a relationship with its own variant.
- Mahakali: tamasic Shakti given to Shiva (DB 1.2, 3.6) / a dreadful form of Uma (Mbh 12.284) / the Goddess herself at
  Mahakala (DM 92) / identified with Durga (Mbh 6.23).
- Matsya: unnamed fish (Satapatha 1.8.1) / Brahma (Mbh 3.186) / Hari (Bhagavata 1.3, 2.7). The event record carries no single
  variant for this reason.
- Balarama: Hari's form (Bhag 1.3), another portion of Krishna (Bhag 2.7), portion of Shesha (VP 5.1).
- Krishna: "part of a part" and "a portion" (VP 5.1 and Wilson's notes) vs "the Lord himself" (Bhag 1.3).

## Gaps and dropped claims

- **Entities not created** (avoid clashing with other agents' slugs): kapila, vyasa, the four Kumaras, Narada,
  Nara-Narayana, Yajna, Rishabha, Prithu, Hamsa/swan, Hayagriva, the lotus form. They appear as unplaced positions in the lists
  and in the variant descriptions. `dhanvantari` (gods agent) is linked.
- **Shiva manifestations**: no passage was read for Bhairava (the Devi Bhagavata only names a goddess Bhairavi at 3.19, not
  entered). Rudra is the same as `shiva` in KALA's existing record, so no Rudra entity was made. The eight forms of Rudra (VP
  1.8: Bhava, Sharva, Ishana, Pashupati, Bhima, Ugra, Mahadeva) and the eleven Rudras were read but not entered as separate
  entities because Wilson's note says they are one deity under many names; the `rudras` group already exists.
  Ardhanarishvara: the name is not in the PD passage; Mbh 13.14 describes the form and Ganguli's footnote calls it
  Hara-Gauri. The name is used for the entity and flagged in the summary. No Shiva Purana exists in PD (OQ-008).
- **Goddess**: Navadurga and the seven/eight Matrika lists are not in the cantos or chapters read (Pargiter's DM does not name Mahalakshmi or
  Mahasaraswati; those names come from the Devi Bhagavata, not from the Devi Mahatmya's cantos). Only the group `matrikas` is entered. The
  "three great forms of the Pradhanika Rahasya" are not in Pargiter's cantos; the triad is sourced from the Devi Bhagavata (1.2, 3.6).
  DM 92 describes future births as Shakambhari, Bhramari, Raktadantika and Shatakshi; no records exist for them yet.
- **Not read**: Bhagavata 3.13 (Varaha), 7 (Narasimha), 8 (Kurma, Vamana, Mohini, Matsya), 9 (Parashurama), 10 (Krishna), 12.2
  (Kalki); Harivamsha Bhavishya Parva chapters 29-45 (boar, man-lion, dwarf), and the Vishnu Parva Krishna chapters; Griffith's
  Ramayana was not re-read (the existing `rama` record covers 1.15). The Vedic Sarasvati (Rigveda) is outside this brief.
- **Wilson's footnotes** (e.g. that the Hiranyakashipu pillar story is in the Bhagavata, the dating comments about the
  Buddha passage) are scholarly comment from 1840, used only for attribution.

## Unresolved cross-references

None remaining: `dhanvantari`, `bali`, `prahlada` already exist in the dataset and validation passes.

## Proposed SOURCES.md changes

No new sources. Suggested updates to existing rows: `dutt-bhagavata-purana` verified edition is the 1895 Toronto scan
(archive.org `proseenglishtran12dutt`), which covers only skandhas 1-2; and `dutt-harivamsha` locator: chapter number
within Harivamsha Parva (restarts in Bhavishya Parva).

## Open questions

1. Should `buddha-avatar` stay without any cross-link to Buddhism records (current choice) or carry an explicit disclaimer link?
2. Does the lead want entities for Kapila, Vyasa and the Kumaras so that the Bhagavata 1.3 list is complete?
3. Check Pargiter verse numbers (the canto-level locators are safe; `devi` uses 81.43 and 81.66).
