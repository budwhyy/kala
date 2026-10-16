# Kurukshetra agent, Phase 3 notes

## What I added

- `content/battlefields/kurukshetra-war.yaml`: the eighteen days of the war as the Mahabharata
  tells it. `place: kurukshetra`, `text: mahabharata`, `literary: true`. It has two sides
  (`pandava-army`, `kaurava-army`) with leaders and kingdoms, and 18 days. Each day has a section
  range, a summary, commanders for both sides, the arrays (vyuhas) only where Ganguli names them,
  2 to 6 encounters, the fallen (only people on the agreed slug list) and its own references.
  Totals: 24 formations, 78 encounters and 19 fallen.
- `content/variants/kurukshetra-ganguli-account.yaml`: an account variant (tradition `itihasa`,
  text `mahabharata`). No existing Mahabharata variant fitted: `mahabharata-adi-parva` covers the
  Adi Parva genealogies.

## How the passages were read

- I read the archive.org full text of Ganguli, item
  `the-mahabharata-of-krishna-dwaipayana-vyasa-complete-18-volumes-kisari-mohan-ganguli_202008`,
  and split it by Ganguli's printed "Section N" headings for Udyoga, Bhishma, Drona, Karna and
  Shalya, plus Sauptika 8 and 9.
- I checked the numbering against Wayback copies of the sacred-texts pages (`/hin/m05/` to
  `/hin/m09/`). In the Drona Parva the sacred-texts file names are offset from the section numbers
  (for example `m07047.htm` is Section XLVIII and `m07142.htm` is Section CXLV). I always used the
  printed section heading, never the file name.
- These locators were confirmed on the sacred-texts pages: 5.7, 5.50, 5.151, 5.156, 5.157, 5.158,
  6.20, 6.48, 6.50, 6.54, 6.59, 6.69, 6.74, 6.75, 6.77, 6.85, 6.88, 6.91, 6.100, 6.107, 6.108,
  6.120, 7.7, 7.27, 7.28, 7.29, 7.44, 7.45, 7.46, 7.47, 7.87, 7.91, 7.136, 7.145, 7.156, 7.161,
  7.178, 7.179, 7.186, 7.190, 7.193, 7.201, 8.11, 8.83, 9.28 and 9.58. The rest were read only in
  the archive.org text, which matched in every case I could check.
- Two sections are missing headings in the archive.org OCR: Drona 7.54/7.55 (merged into 7.53) and
  7.189. I cite none of them.
- Wayback rate-limited about 260 of 688 page fetches, so I did not cross-check every locator.

## Day boundaries used (Ganguli sections)

| Day | Sections                                                      |
| --- | ------------------------------------------------------------- |
| 1   | 6.43–49                                                       |
| 2   | 6.50–55                                                       |
| 3   | 6.56–59                                                       |
| 4   | 6.60–64, night discourse 6.65–68                              |
| 5   | 6.69–74                                                       |
| 6   | 6.75–80                                                       |
| 7   | 6.81–87                                                       |
| 8   | 6.88–97                                                       |
| 9   | 6.98–108                                                      |
| 10  | 6.109–120                                                     |
| 11  | 7.5–16                                                        |
| 12  | 7.17–30                                                       |
| 13  | 7.31–48                                                       |
| 14  | 7.86–185, Arjuna's vow at 7.73, night battle 7.150–185        |
| 15  | 7.186–201 (7.190 calls it "the fifth day" of Drona's command) |
| 16  | 8.10–30                                                       |
| 17  | 8.31–95                                                       |
| 18  | 9.6–61, with Balarama's pilgrimage digression 9.35–54         |

- The night battle after day 14 runs straight into the dawn of day 15 (7.186). Deaths in that
  night (Bahlika, Somadatta, Ghatotkacha) are filed under day 14 with a note.
- The Sauptika night raid (10.8) is mentioned only in the summaries, with the 10.8 and 10.9
  references. It is not a day.

## Gaps: claims dropped or left unnamed

- **Unnamed arrays.** Ganguli does not name these arrays, so I recorded no formation for them:
  - Kaurava, days 1 and 2. Day 1's array is described but not named (6.20).
  - Day 4, both sides. The Pandavas reuse "the array formed on the day before" (6.60). I did not
    assume this was the half-moon.
  - Kaurava, day 8: "resembling the ocean", which is a description, not a name (6.88).
  - Pandava, day 9 (6.100).
  - Day 10, both sides (6.109).
  - Day 13, Pandava side.
  - Day 14, Pandava side.
  - Day 15, both sides.
  - Pandava, day 17 (8.31, 8.46).
  - Day 18, both sides: "a grand array" (9.8).
  - Some later retellings name the day-18 array; I could not confirm a name in Ganguli.
- **Sanskrit names.** For the circular array (7.31–32) Ganguli writes "circular array". I give
  the Sanskrit as चक्र / Cakra with a note. For day 17 Ganguli says "according to the scheme of
  Brihaspati" (8.46); I render it बार्हस्पत्य / Bārhaspatya. Both Sanskrit terms come from my own
  knowledge of the epic's usage, not from a Sanskrit edition I read this session. Please check them
  against a Sanskrit text.
- **Fallen with no slug** (people not on the mahabharata-people list). These are in encounter
  summaries but not in `fallen`:
  - Sweta and Shankha, Virata's sons. Sweta falls to Bhishma on day 1 (6.48); Shankha falls to
    Drona on day 7 (6.83).
  - Shrutayush of Kalinga and his son Shakradeva, slain by Bhima, day 2 (6.54).
  - Dhritarashtra's sons slain by Bhima on days 4, 8 and 18 (6.64, 6.89, 9.26–27).
  - Satyaki's sons, slain by Bhurishravas, day 5 (6.74).
  - Shatanika, Virata's brother, slain by Bhishma, day 10 (6.119).
  - Satyajit, slain by Drona, day 12 (7.21).
  - Vrishaka and Achala, slain by Arjuna, day 12 (7.28).
  - Nila, slain by Ashvatthaman, day 12 (7.29).
  - Lakshmana, Duryodhana's son, and Brihadbala of Kosala, slain by Abhimanyu, day 13 (7.44,
    7.45).
  - Sudakshina of Kamboja and Shrutayudha, slain by Arjuna, day 14 (7.91).
  - Alambusha, slain by Ghatotkacha (7.108), and Alayudha, slain by Ghatotkacha (7.178).
  - Jalasandha, slain by Satyaki (7.114).
  - Drupada's three grandsons, slain by Drona (7.186).
  - Kshemadhurti, slain by Bhima, day 16 (8.12).
  - Vinda and Anuvinda, slain by Satyaki (8.13).
  - Pandya, slain by Ashvatthaman (8.20).
  - Vrishasena, slain by Arjuna (8.85).
  - Uluka, slain by Sahadeva (9.28).
  - Sudarshana, slain by Bhima (9.27).
- **Killers with no slug.** Alambusha killed Iravan (6.91), and the son of Duhshasana struck the
  last blow on Abhimanyu (7.47). Both are recorded with an empty `by` and a note. Possible new
  slugs for the people agent: `alambusha`, `sweta-matsya`, `shankha-matsya`, `vrishasena`,
  `lakshmana-kaurava`, `uluka`, `sudakshina`, `pandya-king`.
- **Bhishma's death** is not on day 10. He falls onto the bed of arrows and waits for the northern
  solstice (6.120). His death in the Anushasana Parva was not read, and it is only alluded to.
- **Duryodhana** is recorded as mortally wounded on day 18 (9.58). He dies after Ashvatthaman's
  report (10.9).

## Disagreements and inconsistencies within the text

- **Magadha on both sides.** In 5.19 Jayatsena of Magadha brings an akshauhini to Yudhishthira,
  and in 5.158 "Sahadeva, the ruler of the Magadhas" commands a Pandava division. Yet in 6.109
  "Jayatsena, the king of the Magadhas" rides in the Kaurava host, and Magadhas stand in Drona's
  and Karna's arrays (7.20, 8.46). I listed the kingdom on both sides with notes.
- **Kekaya on both sides.** Five Kekaya princes join Duryodhana (5.19), while a Kekaya king and
  the "five Kaikeya brothers" fight for the Pandavas (6.69, 6.109).
- **Yadavas on both sides.** Satyaki fights for the Pandavas. Kritavarman, with the Bhojas,
  Andhakas and Kukuras, and Krishna's Narayana army fight for Duryodhana (5.7, 5.19).
- **Vinda and Anuvinda** are princes of Avanti in 5.19 and 6.84, but "Kaikaya princes" in 8.13.
- **Nila of Mahishmati** joins Duryodhana in 5.19. A King Nila fights for the Pandavas and is
  killed by Ashvatthaman in 7.23 and 7.29. The text may mean two different men.
- **Sweta** is called the Pandava "generalissimo" or "commander" in 6.48–49, while Dhrishtadyumna
  is commander-in-chief (5.151, 5.158). I took Dhrishtadyumna as the Pandava commander on every
  day and left Sweta as an encounter.
- **Shankha** is said to attack Shalya after Sweta's death on day 1 (6.49), but he dies to Drona
  on day 7 (6.83). The two passages do not conflict.
- **Choosing the Pandava commander** happens twice. In 5.151 Krishna names Dhrishtadyumna, and in
  5.158 Yudhishthira appoints the seven division leaders with Dhrishtadyumna over all. I cite both.

## Cross-agent references not yet resolved

- **People** (mahabharata-people agent): yudhishthira, bhima, arjuna, nakula, sahadeva,
  dhrishtadyumna, shikhandi, drupada, virata, uttara-prince, abhimanyu, iravan, ghatotkacha,
  satyaki, yuyutsu, duryodhana, duhshasana, vikarna, bhishma, drona, karna, shalya, shakuni,
  jayadratha, kripa, ashwatthama, kritavarma, bhagadatta, bhurishravas, somadatta and bahlika.
  `krishna` and `balarama` already exist.
- **Kingdoms** (mahabharata-story agent): matsya-, chedi-, yadava-, kekaya-, madra-, sindhu-,
  kamboja-, pragjyotisha-, kalinga- and anga-kingdom-epic.
- Validation shows no other issues in my files.

## Proposed SOURCES.md rows

None. Only `ganguli-mahabharata` is cited. Its `licence_note` still says "to check against a
catalogue". The archive.org item above is a full reprint of the 1883–96 text, which may help the
lead check it.

## Open questions

- Should the night after day 14 be its own entry (for example a `14` day with a separate "night"
  marker) if the schema later supports it?
- Should Sanskrit array names be checked against a Sanskrit edition before release (see Gaps)?
