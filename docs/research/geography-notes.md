# Geography agent notes

## Added

- 32 places (`content/places/`): 25 terrestrial, 7 cosmological (meru, patala, vaikuntha, svarga,
  brahmaloka, kailasa-cosmological, plus kailash-mountain ↔ kailasa-cosmological counterpart link).
  Extra beyond the brief: `girivraja` (Rajgir) and `ahichchhatra`, which are capitals of Magadha and
  Panchala.
- 15 kingdoms: 8 epic (kuru, magadha, gandhara, kosala, panchala, videha, kashi, avanti) and 7
  mahajanapadas linked by `same_name_as`. No extents were drawn.
- 4 legendary dynasties: suryavansha, chandravansha, kuru-dynasty, yadava-dynasty (variant
  `vishnu-purana-account`).
- Generator script used: scratchpad `gen.cjs`; the YAML in `content/` is the source of truth.

## How locators were confirmed

sacred-texts.com returned 403 (Cloudflare) for all requests, so passages were read in full-text
copies of the same editions:

- Wilson Vishnu Purana: a full-text reprint of Wilson's translation, using its book/chapter division
  (chapter headings checked for 2.2, 2.3, 2.5, 2.7, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 4.10, 4.11, 4.19,
  4.20, 5.6, 5.22, 5.23). Some claims rest on Wilson's notes to a chapter; those references say so.
- Ganguli Mahabharata: Project Gutenberg #15474 (vol. 1: Adi, Sabha, Vana), sections counted per
  parva.
- Griffith Ramayana: Project Gutenberg #24869, book.canto from the canto headings.
- Cunningham 1871: archive.org `cu31924023029485` (Cornell scan of 1871 ed.); locator = printed page.
- Raychaudhuri 1923: archive.org `politicalhistory00raycuoft` (1923 1st ed.); locator = printed page.
  Pages were read from the OCR running heads. Some heads were mis-OCRed (e.g. "66" for 56), so pages
  were worked out from the sequence.
- Lal 1955: archive.org `dli.calcutta.02620` (Ancient India 10-11). p. 23 = dated summary of
  Periods I-V. p. 2 = editorial Notes warning that the dig has no bearing on whether the epic is
  true.

## Confidence decisions

- Verified: hastinapura (Lal), mathura, kashi, ujjain, prayagraj, girivraja, ahichchhatra
  (pilgrim records and site descriptions via Cunningham/Raychaudhuri), and the regions gandhara,
  magadha, avanti. A region's marker is placed at its recorded capital, and the summary says so.
- Ayodhya is kept `traditional`: Cunningham identifies it through Saketa, but Raychaudhuri notes that
  Ayodhya and Saketa may have been two different cities.
- Debated: mithila, kishkindha, lanka-ramayana (no geometry; separate from modern Sri Lanka),
  panchavati, kalinga, sarasvati-river.
- Rivers: ganga and yamuna use a point at the Triveni Sangam. No LineString was drawn.

## Claims dropped or weakly sourced (no allowed source documents them)

- Modern identifications that rest only on living tradition. The coordinates are those of the
  well-known present-day sites, but no source in `content/sources` documents the identification:
  vrindavan, chitrakoot (Kamadgiri), rameswaram (except Wilson's passing "Setubandha or
  Rameswara"), kishkindha = Hampi, panchavati = Nashik / Bhadrachalam, Mount Kailash in Tibet,
  Indraprastha = Purana Qila. Raychaudhuri only says "near modern Delhi".
- Lanka: scholarly proposals placing it outside Sri Lanka (e.g. in central India) were left out
  because none is in our sources.
- Sarasvati: the "invisible third river at Prayag" tradition and modern palaeochannel (Ghaggar-Hakra)
  arguments were left out because they are unsourced.
- Cunningham's dates for the epic war (about 1426 BCE) and for Ahichhatra (1430 BCE) were not used.
  They are dates for myth.
- Videha as a historical polity was left out. Raychaudhuri places the Videhans in the Vajji
  confederacy, not in the list of sixteen.
- Mahajanapada dates use one coarse bracket (-600 to -500, low confidence) from Raychaudhuri pp.
  45-46. He gives no start date.

## Disagreements between sources

- Capital of Gandhara: Pushkalavati (Cunningham p. 49) vs Takshasila (Raychaudhuri p. 76).
- Kalinga capital: Rajahmundry vs Srikakulam (both Cunningham p. 516).
- Ayodhya vs Saketa: same city or two (Raychaudhuri p. 49).

## Open validation issues (slugs owned by other agents)

Unknown entities still to be created by the deities agent: ikshvaku, chandra, pururavas, kuru, yadu,
rama, brahma, shiva, vishnu.

## Sources wished for

An open gazetteer, such as the Imperial Gazetteer of India (1908-31, public domain), to cite modern
coordinates and local traditions for the Ramayana sites. A public-domain Bhagavata text, for
Vaikuntha and Vrindavan.
