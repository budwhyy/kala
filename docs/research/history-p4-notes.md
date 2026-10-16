# History agent: Phase 4 notes

## What I added

- **Periods (6):** `harappan-civilisation` (archaeological culture), `vedic-period` (textual, low
  confidence), `mahajanapada-period`, `maurya-period`, `post-maurya-period`, `gupta-period`.
- **Places (12, all terrestrial with historical_time):** harappa, mohenjo-daro, lothal, dholavira
  (Harappan); taxila, pataliputra, kaushambi (`debated`: Kosam vs Gurgi), dhauli, kalsi, maski
  (Ashokan edicts), paithan (Pratishthana), purushapura (Peshawar). Reused existing girnar, lumbini
  (Rummindei), sarnath, sanchi, mathura, prayagraj, kalinga, gandhara-mahajanapada,
  magadha-mahajanapada.
- **Kingdoms (5):** `maurya-empire`, `shunga-kingdom`, `satavahana-kingdom`, `kushan-empire`,
  `gupta-empire`, with historical_time, capitals, rulers (attested flag), evidence_sites (no extents)
  and `succession` relations (Magadha → Maurya → Shunga). `same_name_as` points to
  `puranic-maurya-kingdom`, `puranic-shunga-kingdom`, `puranic-andhra-kingdom`, which already point
  back, so the link is two-way.
- **Entities (6):** chandragupta-maurya, bindusara, ashoka, chandragupta-i, samudragupta,
  chandragupta-ii. Four parent links in `content/relationships/history-rulers.yaml`.
- **Sources (6 new):** hultzsch-inscriptions-asoka, fleet-gupta-inscriptions,
  smith-early-history-1914, marshall-guide-taxila-1918 (cited_only), marshall-mohenjo-daro-1931
  (cited_only), unesco-world-heritage-centre (cited_only).
- Generator: scratchpad `gen/gen.py`. The YAML in `content/` is the source of truth.

## How I read the sources

- Hultzsch 1925: archive.org OCR, with pages taken from the printed running heads. The key pages
  are ix (Girnar), xi (Kalsi), xiii (Dhauli), xviii–xx (Allahabad-Kosam pillar), xxi
  (Sanchi/Sarnath), xxii (Rummindei), xxv–xxvi (Maski), xxix–xxx (Maski names Asoka; Pataliputra is
  the capital), xxxii–xxxvi (chronology).
- Smith 1914 3rd edition: archive.org OCR, running heads. The Gupta table is on p. 327 and the
  Kushan table on pp. 277–278.
- Imperial Gazetteer: archive.org volumes 11, 13, 14, 15, 19, 20. Pages come from the running heads
  (Dhauli 11:317–318; Harappa 13:41; Kalsi 14:320; Kosam 15:407; Paithan 19:318; Patna 20:66–68).
- Marshall 1931 vol. 1 (pp. 1, 11, 104, 110–111) and Marshall 1918 (pp. 3–6, 11).
- UNESCO pages: list/1645, list/138 and tentativelists/5918. WebFetch was blocked, so I read them
  with curl.
- Macdonell 1900 (Gutenberg 41563) pp. 8, 11, 12 for the Vedic dates.

## Dropped or not done

- **Kalibangan, Rakhigarhi:** I found no readable source. The ASI's *Indian Archaeology – A Review*
  scans have unusable OCR, and the UNESCO pages for these sites could not be found.
- **Rulers kept as names, not entities:** Kanishka and Pushyamitra are named in their kingdom's
  `rulers` list instead of having entity records. The validator rejects entities with no
  relationships, and I found no sourced relationship for them.
- **Fleet CII 3:** the OCR is poor. I cite only the Allahabad pillar inscription (No. 1, p. 7). The
  Gupta findspots (Udayagiri, Sanchi, Mathura, Bhitari, Mehrauli) rest on Smith's table instead.
  Udayagiri, Bharhut, Nanaghat, Eran and Mehrauli have no place records, so they are not evidence
  sites yet.
- **Shunga kingdom:** it has no evidence sites, because Bharhut has no place record.
- **Kalinga war:** it is mentioned in summaries only. The only Kalinga kingdom record is
  `kalinga-kingdom-epic`, which is legendary, and Kharavela's Kalinga has no record.
- **Ashoka and Buddhist slugs:** I added no relationship from Ashoka to the Buddhist agent's
  slugs. The edicts attest his visits to Lumbini and Bodh Gaya (Sambodhi), and these are recorded as
  evidence sites and in the summary. None of the existing relationship types fits patronage.
- **Taxila under Ashoka:** his viceroyalty comes from tradition reported by Marshall, not from an
  inscription. The records say so.

## Disagreements

- **Maurya dates:** Hultzsch's working dates are Chandragupta 320, Bindusara 296 and Ashoka's
  coronation 264. Smith gives 322, about 273 for Ashoka's accession and 269 for his coronation.
  Reign lengths differ between the Puranas, the Ceylon chronicles and Burmese tradition.
- **Kanishka:** Smith gives AD 78. Fleet and others of the time gave 58 BC. Confidence is low.
- **Satavahana start:** the Puranas put it after the Kanvas. Smith puts it about 240–230 BC.
- **Harappan dating:** Marshall's 3250–2750 BC was provisional. The UNESCO dates are used instead.
  Marshall argued the Indus civilisation was pre-Vedic, but this remains debated. No Harappan site
  is linked to any Vedic or Puranic place.
- **Kaushambi:** the 1908 Gazetteer reports a proposed site at Gurgi, in place of Kosam.

## Proposed SOURCES.md rows

| slug | work | licence |
|---|---|---|
| hultzsch-inscriptions-asoka | Hultzsch, CII I, Inscriptions of Asoka, 1925 | public_domain (author d. 1927, to check) |
| fleet-gupta-inscriptions | Fleet, CII III, Inscriptions of the Early Gupta Kings, 1888 | public_domain |
| smith-early-history-1914 | V. A. Smith, Early History of India, 3rd ed., 1914 | public_domain (d. 1920) |
| marshall-guide-taxila-1918 | Marshall, A Guide to Taxila, 1918 | cited_only (d. 1958) |
| marshall-mohenjo-daro-1931 | Marshall (ed.), Mohenjo-daro and the Indus Civilization, 1931 | cited_only |
| unesco-world-heritage-centre | UNESCO WHC site pages (Dholavira, Mohenjo-daro, Lothal) | cited_only |

## Open questions

- **Traditions for Gupta kings:** they are set to `hindu`, based on the Brahmanical setting such as
  Samudragupta's horse sacrifice. The lead may prefer otherwise.
- **Death years:** the death years of Hultzsch, Fleet and Marshall are from general knowledge and
  still need checking against a catalogue.
- **Coordinates:** Taxila, Patna, Peshawar and Maski use the standard locations of the present-day
  sites, because the sources read give none.
