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

- **OQ-011 — No "member of a group" relationship type.** Vasus, Rudras and the seven-rishi lists cannot be linked to their members; the lists live only in variant descriptions, and `vasus`/`rudras` were left out. Option: add a `member_of` type (not in brief §4.1). Status: open — owner decision.
- **OQ-012 — Hiranyagarbha = Brahma.** The `identified_with` link cites Vishnu Purana 1.2, but the name appears in Wilson's annotation rather than the translated text. Kept and flagged; drop if no primary passage is found. Status: open.
- **OQ-013 — Ganesha and Kartikeya births.** Only a passing Devi Bhagavata mention (Ganesha) and the Mahabharata Vana Parva account (Kartikeya) are entered. Fuller accounts need a PD Shiva/Brahmavaivarta Purana (see OQ-008) or Griffith Ramayana 1.37–38, which could not be fetched. Status: open.
- **OQ-014 — Sources for "traditional" place identifications.** Vrindavan, Chitrakoot, Kishkindha (Hampi), Panchavati, Mount Kailash, Rameswaram and Indraprastha have modern coordinates but no allowed source for the identification itself. Proposed: add the Imperial Gazetteer of India (1907–09, PD). Status: open.
- **OQ-015 — OCR-derived locators.** Raychaudhuri 1923 page numbers and Devi Mahatmya verse numbers (Markandeya Purana 81.43, 81.66) were read from OCR and some inferred from page sequence. Check against page images. Status: open.
- **OQ-016 — Father of the Ashvins.** Vishnu Purana 3.2 says the Sun; Mahabharata 1.66 says Savitri. Only the Vishnu Purana claim is entered (under its variant) because Savitri has no record yet. Status: open.
- **OQ-017 — Manu's cycle.** Manu does not state manvantaras per kalpa ("numberless"); the field is now optional and left empty for that model. The Vishnu Purana's "71 mahayugas with some additional years" is recorded as 71 with the remainder in `sandhi_note`. Status: resolved for now.
- **OQ-018 — Where texts were read.** sacred-texts.com blocks automated access. Agents read the same editions on Project Gutenberg (Ganguli #15474, Griffith Ramayana #24869), archive.org scans, the Wayback Machine and wisdomlib.org (Wilson reprint). Locators follow each edition's own numbering. Status: noted.
