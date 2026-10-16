# Buddhist agent — Phase 4 notes

All passages were read in archive.org full-text scans (sacred-texts, buddhadust and wisdomlib were
blocked or unreachable): Rhys Davids _Buddhist Birth Stories_ (cu31924074561196), Cowell
_Buddha-karita_ SBE 49 (buddhistmahy01cowe), Cowell _Jataka_ vols 3 and 4 (in.ernet.dli.2015.18000,
dli.ernet.18111), Rhys Davids _Buddhist Suttas_ SBE 11 (buddhistsuttas00davi), _Vinaya Texts_ III
SBE 20 (vinayatexts0020unse), Imperial Gazetteer vol. 14 (in.ernet.dli.2015.34987), Legge's Fa-hien
(Gutenberg 64535).

## Added

- Sources (4): `cowell-jataka`, `rhys-davids-buddhist-birth-stories`, `cowell-buddhacarita-sbe49`,
  `oldenberg-rhys-davids-vinaya-sbe20`.
- Texts (4): `nidanakatha` (3 epoch sections), `buddhacarita` (sections mark the 1830 supplement),
  `jataka`, `vinaya-pitaka`.
- Traditions (2): `theravada`, `mahayana` (family buddhist, parent buddhist).
- Variants (5): `buddhist-nidanakatha-account`, `-buddhacarita-account`, `-jataka-account`,
  `-vinaya-account`, `-mahaparinibbana-account`.
- Entities (10): `siddhartha-gautama` (historical_time -623 to -400, period, low confidence, from Rhys
  Davids' discussion only), `suddhodana`, `maya-buddhist`, `yashodhara`, `rahula`, `ananda`,
  `shariputra`, `maudgalyayana`, `devadatta`, `mahaprajapati-gautami`.
- Places (3): `kapilavastu` (debated: Piprahwa / Tilaurakot, per Imperial Gazetteer 14:406-407),
  cosmological `buddhist-tusita-heaven`, `buddhist-tavatimsa-heaven`.
- Events (18), all with narrative_order: Nidanakatha 10-90 (Tusita, birth, four sights, Rahula's
  birth, Great Renunciation, awakening, first teaching, Sariputta/Moggallana, Rahula's ordination);
  Buddhacarita 10-40 (birth, sights, departure, defeat of Mara) linked `same_story_as` to the
  Nidanakatha events; Vinaya 10-20 (Mahaprajapati's ordination, Devadatta); Mahaparinibbana 10
  (passing at Kusinara); Jataka 316 (Sasa) and 461 (Dasaratha), position = Jataka number.
- Relationships: `content/relationships/buddhist-family-and-disciples.yaml` (12).

## Dropped / not done

- `vajrayana`: no public-domain source read that describes it. Not created.
- Buddhacarita Books XIV-XVII: Cowell says Amritananda wrote them in 1830. Not used. The awakening and
  first sermon come from the Nidanakatha only.
- Hindu identification of the Buddha with `buddha-avatar`: no passage read for it, so no
  `identified_with` link was made.
- Mara, Sakka, Channa, Kanthaka, Assaji, Kondanya: these are named in the summaries only, with no entities.

## Disagreements

- Rahula's birth: in the Buddhacarita (2.46) it comes before the sights; in the Nidanakatha (p. 79)
  the news arrives on the day of the departure. The Nidanakatha (p. 82) also records a third view
  (seven days old).
- Maya's death: the Nidanakatha says she died seven days after the birth and was reborn in Tusita.
  The Buddhacarita (2.18) says she went to heaven because she could not bear the joy.
- Four sights: the Nidanakatha places them on four separate days but notes that the Digha reciters
  say one day. In the Buddhacarita the mendicant appears during meditation (Book V).
- Buddha's dates: Rhys Davids gives 543 BCE from the Ceylon chronicles, rejects 485 BCE, and proposes
  c. 420-400 BCE for the death. The range is stored with low confidence.
- Dasaratha Jataka: here Sita is Rama's sister, the exile is to the Himalaya, and there is no abduction.

## Unresolved cross-references (for the lead)

- `same_story_as` from `buddhist-dasaratha-jataka` to `ramayana-departure-into-exile` and
  `ramayana-bharata-and-the-sandals` needs a back-link in those files, which I do not own. I removed it
  so that validation passes. Please add both directions.

## Proposed SOURCES.md rows

| slug | work | edition | licence |
|---|---|---|---|
| cowell-jataka | Jataka | Cowell (ed.), Cambridge UP 1895-1907 | PD |
| rhys-davids-buddhist-birth-stories | Nidanakatha | Rhys Davids, Trubner 1880 | PD |
| cowell-buddhacarita-sbe49 | Buddhacarita | Cowell, SBE 49, Clarendon 1894 | PD |
| oldenberg-rhys-davids-vinaya-sbe20 | Vinaya (Cullavagga IV-XII) | SBE 20, Clarendon 1885 | PD |

## Open questions

- Translator death years (Francis, Chalmers, Rouse) and the 1880/1885 imprint years are from general
  knowledge or the catalogue. They have not been checked on a title page.
- Texts claimed by `theravada` (nidanakatha, jataka, vinaya) are Pali-canon works. Please confirm that
  this tagging is wanted.
- The `buddhist` tradition file still says that content arrives in Phase 4. Its owner may want to
  update it.
