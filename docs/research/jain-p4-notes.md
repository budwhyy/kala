# Jain Phase 4 notes

## Added

- Source (1): `jaini-tattvartha-sutra-1920` (J. L. Jaini, Sacred Books of the Jainas 2, Arrah 1920).
  The archive.org OCR is unusable (read as Devanagari); every locator was checked on page images.
- Texts (2): `acaranga-sutra`, `tattvartha-sutra`. (`kalpa-sutra` existed; its `sections` were not edited.)
- Traditions (2): `svetambara`, `digambara` (family jain, parent `jain`).
- Variants (4): `jain-tirthankaras-kalpa-sutra` (list), `jain-embryo-transfer-svetambara` (account),
  `jain-mahavira-family-acaranga` (genealogy), `jain-cosmology-tattvartha` (cosmic_model).
- Entities (38): group `tirthankaras`; the 24 Tirthankaras (`rishabhanatha` ... `mahavira`);
  family: `siddhartha-jain-king`, `trishala`, `devananda`, `nandivardhana`, `sudarshana-jain`,
  `suparshva-mahavira-uncle`, `yashoda-jain`, `priyadarshana`, `sheshavati`, `ashvasena`, `vama`,
  `nabhi-kulakara`, `marudevi`.
- Relationships (41): `content/relationships/jain-tirthankaras-and-families.yaml` (24 ordered
  `member_of`, 17 family links).
- Events (14), narrative_order = Kalpa Sutra section: Mahavira (conception/embryo transfer, birth,
  renunciation, kevala, nirvana), Parshva (birth, renunciation, kevala, nirvana), Arishtanemi
  (nirvana), Rishabha (birth, renunciation, kevala, nirvana).
- Cosmological places (9, mythical, no geometry): `jain-seven-earths`, `jain-madhya-loka`,
  `jain-jambudvipa`, `jain-lavana-samudra`, `jain-dhataki-khanda`, `jain-meru`,
  `jain-bharata-kshetra`, `jain-videha-kshetra`, `jain-airavata-kshetra`. Kept separate from the
  Puranic `meru`; no cross-links.

## Svetambara / Digambara differences (sourced)

- Embryo transfer (Devananda to Trishala): Svetambaras uphold, Digambaras reject (Jacobi, SBE 22,
  Introduction p. xxxi n. 2). Stored as `mode: other` mother under the Svetambara variant.
- Author of the Tattvartha Sutra: Umasvami (Digambara) / Umasvati (Svetambara) (Jaini p. viii).
- Both hold 24 Tirthankaras (Jacobi p. xxxv).

## Dropped / not confirmed

- Digambara account that Mahavira never married: no PD source read states it. Marriage (Yashoda)
  is stored only under the Acaranga (Svetambara) variant.
- Mahavira `historical_time`: no scholarly date read; Jacobi's argument for historicity is in the
  summary only.
- Birth/kevala/renunciation places (Kundagrama, Jrimbhikagrama, Vinita, Purimatala, Ashtapada):
  no sourced locations, so no place records; Parshva's Benares tagged to existing `kashi`.
- Upper world (heavens, Tattvartha ch. IV), Pushkara-vara etc.: not entered.
- Kalpa Sutra §112 (p. 257) and §120 (p. 263) pages inferred from OCR running heads.
- Hindu Rishabha (Bhagavata) is not linked to `rishabhanatha`; no `identified_with` was added.

## Proposed SOURCES.md row

| Slug | Edition | Licence | Locator | Notes |
| --- | --- | --- | --- | --- |
| `jaini-tattvartha-sutra-1920` | J. L. Jaini, Tattvarthadhigama Sutra (SBJ 2), Arrah 1920 | public domain (Jaini d. 1927) | Chapter III, sutra N, p. N | IA in.ernet.dli.2015.344459; read from page images |

## Open questions

- Jacobi SBE 45 (Uttaradhyayana 36) for loka/aloka could extend the cosmology.
- Validator: 10 remaining issues all belong to buddhist / history / puranic agents.
