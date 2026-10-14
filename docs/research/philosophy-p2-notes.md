# Philosophy agent, Phase 2 notes

## Added

- 16 concepts in `content/concepts/`: dharma, karma, samsara, moksha, atman, brahman, maya, avidya, guna,
  yoga, bhakti, jnana, purusha-and-prakriti, ahimsa, tapas, ishvara. 77 interpretations in total, each with its own
  references. Disagreements are stated inside the interpretations, not in the summaries.
- 4 traditions: `advaita-vedanta` and `vishishtadvaita` (parent `vedanta`), `yoga` and `dharmashastra`
  (parent `hindu`), all family `hindu`.
- 2 texts: `brahma-sutras`, `yoga-sutras`.
- 3 sources (rows below): Thibaut with Shankara (SBE 34 and 38), Thibaut with Ramanuja (SBE 48), Woods's Yoga-System of Patanjali.
- `pnpm --filter @kala/schema validate:content` passes ("Content is valid").

## How the passages were read

sacred-texts.com returned 403 and web.archive.org was blocked, so every passage was read in Internet Archive
full-text scans: `upanishads01mluoft` (SBE 1), `p2upanishads00mluoft` (SBE 15), `bhagavadgtwithsa00tela` (Telang),
`bub_gb_NNLyzf70cl8C` (Colebrooke 1837), `lawsofmanu00manuuoft` (Bühler), `vedntasutrastr01bdar` (SBE 34),
`vedntasutrastr02bdar` (SBE 38), `vedntasutrastr03bdar` (SBE 48), `yogasystemofpata00wooduoft` (Woods).
The title pages match the editions in `content/sources`.

## Proposed SOURCES.md rows

| Slug                              | Edition                                                                                                     | Creator                          | Locator convention                      | Licence       | Verification                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `thibaut-vedanta-sutras-shankara` | _The Vedanta-Sutras with the commentary by Sankaracarya_, SBE vols 34 and 38, Oxford: Clarendon, 1890, 1896 | George Thibaut (1848-1914)       | adhyaya.pada.sutra, with the SBE volume | public_domain | Title pages read in the Internet Archive scans. Death date from Wikipedia. Library-catalogue check outstanding. |
| `thibaut-vedanta-sutras-ramanuja` | _The Vedanta-Sutras with the commentary of Ramanuja_, SBE vol. 48, Oxford: Clarendon, 1904                  | George Thibaut                   | adhyaya.pada.sutra, with page numbers   | public_domain | As above.                                                                                                       |
| `woods-yoga-system-patanjali`     | _The Yoga-System of Patanjali_, Harvard Oriental Series vol. 17, Harvard University Press, 1914             | James Haughton Woods (1864-1935) | Yoga-sutra book.sutra                   | public_domain | Title page read. Dates from whowaswho-indology.info. Library-catalogue check outstanding.                       |

Also proposed: new text rows `brahma-sutras` and `yoga-sutras`; traditions `advaita-vedanta`, `vishishtadvaita`, `yoga`, `dharmashastra`.

## Claims and passages not used

- **Vivekananda's _Raja Yoga_ (1896)**: not added. The Yoga school rests on Woods only.
- **Shankara and "the Lord gives the fruits of works" (Brahma Sutra 3.2.38-41)**: not found by reading, so not claimed.
- **Ramanuja on yoga and on karma beyond 1.1.1**: the passages found (Mundaka commentary) could not be tied to a sutra number, so Ramanuja has no yoga interpretation and is cited only at 1.1.1.
- **Upanishadic ahimsa**: not located in Müller's text, so ahimsa has no Upanishadic interpretation.
- **Samkhya on avidya, dharma, ishvara**: the Karika text read does not discuss these, so no Samkhya interpretation was written for them. In particular nothing is said about God in Samkhya.
- **Brihadaranyaka 1.4.10 ("I am Brahman")** and **Gita 2.47, 4.33-38**: not located cleanly in the OCR; replaced by passages that were.
- **Gita 4.5 and 16.1-3** were not read; not used.

## Locator caveats for the lead

- **Telang prints no verse numbers.** Gita locators use the standard chapter.verse numbering; the passage content was checked in Telang's text, whose page headers give chapter and verse for each page. Telang renders _dharma_ as "piety", and _yoga_ as "devotion" or "abstraction", which is stated in the notes on the references.
- **Colebrooke's karikas**: the scan is a Google-OCR copy that is garbled in places. Karika numbers were read from the Roman numerals; 17-19 were checked against the commentary on plurality of souls. Karika 18's own verse text was not cleanly legible, only the commentary arguing for plurality.
- **Brahma Sutra 1.1.20-22, SBE 34 pp. 79-80**: the page headers show sutra 22; the commentary read is on the "person within the eye" sutras, so the range is given rather than one number.
- **Ramanuja 1.1.1**: cited by page because the commentary on the first sutra runs for about 250 pages.
- **Brihadaranyaka 4.4.3-5**: the caterpillar and goldsmith similes and the "as he acts" passage; numbering follows Müller's printed verse numbers within the Brahmana.
- **Chandogya 2.23.1**: Müller renders the term as "the law"; whether he glosses it as _dharma_ was not checked in his notes, so the explanation says "in Müller's rendering".

## Disagreements recorded (inside the concepts)

- **Atman and Brahman**: identical for Advaita (the Self is Brahman, "that art thou"); Vishishtadvaita keeps souls real, as manifestations of Brahman and parts of its body; Samkhya has many separate selves (karika 18).
- **Maya**: for Shankara, a causal potentiality of nescience resting on the Lord and neither real nor unreal; for Ramanuja, a word for what produces wonderful effects, applied to prakriti, with no ignorance in the Lord.
- **Prakriti**: Samkhya treats it as independent of purusha; Shankara refuses an independent pradhana; Ramanuja makes matter part of Brahman's body.
- **Moksha**: knowledge of Brahman (Advaita); devotion-meditation by the Self's choice (Vishishtadvaita); isolation of the Seer (Yoga); separation of purusha from nature (Samkhya).
- **Avidya**: root of all appearance (Shankara); linked to works (Ramanuja, via the Vishnu Purana quotation).
- Manu 12.12-14: Bühler's notes show the medieval commentators disagreeing on what "Kshetrajna", "Bhutatman" and "Jiva" refer to.

## Other-religion sentences

A neutral line was added to the summaries of dharma, karma, samsara, moksha, atman, avidya, yoga, ahimsa and tapas saying that
Buddhist and Jain traditions also use or discuss the idea, with meanings of their own that this page does not cover. No Buddhist or Jain meaning is stated. The wording of these lines may need review once Phase 4 sources arrive.

## Cross-references and open questions

- No unresolved cross-agent slugs: concepts link only to other concepts.
- Entity records `dharma`, `brahman`, `purusha`, `prakriti` (deities agent) share names with concepts; the site may want to link the entity to the concept.
- Quote of an Upanishad text number: Müller's SBE 1 opening pages carry the bracketed number [3] in the scan, an artefact of the binding; the title page confirms vol. I.
- A later pass could add Samkhya-Yoga and Nyaya/Vaisheshika concepts, and Vivekananda's reading labelled as such, if the owner wants a modern-reinterpretation layer.
