# Gods agent notes (Phase 2)

## How the passages were read

sacred-texts.com was not fetched directly. Passages were read in the editions named in `content/sources`:

- **Ganguli Mahabharata**: Project Gutenberg ebook 15474 (volume 1: Adi and Sabha Parvas), Ganguli's section numbers kept (1.17, 1.18, 1.19, 1.20, 1.25, 1.65, 1.66, 1.75 to 1.83, 2.8, 2.10).
- **Wilson Vishnu Purana**: per-chapter text of the sacred-texts edition (1.8, 1.9, 1.10, 1.14, 1.15, 1.17 to 1.22, 3.1, 3.2, 3.3, 3.6, 3.17), Wilson's book.chapter numbering, including his footnotes.
- **Griffith Ramayana**: Wayback copy of sacred-texts, Book 1 cantos 45, 46 (first part only) and 47.
- **Dutt Harivamsha**: Gutenberg 61937, chapters 3 and 29 only (chapter numbers restart in the Bhavishya Parva, so passages there were not cited).

## Added

- **31 entities**: prahlada, virochana, bali, bana, danayu, vritra, vrishaparvan, sharmishtha, devayani, kacha, shukra, brihaspati, tvashtri, vishvarupa, vishvakarma, sanjna, yama, agni, vayu, kubera, dhanvantari, airavata, bhadramana, uchchaihshravas, rahu, maruts, kaustubha, kalakuta, varuni, apsarases, and the grouping entity `churning-products` (used to store each text's ordered list).
- **86 relationships** in `gods-asura-line`, `gods-teachers-priests`, `gods-craftsmen-and-elements`, `gods-churning`. These include the Indra links (enemy of Vritra, ally of Brihaspati and the Maruts, master of Airavata and Uchchaihshravas), Shukra as teacher, ally and curser, the Yayati–Devayani–Sharmishtha links to Yadu and Puru, Vishnu's blessings of Prahlada, Bali and Dhanvantari, and three ordered `member_of` lists of the products of the churning.
- **6 variants** (prefix `gods-`): three list variants (`gods-churning-list-mahabharata`, `-vishnu-purana`, `-ramayana`), `gods-mahabharata-krodha-daughters-line`, `gods-harivamsha-account`, `gods-maruts-born-of-diti`. Existing `mahabharata-adi-parva`, `vishnu-purana-account`, `valmiki-ramayana-account` and `groups-vasus-mahabharata` are reused.
- **2 places** (cosmological, no coordinates): `mandara`, `kshira-sagara`.
- **5 events**: `samudra-manthana` (Mahabharata account), `samudra-manthana-vishnu-purana`, `samudra-manthana-ramayana`, `devasura-war` (Mahabharata) and `devasura-war-vishnu-purana`.
- No new sources. No `cosmic_time` on any event: none of the three tellings places the churning in a yuga or manvantara within one of our cycle models (the Ramayana says only that it was before the end of the Krita age, and no Ramayana cycle model is stored).
- **Convention for `narrative_order.position`**: the section, chapter or canto number of the main passage (Adi Parva section, Vishnu Purana chapter, Ramayana Book 1 canto). The events have no `section` because the text records have no section structure.

## Why there are three churning events

The Event record has one `variant`. The three accounts differ on many points, so each has its own event and its own list variant, and no one version is "the" churning. `samudra-manthana` is the Mahabharata account because the brief asked for that slug and reuse of `mahabharata-adi-parva`; its summary says so.

## Disagreements between sources (all stored as variants or separate events)

- **Order and contents of what rises from the ocean** (list variants, with `position` on `member_of`):
  - Mahabharata 1.18: Moon, Lakshmi, a second "Soma" (position 3, left unfilled), the white steed (named Uchchaihshravas in 1.17 and 1.20), Kaustubha, Dhanvantari with the amrita, Airavata, then the poison Kalakuta last.
  - Vishnu Purana 1.9: Surabhi (position 1, no record), Varuni, Parijata (position 3, no record), Apsarases, Moon, poison, Dhanvantari, Shri. The main text does not list a horse, an elephant or Kaustubha.
  - Ramayana 1.45: poison first, then Dhanvantari, Apsarases, Sura, Uchchaihshravas, Kaustubha, Moon, Lakshmi, then amrita (position 9, no record). No Airavata.
  - Wilson's note 8 to VP 1.9 compares these and the Puranic lists; the popular count of fourteen is not in any of the three texts read.
- **The poison**: Shiva swallows it in the Mahabharata (after Brahma asks him, late in the sequence) and in the Ramayana (first, at Vishnu's invitation as the eldest god); in the Vishnu Purana the Nagas take it.
- **Who bears the mountain**: a "king of tortoises" in the Mahabharata, not explicitly identified with Vishnu; Hari in tortoise form in the Vishnu Purana and Vishnu in the Ramayana. For that reason `kurma` is a participant only in the Vishnu Purana and Ramayana events.
- **Motive**: the Vishnu Purana alone has Durvasas's curse of Indra. The Mahabharata and Ramayana give only the wish for immortality. Wilson's note adds that the Matsya Purana gives Shukra's revival of slain Daityas as the motive.
- **Mohini**: Vishnu's female form appears in the Mahabharata and Vishnu Purana accounts (hence `mohini` is a participant of those two events only); the Ramayana has Vishnu hide the amrita "with illusion" but no female form.
- **Airavata's origin**: inside the Mahabharata itself, he rises from the ocean (1.18) and is a child of Bhadramana, daughter of Krodha (1.66). Stored as an event (variant `mahabharata-adi-parva`) and a parent link (variant `gods-mahabharata-krodha-daughters-line`).
- **Maruts**: born of Diti's divided embryo (VP 1.21, Ramayana 1.47) but children of Marutwati, a wife of Dharma, in VP 1.15. The Diti links carry `gods-maruts-born-of-diti`; Marutwati has no record.
- **Apsarases**: churned from the ocean (VP 1.9, Ramayana 1.45) but also children of Pradha (MBh 1.65) or Muni (VP 1.21). Neither mother has a record, so only the churning membership is stored.
- **Sura/Varuni**: daughter of Varuna in both Ramayana 1.45 and MBh 1.66 (where her mother is Divi, Shukra's daughter); at the churning in the Ramayana and the Vishnu Purana.
- **Sons of Hiranyakashipu**: MBh 1.65 has five (Prahlada, Sanhrada, Anuhrada, Shivi, Vashkala); VP 1.15 has four (Anuhlada, Hlada, Prahlada, Sanhlada). No sibling links were entered. Both agree on Prahlada's descent Virochana, Bali, Bana (VP 1.21 gives Bali a hundred sons).
- **Tvashtri**: an Aditya in both lists, and a Rudra named Twashtri in VP 1.15; MBh 1.66's mare-shaped "Tvashtri" bearing the Ashvins is feminine in Ganguli, so no link was drawn. Sanjna is Vishvakarma's daughter in VP 3.2 (Wilson's note says the Matsya makes her Twashtri's daughter).
- **Ashvins' mother**: VP 3.2 only (Sanjna, variant `vishnu-purana-account`); the father already stored as Surya (VP) in the genealogy file.

## Claims dropped or left out

- **Durvasas** (the curse that starts the Vishnu Purana churning; VP 1.9 calls him a portion of Shankara and VP 1.10 makes him Atri's son). Left to the avatars agent, who owns Shiva manifestations. If `durvasas` appears, add `curse durvasas → indra` (VP 1.9) and `atri → durvasas` (VP 1.10).
- **Kubera**: other fathers and the family of Visravas appear only in Wilson's footnote to VP 1.10 (Bhagavata) and are not entered. The Harivamsha passage appointing Kubera as lord of the north is in the Bhavishya Parva, where chapter numbers repeat, so it was not cited. Kubera as a Lokapala is cited nowhere because the only VP source is Wilson's note.
- **Vritra**: the Indra–Vritra fight is not told in the passages used; the enmity rests on the epithet in MBh 1.25 and the genealogy in 1.65. A father is not entered (only Danayu as mother).
- **Rahu**: his mother Sinhika (MBh 1.65) and father Viprachitti (Wilson's note) have no records yet.
- **Entities not created** because they were minor or ambiguous: Surabhi (also a wife of Kashyapa with the same name), Parijata, Amrita, Sinhika, Pradha, Muni, Marutwati, Divi, Yogasiddha, Chhaya, Hrada/Hlada, Dirghatapas (Dhanvantari's second father in the Harivamsha), Vibhishana.
- **Brihaspati and Shukra as rivals**: MBh 1.76 describes their rivalry in boasting but it is not stored as `enemy`; the priesthoods are recorded through `ally` links to Indra, the Daityas, the Danavas and Vrishaparvan, and through the teacher link to Kacha.
- **Bali and Vamana**: the Vamana story is not in the Vishnu Purana text (Wilson's note to VP 3.1 reports the Bhagavata), so no `enemy` or `blessing` link to the avatar was entered beyond Vishnu's favour in VP 3.2. Ramayana 1.47 describes Indra as the one who struck down a Bali; whether this is the son of Virochana is not stated, so no link was drawn.
- **Terrestrial Mandara hill**: not entered; no source read places the mountain on Earth.
- **Vasus**: only Agni (via MBh's Hutasana, Anala) and Vayu (via both translators' gloss of Anila as wind) are linked, with `identified_with`, because the identification rests on translators' glosses of epithets and not on a passage saying so. In VP 1.15 both Dhava and Anala are glossed as fire, so the VP list does not settle which Vasu is Agni. A reviewer may want to drop either link.
- **Brihaspati, Garuda and Aruna as Adityas**: stored as `member_of adityas` under `mahabharata-adi-parva` (MBh 1.66), a classification the genealogy agent had left out for lack of a membership type.
- **Uchchaihshravas as Indra's mount**: rests on Griffith's footnote to Ramayana 1.45 and Wilson's note 8 to VP 1.9; the main Mahabharata text does not say who takes the steed. A reviewer may want a main-text source.
- **Dhanvantari as Vishnu's son** (mode `other`) comes from the Harivamsha dialogue only (chapter 29); the Bhagavata's account was not available.
- **Vishvarupa**: only the one VP 1.15 line.

## Cross-references still unresolved

`validate:content` reports four issues, all expected:

- `kurma` (avatars agent): used in `samudra-manthana-vishnu-purana` and `samudra-manthana-ramayana`.
- `mohini` (avatars agent): used in `samudra-manthana` and `samudra-manthana-vishnu-purana`.

If the avatars agent creates `mohini-and-the-amrita`, it should link to these three events.

## Proposed SOURCES.md rows

None. All citations use existing sources. The Harivamsha (`dutt-harivamsha`) is now used (chapters 3 and 29), so its row may drop the "not yet used" status, if any.

## Open questions

- Should the three churning events share a parent "group" record, so the site can show them as one story with three tellings? A view that lists them together would stop `samudra-manthana` reading as the standard version.
- Is `member_of` with `position` on a grouping entity (`churning-products`) the right way to store ordered lists whose members are not all entities? Gaps in positions mark items without records.
- Is the Mahabharata's second "Soma" in 1.18 (between Lakshmi and the horse) a separate product in the Sanskrit, or a rendering of Sura? Ganguli's text is ambiguous and the answer would change the list.
- Should Ketu, Surabhi and the Parijata tree get records so that the lists are complete?

## Sources wished for

- Dutt's Bhagavata (Skandha 8, chapters 6 to 12) for a fourth churning account and the Vamana and Bali story.
- The Mahabharata Shanti Parva and Udyoga Parva (Indra–Vritra, Vishvarupa) in Ganguli's volumes beyond Gutenberg's first.
- A Griffith Ramayana copy with the complete canto 46.
