# Deities agent notes

## How the passages were checked

sacred-texts.com returns Cloudflare/403 pages to scripts, so every passage was read from the Wayback
Machine copy of the same sacred-texts pages, using Wilson's full Vishnu Purana text file split into
book.chapter. The Samkhya Karika (Colebrooke 1837, `dli.ministry.22344`) and Pargiter's Markandeya
Purana (1904, `in.ernet.dli.2015.47519`) were read from archive.org OCR text. Ganguli locators use
the printed section number (file `m01066.htm` = Section LXV = `1.65`), the same convention the
genealogy agent uses.

## Added

- **35 entities**: every slug the brief assigns to the deities agent.
- **14 variants**:
  - Lists: `deities-saptarishis-vishnu-purana-vaivasvata`, `deities-brahma-mind-born-nine-vishnu-purana`
    and `deities-brahma-mind-born-six-mahabharata`.
  - Accounts: `deities-skanda-birth-vana-parva` and `deities-devi-mahatmya`.
  - Creation pathways (9): `deities-creation-nasadiya-sukta`, `-hiranyagarbha`, `-purusha-sukta`
    (vedic); `-taittiriya-brahman` (vedanta); `-samkhya` (samkhya); `-brahma-vishnu-purana`
    (puranic); `-vishnu-supreme` (vaishnava); `-svetasvatara-rudra` (shaiva);
    `-devi-bhagavata-shakti` (shakta).
- **48 relationships** in `deities-brahma-line`, `deities-great-gods`, `deities-principles` and
  `deities-royal-lines`. All the cross-links I own are included.
- `validate:content` passes with no errors in the full dataset.

## Decisions and gaps

- **Saptarishi membership.** The schema has no "member of" type, so the lists are written in variant
  descriptions, not as relationships. The `saptarishis` entity is linked only by
  `manifestation_of vishnu`. Vishnu Purana 3.1 says the seven rishis, and the others it names, are
  Vishnu's might in personal form.
- **Shanti Parva list not added.** This is the Marichi … Vasishtha "Chitrasikhandin" list. Wilson cites
  it in a note to VP 1.7, but I could not fetch the Ganguli Shanti Parva index from the archive, so
  the list and its locator are left out.
- **Principles.**
  - `brahman`: identified with `devi` (DB 3.6). I found no text-supported link from Brahman to any
    other entity.
  - `purusha`: one entity covers two senses, the Vedic cosmic Person and Samkhya spirit; the summary
    keeps them apart. Its links are `aspect_of vishnu` (VP 1.2) and parent of `chandra`/`surya`
    (RV 10.90.13, mode `other`).
  - `prakriti`: `aspect_of vishnu` (VP 1.2) and `identified_with devi` (DB 3.6). The Samkhya pairing
    of purusha and prakriti (SK 21) has no fitting type ("partner" would be wrong), so it is only
    described in the variant.
  - `hiranyagarbha`: Rudra's child, mode `other` (Svetasvatara 3.4 and 4.12). It is also
    `identified_with brahma` (VP 1.2), but the name Hiranyagarbha appears only in **Wilson's
    annotation**; the text itself puts Brahma in the golden egg. This is flagged in the reference
    note, and a reviewer may want to drop it.
- **Ganesha.** There is no public-domain Shiva Purana (OQ-008). The only parent link is a passing
  mention in DB 5.19 (the gods' hymn) that Ganesha is born of Mahadeva: variant
  `devi-bhagavata-account`, mode `other`. DB 9.38 says he is "born in part of Krishna". It is not
  entered because Krishna has no slug. No birth narrative exists among our sources.
- **Kartikeya.** Only the Vana Parva account is entered (3.224–3.230): son of Agni, and through
  Rudra/Uma entering Agni/Svaha, son of Shiva and Uma (mode `divine`). Agni and Svaha have no slugs.
  Griffith's Ramayana as archived skips from Canto XXXVI to XXXIX, so the Ganga birth story
  (cantos 37–38) could not be checked. The Kumarasambhava in Griffith ends before the birth.
- **Daksha.** He is mind-born of Brahma in VP 1.7, but son of the Prachetasas and Marisha in VP 1.15
  and "born of Prachetas" in MBh 1.75. The Prachetasas parentage is not entered (no slug). The
  "right thumb" birth is mentioned only by Maitreya in VP 1.15, so it is not entered.
- **Bhrigu.** He is mind-born in VP 1.7, but in MBh 1.66 he bursts from Brahma's breast. The two are
  stored in separate variants with modes `mind_born` and `other`.
- **Brahma → Shiva** (VP 1.7, Rudra from the forehead) is stored under the VP variant only, because
  Shaiva texts disagree.
- **Lakshmi.** She is Bhrigu's daughter in VP 1.8, and also rises from the churned ocean in VP 1.9.
  The churning is not a parent relationship.
- **Ikshvaku.** He is Manu's son in MBh 1.75 and Ramayana 1.70 (biological, no variant). The sneeze
  birth in VP 4.2 is stored as mode `other` under the VP variant.
- **No `generations` field anywhere.**
  - For Yayati, the line Pururavas → Ayus → Nahusha → Yayati is named in MBh 1.75 and 1.95 but not
    counted.
  - For Kuru, the intermediate kings differ between MBh 1.94 and 1.95.
- **Devi Mahatmya locators** (Pargiter 81.43, 81.66) come from OCR verse numbers. Please check them
  against a page scan.

## Sources wished for

- A public-domain Shiva Purana, for Ganesha's and Kartikeya's birth.
- The Brahmavaivarta Purana, for Ganesha.
- A complete Griffith Ramayana canto 37 (Kumara).
