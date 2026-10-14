# hindu-pilgrimage agent, Phase 2 notes

## Added

- **Networks (6):** `char-dham`, `chota-char-dham`, `jyotirlingas`, `shakti-peethas`, `sapta-puri`, `river-tirthas`.
- **List variants (9, `pilgrimage-*`):** four dhams; four maths of Sankaracharya (Gazetteer); Chota Char Dham; jyotirlingas per Wilson (Nandi Upapurana); jyotirlingas per Gazetteer entries; Shakti 108 (Devi Bhagavata 7.30); Shakti per Gazetteer (Tantras, Ujjain only); sapta puri per Gazetteer descriptions; river tirthas per Gazetteer.
- **New places (20):** badrinath, puri, kedarnath, gangotri, yamunotri, somnath (verified, historical evidence only), srisailam, mandhata-omkareshwar, deoghar-baidyanath, bhimashankar, gokarna, haridwar, kanchipuram, sringeri, gaya, pushkar, amarkantak, godavari, narmada, kaveri.
- **Existing places, `pilgrimage_networks` only:** kashi, ayodhya, mathura, ujjain, dwarka, rameswaram, prayagraj, hastinapura, chitrakoot, kishkindha, vrindavan, ganga, yamuna, sarasvati-river.
- **New sources (2):** `dutt-garuda-purana`, `wilson-religious-sects-1861`.
- `validate:content`: no issues in my files (the 8 remaining issues are other agents' avatars/mohini slugs).

## Source discipline: what the lists rest on

All Imperial Gazetteer entries were read in the archive.org OCR text of the 1907-09 volumes; volume:page locators come from the volume-25 index and printed running headers. Volume 25 index: `dli.ernet.17064`.

| List                                           | Public-domain source found for the list itself?                                                                                   | How it is recorded                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Char Dham (4 dhams)                            | No.                                                                                                                               | Network and variant state it is the present-day reckoning, not scriptural; each of the four is entered on its own Gazetteer article.                                                                                                                                                                              |
| Four maths of Sankaracharya                    | **Yes**, Gazetteer Dwarka article (11:387): Dwarka, Sringeri, Jagannath, Badrinath.                                               | Separate variant in the Char Dham network (it has Sringeri, not Rameswaram).                                                                                                                                                                                                                                      |
| Chota Char Dham                                | No.                                                                                                                               | As Char Dham.                                                                                                                                                                                                                                                                                                     |
| Twelve jyotirlingas                            | **Yes**, Wilson 1861 pp. 223-224 (list from the Kedara Kalpa of the Nandi Upapurana, his identifications). Not the modern list.   | Variant `...wilson-nandi-upapurana`. Items placed: Somanatha, Mallikarjuna, Mahakala, Omkara, Vaidyanatha, Ramesa, Visvesvara (editor's bracket), Kedaresa. Left out because Wilson himself cannot locate them: Amareshvara (placed at or near Ujjain, not a separate place), Bhimasankara, Tryambaka, Gautamesa. |
| Jyotirlingas (Gazetteer)                       | Partial: four Gazetteer entries say "one of the twelve" (Mandhata 17:152, Deogarh 11:244, Bhimashankar 8:108, Gokarn 12:307).     | Variant `...gazetteer-entries`. Gokarna is not in Wilson's list.                                                                                                                                                                                                                                                  |
| Shakti 108                                     | **Yes**, Devi Bhagavata 7.30, verses 53-102 (read in Vijnanananda's translation, mirror of sacred-texts.com at neonvagabond.xyz). | Variant `pilgrimage-shakti-devi-bhagavata-108`.                                                                                                                                                                                                                                                                   |
| Shakti 51 (Pithanirnaya, Tantracudamani, etc.) | No PD English source.                                                                                                             | **Left out entirely.**                                                                                                                                                                                                                                                                                            |
| Sapta Puri                                     | No usable translation (see dropped claims). Gazetteer says Ujjain and Conjeeveram are "one of the seven sacred cities".           | Network records the usual seven as a grouping, entry by entry on the Gazetteer; Dutt's Garuda Purana ch. 81 is cited for each city as sacred, not as a list.                                                                                                                                                      |
| River tirthas                                  | No scriptural list.                                                                                                               | Variant built from Gazetteer river articles.                                                                                                                                                                                                                                                                      |

## Dropped or not entered

- **Garuda Purana (Saroddhara) 16.114-115 names the seven cities** (Ayodhya, Mathura, Maya, Kashi, Kanchi, Avantika, Dvaravati). I read it in the Wood and Subrahmanyam translation (Sacred Books of the Hindus vol. 9, 1911), but Ernest Wood died in 1965, so it fails the UK/EU PD rule and was **not cited**. If the lead is satisfied that PD in the US suffices, or finds a PD translation, the sapta-puri variant can be strengthened. (The translators gloss Maya as Gaya; the Gazetteer's Abul Fazl remark supports Maya = Haridwar.)
- Shakti 108 seats not entered because the text's name could not be matched safely: Kedara, Mahakala (Ujjain), Puri/Purushottama (Vimala; the Gazetteer's Puri article does not use that name), Karavira, Kanyakubja, Vindhya, Mayapuri, Naimisha, Sthaneshvara, Kalanjara, Kashmir and many others.
- Bakreswar (Gazetteer 6, "pithasthan where the forehead of Sakti fell") and Phaljor/Sylhet (Sati's leg and neck, vol. 23) are not entered as places.
- **Trimbak, Parli (Vaidyanath), Ellora (Ghrishneshwar), Aundh (Nageshvara):** Gazetteer entries read for Trimbak and Parli say only "place of pilgrimage"; none says "jyotirlinga", so none is tagged. Trimbak appears via the Godavari article.
- No Hindi/Devanagari names were taken from a source; they are standard forms (several attested in Dutt/Wilson spellings), please spot check.

## Disagreements recorded

- **Wilson vs. Gazetteer on Bhimashankar:** Wilson's "Bhimasankara in Dakini" is probably Bhimeswara at Draksharam (his words); the Gazetteer calls the Khed hill temple one of the twelve.
- **Vaidyanatha:** Wilson and the Gazetteer say Deogarh; the Gazetteer also notes a Baijnath temple at Parli (20:5-6).
- **Omkara:** Wilson says the textual Omkara was placed in Ujjain by some, but is probably the Narmada island shrine at Mandhata.
- **Char Dham vs. four maths:** south is Rameswaram in one, Sringeri in the other.
- **Wilson p. 39** calls Dwaraka "on the Malabar Coast" (sic, Gujarat coast); not repeated.

## Uncertain readings

- Amarkantak temple builder: the OCR reads "Kama Deo Chedi (1040-70)"; probably Karna. Stated in the record as "Kama or Karna".
- Gangotri temple date: OCR "eighteenth century" is doubtful for a Gurkha commander; the date was omitted.
- Gazetteer locators from the index: Jumna 14:232-233, Puri 20:408-412, Rameswaram 21:173-175, Ganges 12:132-136 (sanctity text on 134-135), Narbada 18:375-377 (inferred from headers), Saraswati 22:97, Ujjain Town 24:113-114 (headers 112 and 114).
- Dutt's Garuda Purana: chapter 81 and pp. 209-212 are Dutt's own numbering (OCR header garbled "CHAPTER Lkkitl", placed between LXXX and LXXXII).
- Coordinates: modern positions to 2 decimals; Gazetteer lat/long agree to within a few minutes. Sringeri's Gazetteer longitude (75 deg 19') is about 4 minutes east of today's town; present-day position used. Rivers use a single point at the source, as the Ganga record uses its confluence.

## Proposed SOURCES.md rows

Primary texts (translations) table:

| Slug                 | Edition                                                  | Translator (life)              | Locator convention                       | Licence       | Status                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------- | ------------------------------ | ---------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dutt-garuda-purana` | _The Garuda Puranam_ (prose translation), Calcutta, 1908 | Manmatha Nath Dutt (1855-1912) | chapter (Dutt's numbering); page in note | public_domain | Verified from scan (preface dated 12 June 1908; [archive.org](https://archive.org/details/in.ernet.dli.2015.33648)); publisher not confirmed. Do NOT confuse with Wood and Subrahmanyam's _Garuda Purana_ (Saroddhara), 1911, not PD in UK/EU |

Scholarship table:

| Slug                          | Work                                                                                                                                                                             | Author (life)                                           | Locator         | Licence       | Status                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `wilson-religious-sects-1861` | "Sketch of the Religious Sects of the Hindus", in _Select Works of H. H. Wilson_ vol. 1, ed. R. Rost, London: Trübner, 1861 (essay first in _Asiatic Researches_ 16-17, 1828-32) | H. H. Wilson (1786-1860); ed. Reinhold Rost (1822-1896) | page (1861 ed.) | public_domain | Verified from scan ([archive.org bub_gb_dD9n-vePuh0C](https://archive.org/details/bub_gb_dD9n-vePuh0C)). Item 9 of the twelve-linga list is a bracketed editor's insertion in this edition |

Also useful for the lead: the Gazetteer scan sets used (all archive.org): `imperialgazettee05grea`, `06greauoft`, `07grea`, `08greauoft`, `09greauoft`, `10grea`, `12grea`, `13greauoft`, `15greauoft`, `17greauoft`, `20greauoft`, `22greauoft`, `23greauoft`, `imperialgazettee015643mbp` (vol. 21), `the-imperial-gazetteer-of-india-volume-11` and `-18`, `rbanms.800.imperialgazettee0000henr` (vol. 24), `in.ernet.dli.2015.213195` (vol. 14).

## Open questions

- Is a US-only PD translation acceptable for the Saroddhara seven-cities verse? (Would let sapta-puri cite its list directly.)
- Is a PD English source for the 51-pitha lists wanted (e.g. Sircar's _Sakta Pithas_, 1948, is in copyright)? A PD route could be Wilson's or Monier-Williams's passing mentions; none was found.
- The modern jyotirlinga list (Nageshvara, Ghrishneshvara, Parli) has no PD English source found; the Shiva Purana translation (Kotirudra Samhita) is in copyright. Consider adding when a source is found.
- Cross-agent references: none unresolved. I did not touch the buddhist-jain agent's files; Gaya and Bodh Gaya need coordination (my `gaya` record is the Hindu pilgrimage town; Bodh Gaya is separate).
