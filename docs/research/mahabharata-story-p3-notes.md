# Mahabharata-story agent, Phase 3 notes

## How passages were read

- **Ganguli's Mahabharata**: sacred-texts `mahatxt.zip` (Wayback copy, `web.archive.org/web/2023id_/…/hin/maha/mahatxt.zip`),
  all 18 parvas, split by the section numbers Ganguli prints (SECTION CXL = 1.140; from the Karna Parva on, arabic numerals).
  Printing quirks met: Adi has no CLXXVII; the Adi svayamvara sections are printed CLXL…CLXLIX (= 190…199); Sabha has no LXVII;
  Virata prints SECTION XXII twice (Kichaka dies in the first); Stri has no 13; Anushasana prints CLXVIII twice (Bhishma's death is
  in the last one). Locators follow the printed numbers.
- **Wilson's Vishnu Purana**: sacred-texts `vp.txt.gz` (Wayback copy), Book 5 chapters, with Wilson's footnotes.
- **Dutt's Harivamsha**: Project Gutenberg 61937, Harivamsha Parva. Dutt's chapter numerals have misprints: ch. 63 is printed
  "LVIII", ch. 68-69 "LXIII/LXIV", there is no XCI (so from XCII the printed number is one ahead of the running count),
  ch. 116 is printed "CXVVI", ch. 117 "CXIVII". Locators use the printed number (as `avatars-*` records do), with a note on misprints.
- **Imperial Gazetteer 1907-09**: archive.org OCR and djvu XML, page numbers taken from the printed page in the XML:
  vol. 6 (`in.ernet.dli.2015.149886`), vol. 12 (Gobardhan, p. 280), vol. 14 (`in.ernet.dli.2015.34987`), vol. 16
  (`the-imperial-gazetteer-of-india-vol-16`). Vol. 7 (`in.ernet.dli.2015.34988`) was searched for Barnawa: no article.
- **Cunningham 1871**, **Raychaudhuri 1923**, **Lal 1955**: archive.org full text (editions as in `content/sources`); printed pages.

## What was added

- `content/texts/mahabharata.yaml` — `sections` only: the 18 parvas (`adi-parva` … `svargarohanika-parva`).
- **Variants (3)**: `mahabharata-story-ganguli-account`, `mahabharata-story-harivamsha-krishna`, `mahabharata-story-vishnu-purana-krishna`.
- **Events (53)**:
  - 40 Mahabharata events `mahabharata-*`, narrative-ordered (position = parva × 1000 + Ganguli section): birth of Vyasa;
    Shantanu and Ganga; Bhishma's vow; the Kashi princesses; births of Dhritarashtra/Pandu/Vidura; marriages of Dhritarashtra and
    Pandu; birth of Karna; births of the Kauravas and the Pandavas; the tournament; Drona defeats Drupada; house of lac; Bhima and
    Hidimba; Baka at Ekachakra; Draupadi's svayamvara; Indraprastha; Arjuna and Subhadra; Jarasandha; Rajasuya and Shishupala; the
    dice game; the exile (Kamyaka/Dvaitavana); Prabhasa meeting; the yaksha; the year at Virata's court; the cattle raid; Uttara and
    Abhimanyu; Krishna chosen by Arjuna; Krishna's peace mission; Karna learns his birth; Amba's vow; the Bhagavad Gita; the war (one
    summary event pointing to `kurukshetra-war`); the night raid; the women's lament; Bhishma's teaching and death; the horse
    sacrifice; the retirement to the forest; the Yadava destruction; the great departure; the ascent to heaven.
  - 13 Krishna events, one per account, linked by `same_story_as`: birth, move to Vrindavana, Govardhana, Kamsa, Dwaraka and Rukmini
    (`krishna-*-harivamsha` / `krishna-*-vishnu-purana`), and `krishna-death-vishnu-purana` ↔ `mahabharata-destruction-of-the-yadavas`.
    Slug prefix `krishna-` (not `mahabharata-`) because they are Harivamsha / Vishnu Purana events; no other agent owns this prefix.
- **Places (10)**: `kampilya`, `viratanagara`, `govardhana` (traditional, with Gazetteer coordinates); `varanavata`, `ekachakra`,
  `kamyaka-forest`, `dvaitavana`, `upaplavya`, `gokula`, `kundina` (debated). **Prabhasa**: I reused the existing `somnath` record,
  which already carries the names Prabhasa / Prabhas Pattan and says the identification is traditional, instead of a duplicate.
- **Kingdoms (10, all epic_legendary, rulers not attested)**: `matsya-`, `madra-`, `chedi-`, `anga-`, `yadava-`, `sindhu-`,
  `pragjyotisha-`, `kamboja-`, `kekaya-`, `kalinga-kingdom-epic`, each with sourced `relations`. Edited `relations` only on
  `kuru-kingdom-epic` (marriages with Kashi, Gandhara, Panchala; war with Panchala and Magadha; alliances with Panchala, Kashi,
  Magadha under Jayatsena).
- **Routes (5)**: `pandavas-early-wanderings`, `pandavas-exile-route`, `pandavas-final-journey`, `krishna-life-route` (Vishnu
  Purana) and `krishna-life-route-harivamsha` (separate, because the two accounts differ). All `literary_reconstruction: true`.

## Claims dropped or kept out

- Coronation of Yudhishthira (Shanti 12.40-41): 12.40 is Krishna's Charvaka story; the coronation rites are in 12.41 but I did not
  read enough to summarise them. Not added.
- Burning of the Khandava forest (1.225-1.236): not read in detail; no event.
- Jarasandha's imprisoned kings freed by Krishna: not confirmed in the sections read; left out of the event.
- Dhritarashtra's boons to Draupadi after the dice game: not read; left out. "Yudhishthira stakes his kingdom" left out (2.60
  stakes wealth; I did not find the kingdom stake explicitly).
- Where Kunti meets Karna (5.144): place not found in the passage; no place given.
- Bhishma's location during the teaching: the event uses `kurukshetra` because he lies where he fell on the battlefield (6.120);
  12.54 itself does not name the place.
- Gokul village coordinates, Barnawa, Kundapur, Kamyaka and Dvaitavana: no citable coordinates in the sources held, so no points.
- Gomanta (Harivamsha chs. 95-101) and the "sea of red waters" (17.1): named in the text but not mapped (no place record).
- Champa as capital of Anga and Sakala as capital of Madra: named in the text (3.306; 2.31) but no place records made.
- Ekachakra identifications with sites in Bihar/Bengal are not in the sources held; only Weber (via Raychaudhuri) is cited.

## Disagreements between versions (recorded, not resolved)

- **Harivamsha vs Vishnu Purana** (Krishna): why the cowherds move to Vrindavana (Krishna's wolves vs omens; Wilson's note to VP 5.6
  says the wolves are found only in the Harivamsha); the birth night (VP: crossing of the Yamuna sheltered by Shesha; HV ch. 59 does
  not describe the crossing and moves Balarama's embryo to Rohini); how Kamsa dies; Rukmini carried off from the temple of Indrani
  (HV) or on the eve of the wedding (VP); HV adds the Gomanta journey. Each is a separate event with `same_story_as`.
- **Mausala Parva vs Vishnu Purana 5.37** on the Yadava destruction: two events.
- **Amba**: Adi 1.102 says she had chosen "the king of Saubha"; Udyoga 5.175 says "the ruler of the Salvas" (the same king).
- **Karna's birth**: told briefly in Adi 1.111 and at length in Vana 3.306 (basket floating to Champa).
- **Kekaya princes**: Ganguli 5.19 sends the five Kekaya brothers to Duryodhana; 5.57 has them with the Pandavas. Flag for the
  kurukshetra agent.
- **Bhagadatta**: 2.14 calls him king of the Yavanas ruling the west; 2.26 and 5.19 make him king of Pragjyotisha with Chinas and Kiratas.
- **Gokula**: the Gazetteer places the Krishna-childhood tradition at Mahaban, and notes Gokul village a mile away.
- **Upaplavya**: a town near Viratanagara (Nilakantha via Raychaudhuri; Ganguli 4.72) or the Matsya capital (Pargiter via Raychaudhuri).
- **Draupadi's garments**: Ganguli's text says Dharma, unseen, covered her; recensions differ (not compared).

## For the lead

- `narrative_order.position` for Mahabharata events is parva × 1000 + section. The two older Adi Parva events
  (`samudra-manthana-mahabharata` = 18, `devasura-war-mahabharata` = 76) still sort correctly; renumbering them 1018 / 1076 would
  make the scheme uniform. VP Krishna events use book × 1000 + chapter (existing VP events use chapter only, e.g. 17).
- Events cannot link to concepts in the schema; the Gita event names the concepts in its scholar summary only.
- `ganguli-mahabharata`'s licence note still says "to check against a catalogue".
- No new sources were added; no SOURCES.md rows proposed.

## Unresolved cross-agent references (expected; mahabharata-people agent in progress)

abhimanyu, amba, ambalika, ambika, arjuna, ashwatthama, babruvahana, bhagadatta, bhima, bhishma, chitrangada-manipura, devaki,
dhrishtadyumna, dhritarashtra, draupadi, drona, drupada, duhshala, duhshasana, duryodhana, gandhari, ganga-goddess, ghatotkacha,
hidimbi, jarasandha, jayadratha, kamsa, karna, kauravas, kripa, kritavarma, kunti, madri, nakula, nanda, pandavas, pandu, parashara,
parikshit, pradyumna, pratipa, rohini, rukmini, sahadeva, samba, sanjaya, satyaki, satyavati, shakuni, shalya, shantanu, shikhandi,
shishupala, subala, subhadra, ugrasena, ulupi, upapandavas, uttara-prince, uttara-princess, vasudeva-shura, vichitravirya, vidura,
vikarna, virata, vyasa, yadavas, yashoda, yudhishthira, yuyutsu. Validation shows no other issue in these files.
