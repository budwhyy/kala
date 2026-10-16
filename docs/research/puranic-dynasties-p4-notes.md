# puranic-dynasties agent — Phase 4 notes

## Added

- Source `pargiter-dynasties-kali-age` (Pargiter 1913, OUP; PD, Pargiter d. 1927). Read in the
  archive.org full text (in.ernet.dli.2015.22906); translation pp. 65-77 used, pp. 67-72 cited.
- Variants: `puranic-kali-kings-vishnu-purana` (Wilson VP 4.23-24), `puranic-kali-kings-matsya-vayu-pargiter`.
- Dynasties (legendary, lineage `other`): `puranic-{barhadratha,pradyota,shishunaga,nanda,maurya,shunga,kanva,andhra}-dynasty`.
  Pre-Maurya lines and the Kanvas point to the existing `magadha-kingdom-epic`.
- Kingdoms (epic_legendary, the Puranic accounts): `puranic-maurya-kingdom` → same_name_as `maurya-empire`;
  `puranic-shunga-kingdom` → `shunga-kingdom`; `puranic-andhra-kingdom` → `satavahana-kingdom`.
  Rulers are `attested: false`; all regnal years are in notes as the texts' claims. No historical_time anywhere.
- Traditions (family hindu, parent vaishnava, with sourcing_note): `jagannath-puri`, `vithoba-pandharpur`.
- Place `pandharpur` (traditional; Gazetteer coordinates 17°41'N 75°26'E).

Verified passages: Wilson VP 4.23 (Barhadrathas, 1000 years) and 4.24 (Pradyota 138 yrs, Shaishunagas 362,
Nandas 100, Mauryas 137, Shungas 112, Kanvas 45, Andhrabhrityas 30 kings/456 yrs, 24 named) via a
sacred-texts mirror; Pargiter pp. 67-72; Imperial Gazetteer 19:390-391 (Pandharpur) and 20:409-411 (Puri).

## Disagreements recorded

- Barhadrathas: VP 21 kings after Sahadeva / 1000 yrs; Pargiter text 16 kings / 723 yrs and 32 kings / 1000 yrs.
- Shishunagas: 360 (Bd, Bh) vs 362 (Va, Vs); Pargiter argues the Matsya's original was 163.
- Nandas: VP 100 yrs together; Mt/Va 88 for Mahapadma + 12 for sons. First son Sukalpa vs Sumalya.
- Mauryas: 10 kings (VP, Mt) vs 9 (Va, Bd); names after Ashoka differ entirely.
- Pushyamitra: 36 yrs (Mt) vs 60 (Va, Bd). Kanvas: 45 vs 345 in older lists (Wilson's note).
- Andhras: 30 kings/456 yrs (VP, Va, Bh) vs 460 (Mt, Pargiter); VP names only 24. Founder Shipraka / Simuka / Sishuka / Sindhuka.

## Dropped / not done

- W. W. Hunter, _Orissa_ (1872): not read; not cited. Gazetteer used instead.
- Bombay Gazetteer vol. 20 (1884) on Pandharpur: referred to by the Imperial Gazetteer; not read.
- Dynasty records carry one `variant` field only, so each dynasty uses the VP variant; Pargiter's readings
  are given in summaries/notes with references. No per-king entities created (avoided clashes with history agent).
- No `content/relationships/puranic-*` file was needed.

## Unresolved cross-agent references (expected)

`maurya-empire`, `shunga-kingdom`, `satavahana-kingdom` (same_name_as), `chandragupta-maurya`, `bindusara`,
`ashoka` (rulers). The history agent's records should add the reverse `same_name_as` links.

## Open questions for the lead

- `puri.traditions` should gain `jagannath-puri` (not my file).
- Proposed SOURCES.md row: | pargiter-dynasties-kali-age | F. E. Pargiter, The Purana Text of the Dynasties of the Kali Age (OUP, London 1913) | translation | public domain (pub. 1913; d. 1927); verified from scan title page | locator: page |
