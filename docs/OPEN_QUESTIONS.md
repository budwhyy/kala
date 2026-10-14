# Open questions

Unresolved scholarly disagreements and brief ambiguities. Items here are **not** stored as fact in `content/`.

Format: `ID — question — context — conservative reading adopted for now — status`.

## Brief / product

- **OQ-001 — Node version.** Brief §0 says Node 20 LTS; Node 20 is end-of-life. Adopted Node 22 LTS (see DECISIONS.md). Status: resolved.
- **OQ-002 — Database host.** Brief §3.1 allows Supabase or Neon. The schema and migrations run on either; tests use PGlite. A host is needed only when the site reads from a live database. Status: open (owner to choose).
- **OQ-003 — ORM.** Drizzle chosen (see DECISIONS.md). Status: resolved.
- **OQ-004 — Phase 1 site data source.** The brief's stack puts Postgres behind the site, and also asks for a static-first deploy. Phase 1 content is small enough to build pages from the validated YAML at build time, with Postgres used for search. To decide in step 5 once page needs are concrete. Status: open.
- **OQ-005 — "≥1 relationship" for every entity.** Brief §4.4 applies this to every Entity. Some Phase 1 stubs (e.g. dynasty founders with only a lineage link) satisfy it via `descendant_of`. Applied as written; revisit if it forces weak edges into the data. Status: applied as written.
- **OQ-006 — Tradition family for Vedic material.** Calling Vedic religion "Hindu" is anachronistic in much scholarship. Modelled as its own `vedic` family; Puranic/sectarian traditions are `hindu`. Status: conservative reading adopted.
- **OQ-007 — `verified` places.** Brief principle 9 defines four classes. Adopted the stricter reading that `verified` needs archaeological or historical evidence, not textual or traditional alone. Status: conservative reading adopted.

## Sources

- **OQ-008 — No PD translation of several Puranas.** No public-domain English translation of the Shiva, Linga, Vayu, Brahmanda or Padma Puranas was found. Shaiva and some genealogical material will rest on other PD texts until a licensed translation is arranged. Status: open.
- **OQ-009 — Ganguli/Roy attribution.** Early volumes of the 1883–96 Mahabharata were issued under P. C. Roy's name. Credit both. Status: adopted.
- **OQ-010 — Unconfirmed bibliographic details.** SOURCES.md marks which editions are verified online and which are "to check". Each must be confirmed before first use in content. Status: open.

## Stage 4 content (details in docs/research/*-notes.md)

- **OQ-011 — No "member of a group" relationship type.** Vasus, Rudras and the seven-rishi lists cannot be linked to their members; the lists live only in variant descriptions, and `vasus`/`rudras` were left out. Option: add a `member_of` type (not in brief §4.1). Status: open — owner decision. Update: owner approved `member_of`; `vasus`, `rudras`, `dharma`, `sthanu` and ten named Vasus added with memberships (MBh 1.66 / VP 1.15 list variants), Adityas and Nagas memberships, and three seven-rishi memberships under the Vishnu Purana Vaivasvata list. Named Rudras and other seven-rishi lists still pending — see docs/research/groups-gazetteer-notes.md.
- **OQ-012 — Hiranyagarbha = Brahma.** The `identified_with` link cites Vishnu Purana 1.2, but the name appears in Wilson's annotation rather than the translated text. Kept and flagged; drop if no primary passage is found. Status: open.
- **OQ-013 — Ganesha and Kartikeya births.** Only a passing Devi Bhagavata mention (Ganesha) and the Mahabharata Vana Parva account (Kartikeya) are entered. Fuller accounts need a PD Shiva/Brahmavaivarta Purana (see OQ-008) or Griffith Ramayana 1.37–38, which could not be fetched. Status: open.
- **OQ-014 — Sources for "traditional" place identifications.** Vrindavan, Chitrakoot, Kishkindha (Hampi), Panchavati, Mount Kailash, Rameswaram and Indraprastha have modern coordinates but no allowed source for the identification itself. Proposed: add the Imperial Gazetteer of India (1907–09, PD). Status: open. Update: `imperial-gazetteer-1909` added (verified PD); Gazetteer evidence (volume:page) added to all seven places. No confidence class changed. Ayodhya, Dwarka, Kurukshetra, Mithila, Lanka and the rivers not yet checked.
- **OQ-015 — OCR-derived locators.** Raychaudhuri 1923 page numbers and Devi Mahatmya verse numbers (Markandeya Purana 81.43, 81.66) were read from OCR and some inferred from page sequence. Check against page images. Status: open.
- **OQ-016 — Father of the Ashvins.** Vishnu Purana 3.2 says the Sun; Mahabharata 1.66 says Savitri. Only the Vishnu Purana claim is entered (under its variant) because Savitri has no record yet. Status: open.
- **OQ-017 — Manu's cycle.** Manu does not state manvantaras per kalpa ("numberless"); the field is now optional and left empty for that model. The Vishnu Purana's "71 mahayugas with some additional years" is recorded as 71 with the remainder in `sandhi_note`. Status: resolved for now.
- **OQ-018 — Where texts were read.** sacred-texts.com blocks automated access. Agents read the same editions on Project Gutenberg (Ganguli #15474, Griffith Ramayana #24869), archive.org scans, the Wayback Machine and wisdomlib.org (Wilson reprint). Locators follow each edition's own numbering. Status: noted.

## Stage 6

- **OQ-019 — Brief §8 graph-test pairs need Phase 3 content.** Krishna ↔ Arjuna and Shakuni ↔ Duryodhana are not in Phase 1 content. The trace gate runs on 12 Phase 1 pairs (incl. Kashyapa ↔ Garuda, Rama ↔ Manu); add the epic pairs when Phase 3 content lands. Status: open.
- **OQ-020 — Genealogy 3D page performance.** Lighthouse mobile ~58 because the 3D constellation needs three.js (not a gated page; entity and cosmic pages pass). Options for Phase 2: load the 3D scene only after first interaction, or show the list view first on small screens. Status: open.
- **OQ-021 — Real-device testing.** Gate 6 was measured with Lighthouse's mobile profile, not a physical mid-range Android. Recommended before a public launch. Status: open.

## Phase 2 (details in docs/research/*-p2-notes.md)

- **OQ-022 — Hindi wording needs native review.** The least certain choices are listed in `docs/research/i18n-notes.md`: "Figure" (पात्र), "Account" (वृत्तांत), the relationship headings and verbs, "indigenous" (आदिवासी/स्वदेशी), the cosmic notice and the BCE/CE form. Status: open — ask a Hindi reader.
- **OQ-023 — Content stays English on the Hindi site.** Summaries, explanations and citations are English; names appear in Devanagari. Translating content would need a reviewed process (every claim is sourced). Status: deferred to Phase 4 (expanded languages).
- **OQ-024 — Hindi map labels.** Devanagari place names will draw on the map only if the basemap's glyph server supports Devanagari for its font stack; unchecked. Status: open.
- **OQ-025 — Dashavatara with Balarama in place of Buddha.** No public-domain source was found for a ten-form list that swaps Balarama for Buddha; Dutt's Harivamsha footnote gives a ten-form list with Buddha, but it is the translator's gloss and is not stored. The Avatars page shows exactly what the four sourced lists contain. Status: open.
- **OQ-026 — Shaiva manifestations.** Without a public-domain Shiva Purana, Bhairava has no record and Ardhanarishvara rests on a passage that does not use the name (Mahabharata 13.14; Ganguli's note says Hara-Gauri). Status: open (see OQ-008).
- **OQ-027 — Which 22 avatars.** Kapila, Vyasa, the Kumaras, Narada, Nara-Narayana, Yajna, Rishabha, Prithu, Hamsa and Hayagriva of Bhagavata 1.3 have no entities yet; they appear only in list descriptions. Rishabha must not be conflated with the Jain Tirthankara. Status: open — add in Phase 3/4.
- **OQ-028 — Churning tellings.** Three tellings (Mahabharata, Vishnu Purana, Ramayana) are separate events linked by `same_story_as` and named for their account. Whether to add a fourth (Bhagavata skandha 8) depends on a scan covering it. Mahabharata 1.18's second "Soma" is ambiguous in Ganguli. Status: open.
- **OQ-029 — Translator-gloss links.** A few links rest on translators' footnotes (Agni/Vayu as Vasus, Uchchaihshravas as Indra's mount, Vishnu as Dhanvantari's father in one Harivamsha dialogue). Kept and flagged; drop if a reviewer prefers. Status: open.
- **OQ-030 — Pilgrimage lists without a public-domain list source.** Char Dham, Chota Char Dham, the seven cities and the river tirthas have no public-domain English list; each member rests on its own Gazetteer article. The modern Jyotirlinga list and the 51-pitha lists have no PD English source (the Garuda Purana Saroddhara verse for the seven cities exists only in a 1911 translation whose translator died in 1965). Status: open.
- **OQ-031 — Buddhist and Jain lists.** The Mahaparinibbana Sutta names the four places only as events; the names come from Fa-hien, Xuanzang, the Gazetteer and Cunningham. No public-domain "eight places" (Buddhist) or "five tirthas" (Jain) list found. Kushinagar, Shravasti and Sankasya are `debated`; raise only with newer excavation reports. Ranakpur, Ashtapada and Champa lack sources. Status: open.
- **OQ-032 — Philosophy gaps.** Colebrooke's scan is poor OCR (karika 18's verse text unreadable); Telang prints no verse numbers (standard numbering used); Ramanuja is cited by page within 1.1.1; Samkhya says nothing about God in the text read. Buddhist and Jain views of karma/moksha/atman are deferred to Phase 4. Status: open.
- **OQ-033 — Page numbers from OCR.** Several Gazetteer, Pargiter and Rhys Davids locators were read from OCR running heads or an online transcription; see each notes file. Status: open (same as OQ-015).
- **OQ-034 — Lighthouse (simulated throttling) vs real throttling.** The cosmic page's TBT is high in Lighthouse's simulated mode but not under real CPU throttling; the interactive time passes the 4 s target in both. Genealogy remains the slowest page (OQ-020). Status: open.
