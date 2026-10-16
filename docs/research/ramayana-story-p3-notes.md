# Ramayana story agent: Phase 3 notes

## Where passages were read

- **Griffith Ramayana** (`griffith-ramayana`): Project Gutenberg #24869 (full text), split by canto; locators `book.canto` from Griffith's canto headings. Footnotes were read in the same file. Griffith skips some cantos (e.g. Book VI cantos 76-92) and gives Book VII only as a prose summary in his appendix ("Uttarakánda").
- **Dutt Ramayana** (`dutt-ramayana`): archive.org `dli.ministry.05560` (Yuddha Kandam, Calcutta 1893) and `TheRamayanaUttaraKandam` (Uttara Kandam, 1894). Dutt calls his units "sections"; cited as `kanda.section`. Section numbers were read from OCR headings, which are garbled; they were fixed by counting the sequence of headings between clearly legible ones (e.g. Yuddha "C" back to "XCI"; Uttara LIII-LIX, LXXIX, CVI, CX). Dutt's Uttara numbering runs about ten ahead of the Bombay vulgate in this part (Sita's banishment 7.52-7.59).
- **Growse, Ramayana of Tulsi Das** (new source `growse-ramayana-tulsi-das`): archive.org DLI item 2015.43864, the one-volume revised edition (Allahabad, 1883).
- **Macdonell, History of Sanskrit Literature** (new source `macdonell-history-sanskrit-literature`): Gutenberg #41563 for the text, archive.org `historyofsanskri00macdrich` (New York: Appleton, 1900) for the page (304).
- **Imperial Gazetteer**: archive.org OCR of vol. 21 (`the-imperial-gazetteer-of-india-volume-21`) and vol. 24 (`dli.ministry.14487`). DSAL did not respond.
- **Cunningham 1871**: archive.org `cu31924023029485` (pp. 516-517, 544).
- Present-day coordinates for Singraur, Nandigram (Bharatkund), Mahendragiri (Odisha) and Adam's Bridge were taken from the Wikipedia/GeoNames positions of those present-day sites (2 decimals). No coordinates were estimated from the story.

## What I added

- `content/texts/valmiki-ramayana.yaml`: `sections` only, the seven kandas (`bala-kanda` ... `uttara-kanda`).
- New text `ramcharitmanas` (Awadhi `awa`, kavya, vaishnava; composition 1575-1624, period, medium, from Growse's introduction p. xii and the poem's own date at 1.42), with seven `-kand` sections.
- Sources: `growse-ramayana-tulsi-das`, `macdonell-history-sanskrit-literature`.
- Variants: `ramcharitmanas-account` (the name the task gave) and `ramayana-story-valmiki-uttara-kanda` (Uttara-only claims; cites Macdonell p. 304, Griffith's appendix, Dutt 7.110).
- **35 Valmiki events** (`ramayana-*`), variant `valmiki-ramayana-account` for Books I-VI and the Uttara variant for the three Book VII events; **3 Ramcharitmanas events** (`ramcharitmanas-*`) linked both ways with `same_story_as` to `ramayana-abduction-of-sita`, `ramayana-ordeal-by-fire` and `ramayana-birth-of-lava-and-kusha`.
- **narrative_order.position convention**: book offset + canto (Bala 0, Ayodhya 100, Aranya 300, Kishkindha 400, Sundara 500, Yuddha 600, Uttara 800 + Dutt section). Bala events therefore use the bare canto number, which keeps the gods agent's `samudra-manthana-ramayana` (position 45, Book I canto 45) in the right place. Ramcharitmanas events use book x 1000 + Growse doha.
- **7 places**: `shringaverapura` (traditional, point; Griffith's note "Now Sungroor, in the Allahabad district"), `nandigrama` (traditional, point; Griffith's note "Now Nundgaon, in Oudh"), `dandakaranya` (debated, no geometry), `rishyamukha` (debated, no geometry), `pampa` (debated, no geometry), `mahendra-mountain` (debated; one candidate with a point), `setu-ramayana` (debated; Adam's Bridge candidate with a point, from IG 21:178). No place is `verified`; none is cosmological.
- **Kingdoms**: `kishkindha-kingdom-epic` (capital kishkindha; rulers vali, sugriva, angada, all `attested: false`; war with Lanka) and `lanka-kingdom-epic` (capital lanka-ramayana; rulers ravana, vibhishana). `kosala-kingdom-epic`: added `relations` only (marriage with Videha, alliance with Kishkindha, war with Lanka).
- **Route** `rama-exile-route-valmiki`: 15 stops Ayodhya → Shringaverapura → Prayag (Bharadvaja) → Chitrakuta → Dandaka → Panchavati → Pampa → Rishyamukha → Kishkindha → Mahendra → Setu → Lanka → Prayag (halt at Bharadvaja's on the flight home, 6.126) → Nandigrama → Ayodhya. Places seen only from the air in 6.125 are mentioned in a note, not added as stops. The summary says it is a literary reconstruction and that Sita travels only to Panchavati and back from Lanka.

## Claims dropped or not done

- **Indrajit's death**: Griffith omits Book VI cantos 76-92, so the event rests on Dutt 6.91 alone.
- **Parashurama's challenge (1.74-1.76)**, **Bharadvaja's hermitage** as a separate event, **the recitation by Lava and Kusha** as a separate event: dropped to keep the list near 35 (the recitation is folded into `ramayana-sita-returns-to-the-earth`; Bharadvaja is a route stop).
- **Rama's departure from the earth (Uttara, Sarayu)**: read only in Griffith's appendix summary (quoting Muir); not entered.
- **Kubera as earlier ruler of Lanka**: Uttara-only (Griffith appendix); rulers have no variant field, so left out.
- **Hanuman's leap route** (`hanuman-leap-route`): not created; the text gives only Mahendra → Lanka → back.
- **Ramcharitmanas route**: not created. I could not confirm from the Growse OCR a different sequence of places that have records (a reported visit to Valmiki's hermitage in Tulsidas's Ayodhya book could not be confirmed in the OCR and has no place record).
- **Wilson VP 4.5 "Setubandha or Rameswara"** (cited by the rameswaram record) was not reread, so it is not cited for the setu.
- **Excavations at Shringaverapura** and any Bhadrachalam/Bastar identifications of Dandaka: no source we hold documents them.
- Valmiki's Rishyamukha and Pampa: no source names a specific hill or lake, so no geometry, although tradition at Hampi names a Pampa Sarovar.

## Disagreements between versions and sources

- **The illusory Sita**: in the Ramcharitmanas (Growse 3.19) Rama has Sita enter fire before the golden deer, leaving an image; at the ordeal (6.105-106) only the shadow and the disgrace burn. In Valmiki the real Sita is carried off and passes through the fire (6.117-120).
- **Lava and Kusha**: in Valmiki's Uttara Kanda (Dutt 7.79) they are born at Valmiki's hermitage after Sita is sent away; in the Ramcharitmanas (Growse 7.25) they are born in Ayodhya and there is no exile.
- **Book VII (and Book I)**: Macdonell (p. 304), following Jacobi, calls Book VII undoubtedly a later addition and Book I also later; Griffith calls Book VII an appendix but notes that Indian tradition ascribes it to Valmiki. Only Book VII is tagged with a separate variant; the Book I events carry a scholar note citing Macdonell. Open question: should Book I events also get a "later layer" variant?
- **Mahendra**: Griffith's own notes disagree (4.41 note 704: hills of Orissa/Ganjam; 4.59 note 773: part of the Ghats of the peninsula). Cunningham (516-517) identifies the Mahendra of Kalinga with the Ganjam hills. The text sets the Ramayana's Mahendra on the southern shore opposite Lanka.
- **Ordeal witness**: Narada's summary (1.1) says the Wind-God appears, whereas 6.120 has the god of fire bring Sita out. The event follows 6.117-120.
- **Imperial Gazetteer page numbers** come from OCR running heads: the Ramnad Estate passage on Adam's Bridge is on the page after the head "RAMNAD ESTATE 177", printed as "173" by the OCR and read as 178.

## Proposed SOURCES.md rows (for the lead to merge)

| Slug                                    | Work                                                                                                                                                     | Author (life)               | Locator                                   | Licence       | Status                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `growse-ramayana-tulsi-das`             | _The Ramayana of Tulsi Das_, translated from the original Hindi, revised and illustrated ed., Allahabad: N.-W. Provinces and Oudh Government Press, 1883 | F. S. Growse (1836–1893)    | book.doha (Growse's printed doha numbers) | public_domain | Title page read on archive.org (DLI 2015.43864)                                     |
| `macdonell-history-sanskrit-literature` | _A History of Sanskrit Literature_, New York: D. Appleton, 1900                                                                                          | A. A. Macdonell (1854–1930) | page                                      | public_domain | Scan read on archive.org (`historyofsanskri00macdrich`); text also Gutenberg #41563 |

Also for the lead: `dutt-ramayana`'s licence note says "edition details to check". The Yuddha (1893) and Uttara (1894) volumes are on archive.org (`dli.ministry.05560`, `TheRamayanaUttaraKandam`), Calcutta; Dutt numbers by "section".

## Cross-agent references

- All `ramayana-people` slugs used (sita, lakshmana, bharata, shatrughna, dasharatha, kausalya, kaikeyi, sumitra, vishvamitra, tataka, ahalya, janaka, urmila, mandavi, shrutakirti, kushadhvaja, guha, jatayu, shurpanakha, maricha, subahu, khara, dushana, ravana, shabari, hanuman, sugriva, vali, tara-vanara, angada, sampati, jambavan, vibhishana, nala-vanara, vanaras, kumbhakarna, indrajit, mandodari, lava, kusha, valmiki) resolved at validation time.
- Validation: no issues in my files. The remaining issues are all in `battlefields/kurukshetra-war` (Mahabharata slugs not yet created). The scholarship test will fail for the two new sources until the SOURCES.md rows above are merged.
