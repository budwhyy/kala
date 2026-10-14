# Hindi UI: notes for native review

Scope: `apps/web/messages/hi/core.json` (shell, cards, Cosmic / Genealogy / Geography modes, opening).
`phase2.json` is owned by the lead and not covered here.

Content from `content/` (summaries, explanations, source passages, citations) is **not** translated.
Every Hindi page ends with a notice (`notice.contentEnglish`) saying so; names show in Devanagari
where the record has one.

## Wording I am least sure of (please review)

| Key                                                    | Hindi                                                           | Why unsure                                                                                                                                                                             |
| ------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.entities`                                       | पात्र                                                           | English "Figure" covers gods, sages, kings and principles. "पात्र" (character) may read as fictional; alternatives: व्यक्तित्व, विभूति.                                                |
| `types.variants` / `enums.variantKind.account`         | वृत्तांत                                                        | "Account" = one text's telling of a story. वृत्तांत is clear but formal; आख्यान or "कथा-परंपरा" might be closer.                                                                       |
| `enums.variantKind.creation_pathway`                   | सृष्टि-मार्ग                                                    | Literal. Could be "सृष्टि-कथा".                                                                                                                                                        |
| `enums.variantKind.cosmic_model`                       | ब्रह्मांडीय प्रतिरूप                                            | Technical; check against how teachers say "model of the cycle".                                                                                                                        |
| `confidence.mythical.label`                            | ब्रह्मांडीय लोक                                                 | English "Cosmological". Chosen "लोक" (realm) because the point is these are not places on Earth.                                                                                       |
| `confidence.traditional.label`                         | परंपरा से पहचाना गया                                            | "Traditionally identified".                                                                                                                                                            |
| `time.cosmicHeading`                                   | परंपरागत (ब्रह्मांडीय) कालगणना                                  | "Traditional (cosmic) chronology".                                                                                                                                                     |
| `time.historicalDetail`                                | ({precision}, {confidence} विश्वसनीयता)                         | Reads "(century, high reliability)"; confidence terms are `enums.timeConfidence` (उच्च / मध्यम / निम्न).                                                                               |
| `cosmic.notice`                                        | यह परंपरागत कालगणना है, ऐतिहासिक तिथि-निर्धारण नहीं…            | Key principle-4 notice; please confirm tone and that "ई.पू./ई." is the form you want (vs. ईसा पूर्व / ईस्वी).                                                                          |
| `cosmic.*Ring`                                         | भीतरी / मध्य / बाहरी वलय                                        | "वलय" for ring; "चक्र" is an alternative.                                                                                                                                              |
| `cosmic.twilightsValue`, `enums.yugaShort`             | प्रातः संध्या / सायं संध्या                                     | Technical term for sandhya / sandhyamsha; the source model may prefer "संध्या" and "संध्यांश".                                                                                         |
| `cosmic.lengthValue`                                   | {years} दिव्य वर्ष                                              | Fine as a term; number grouping follows the Hindi locale (Indian grouping, e.g. 12,00,000).                                                                                            |
| `verbs.*`                                              | e.g. "{from}, {to} के माता/पिता हैं"                            | Relationship sentences are full templates (word order differs in Hindi). `parent` uses "माता/पिता" because the data does not say which; `sibling` is "सहोदर" (gender-neutral, formal). |
| `relations.parent` (out/in)                            | संतान / माता-पिता                                               | Headings on entity cards.                                                                                                                                                              |
| `relations.curse`, `relations.blessing`                | जिन्हें शाप मिला / जिनसे शाप मिला …                             | Long but unambiguous; shorter heading options: शापित / शापदाता.                                                                                                                        |
| `relations.avatar_of`, `manifestation_of`, `aspect_of` | इनका अवतार / इनका प्राकट्य / इनका अंश-रूप                       | Distinction between प्राकट्य and अंश-रूप is the part most worth a scholar's eye.                                                                                                       |
| `relations.vahana_of`                                  | इनका वाहन / वाहन                                                |                                                                                                                                                                                        |
| `enums.mode.*`                                         | जैविक, मानस-जन्म, दिव्य जन्म, विधिक, दत्तक, पालक                | Parenthood "mode" labels.                                                                                                                                                              |
| `enums.genre.buddhist_canon` / `jain_canon`            | बौद्ध त्रिपिटक/धर्मग्रंथ, जैन आगम/धर्मग्रंथ                     | Generic "canon"; "त्रिपिटक" is Pali-specific, so the slash gives a broader reading.                                                                                                    |
| `enums.family.indigenous`                              | आदिवासी/स्वदेशी                                                 | Sensitive; please choose the preferred term.                                                                                                                                           |
| `enums.networkKind.*`                                  | चार धाम, ज्योतिर्लिंग, शक्तिपीठ, … तीर्थ-परिपथ, तीर्थयात्रा-जाल | "Circuit" and "network" used as परिपथ and जाल.                                                                                                                                         |
| `variantPanel.*`, `kingdom.sameName*`                  |                                                                 | Longer explanatory sentences; please check register.                                                                                                                                   |
| `search.intro`                                         | विशेषक चिह्न (डायक्रिटिक) ज़रूरी नहीं                           | "Diacritics optional".                                                                                                                                                                 |
| `meta.description`                                     | भारतीय पुराण-कथाओं… मानचित्रावली (एटलस)                         | "Atlas" rendered as मानचित्रावली with the English word in brackets.                                                                                                                    |
| `opening.line1-4`                                      | राज्यों से पहले। वीरों से पहले। … अस्तित्व क्या था?             | Poetic; check rhythm.                                                                                                                                                                  |
| `common.scholarly`                                     | विद्वानों के लिए विस्तृत विवरण                                  |                                                                                                                                                                                        |
| `lang`                                                 | हिन्दी                                                          | Written with the traditional conjunct (न् + द); some style guides prefer "हिंदी".                                                                                                      |

## Technical notes

- Enum-like values from content (entity kinds, place kinds, genres, licences, confidence classes, network
  kinds, yugas…) have keys under `enums.<group>.<value>`. If a value has no key the UI falls back to the raw
  value with underscores replaced (`enumLabel` in `lib/i18n-helpers.ts`). New enum values in the schema need
  a message in both languages.
- Message tags: the relationship sentences use ICU tags (`<from></from>`, `<to></to>`, `<m>…</m>`) so that
  names can be links and the verb can be styled while Hindi reorders the words.
- Map labels in Hindi use Devanagari names. They render only if the basemap's glyph server provides
  Devanagari for the "Noto Sans Regular" fontstack; this was not verified offline.
- Letter-spacing is reset under `:lang(hi)` in `app/globals.css` (wide tracking breaks Devanagari conjuncts).
  The KĀLA wordmark carries `lang="en"` so it keeps its tracking.
