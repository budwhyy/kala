# Buddhist and Jain Phase 2 notes

## Added

- Networks (4): `buddhist-four-great-places`, `buddhist-fa-hien-sacred-places`,
  `jain-tirthankara-nirvana-places`, `jain-mahavira-rainy-season-places`.
- List variants (4): `buddhist-four-places-mahaparinibbana`, `buddhist-places-fa-hien-record`,
  `jain-nirvana-places-kalpa-sutra`, `jain-mahavira-rainy-seasons-kalpa-sutra`.
- Places (15 new): Buddhist - `lumbini`, `bodh-gaya`, `sarnath`, `kushinagar`, `shravasti`,
  `sankasya`, `vaishali`, `nalanda`, `sanchi`; Jain - `pavapuri`, `parasnath`, `girnar`,
  `shatrunjaya`, `mount-abu`, `shravanabelagola`. `girivraja`: only `pilgrimage_networks` added
  (Fa-hien Buddhist list; Kalpa Sutra Jain rainy-season list).
- Texts (2): `mahaparinibbana-sutta`, `kalpa-sutra`.
- Sources (5): see below.

Confidence: verified - lumbini, bodh-gaya, sarnath, vaishali, nalanda, sanchi, girnar, shatrunjaya,
mount-abu, shravanabelagola; debated - kushinagar, shravasti, sankasya; traditional - pavapuri,
parasnath. Verified means the site is historically attested; it never verifies the Buddha's or
Tirthankaras' life events.

## Findings that shaped the records

- The Rhys Davids translation (SBE 11), Mahaparinibbana Sutta 5.16-22, gives the four places only
  as events (birth, enlightenment, first sermon, passing away), without place names, as read in the
  buddhadust.net transcription. The matching with Lumbini, Bodh Gaya, Sarnath, Kushinagar comes
  from Fa-hien, Xuanzang, the Gazetteer and Cunningham. Paragraph numbers 17-20 for the four events
  were read there, not checked against a page scan.
- Fa-hien (Legge ch. 22) also lists four fixed places "in the history of all Buddhas"
  (enlightenment, first sermon, the great discourse, descent from the Trayastrimsa heaven) without
  naming them; this is a second, different list and is not entered as a network.
- Lumbini: Cunningham 1871 (AG 416-417) placed the garden near Nagar/Mokson in India. The 1896
  discovery of the inscribed pillar at Paderia/Rummindei (Gazetteer 14:407) superseded this.
- Kushinagar: Cunningham (1871) and Wilson identify Kasia; the 1908 Gazetteer says the ruins do not
  agree with the Chinese description. Held at `debated` because no later source was read.
- Shravasti: Set-Mahet (Cunningham 409; Hoey excavations) vs. doubts and a suggested site on the
  upper Rapti in Nepal (Gazetteer 22:181; "uncertain", 23:97). `debated`.
- Sankasya/Sankisa: Cunningham's identification "has been doubted" (Gazetteer 22:59-60). `debated`.
- Fa-hien and Xuanzang differ on the staircases at Sankasya (Cunningham 370).
- Beal (2:25) says a wicked dragon broke the Lumbini pillar; the Gazetteer (14:407) says it was
  struck by lightning "as Xuanzang described". Only the damage is stated in the record.
- Gazetteer coordinate for Girnar (70 deg 42' E) is off by about 0.2 degrees; the present-day
  location is used. Other coordinates are Gazetteer values (Bodh Gaya, Sarnath, Sanchi, Sankisa,
  Set-Mahet, Parasnath, Sravana Belgola) or present-day locations (Lumbini, Kasia, Vaishali,
  Nalanda, Pavapuri, Palitana hill, Mount Abu), rounded to two decimals.
- Kalpa Sutra: Mahavira at Papa (sections 122-123, 147), Parshva on Sammeta (168), Arishtanemi on
  Girnar (182), Rishabha on Ashtapada (227). Ashtapada has no place record: no sourced location.

## Dropped / not done

- Ranakpur: no Imperial Gazetteer entry found in the volumes searched; no Burgess/Cousens text
  read. Not added.
- Vasupujya at Champa (a Jain nirvana place): the passage was not found in the OCR of Jacobi;
  Champa not added. Mithila (Kalpa Sutra 122) is an existing Hindu place I may not edit, so it is
  not tagged in the Jain rainy-season network.
- Nalanda is not tagged in the Jain rainy-season network (Kalpa Sutra: "suburbs of Nalanda" with
  Rajagriha) because the identity of that Jain Nalanda with Cunningham's site was not sourced.
- An "eight great places" Buddhist list and a Jain "five tirthas" list: no public-domain source
  found listing them (the Gazetteer calls Shetrunja the most sacred of "five sacred hills" without
  naming the others).
- Burgess/Cousens and Jacobi's SBE 45 (Uttaradhyayana) were not used.
- Xuanzang on Lumbini, Kasia, Sravasti and Vaisali beyond the Beal pages cited was not read in full.

## Page-locator caveats

Imperial Gazetteer pages are taken from the archive.org OCR running heads. Entries that straddle a
page have both pages cited. Inferred (not seen on a page image): Parasnath 19:409, Pawapuri 20:81,
Kasia 15:148, Set Mahet 22:181, Sarnath 22:109, Sanchi 22:27-28, Mount Abu 5:3-4,
Sravana Belgola 23:96-97. Cunningham AG page numbers are from the Cornell scan of the 1871 edition.
The existing source `cunningham-ancient-geography` is still marked "to check against a
catalogue" in its licence note. Cross-agent references: none unresolved from my files; the
four validator issues about `kurma` and `mohini` belong to other agents.

## Proposed docs/SOURCES.md rows

| Slug                          | Edition                                                                        | Licence       | Locator format               | Notes                                                  |
| ----------------------------- | ------------------------------------------------------------------------------ | ------------- | ---------------------------- | ------------------------------------------------------ |
| `rhys-davids-buddhist-suttas` | T. W. Rhys Davids, Buddhist Suttas (SBE 11), Oxford 1881                       | public domain | chapter.paragraph            | transcription read, not a page scan                    |
| `beal-si-yu-ki`               | S. Beal, Si-yu-ki, Buddhist Records of the Western World, 2 vols, Trubner 1884 | public domain | volume:page                  | Internet Archive `si-yu-ki-1884`                       |
| `legge-fa-hien`               | J. Legge, A Record of Buddhistic Kingdoms, Oxford 1886                         | public domain | chapter                      | Gutenberg 64535                                        |
| `jacobi-jaina-sutras-1`       | H. Jacobi, Gaina Sutras part I (SBE 22), Oxford 1884                           | public domain | Kalpa Sutra section and page | scan is a Motilal reprint; pagination assumed original |
| `cunningham-mahabodhi`        | A. Cunningham, Mahabodhi, London 1892                                          | public domain | page                         | Internet Archive `dli.csl.8896`                        |

## Open questions

- Should Kushinagar be raised to `verified` once a later source (Carlleyle, Vogel, ASI reports) is
  read?
- Place for Ashtapada (Jain), Champa, Ranakpur: need sources.
