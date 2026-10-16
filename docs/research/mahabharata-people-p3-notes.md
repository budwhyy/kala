# Mahabharata-people agent notes (Phase 3)

## Access and numbering

- sacred-texts.com blocks scripts. Ganguli was read from Project Gutenberg #15474–15477 (all 18 parvas, transcribed
  from sacred-texts by J. B. Hare). Locators use the **printed section headings**, as earlier agents did.
- A Wayback check showed that sacred-texts Adi Parva file numbers run one ahead of the printed headings
  (file `m01201.htm` = Section CC). In Gutenberg, printed CLXXVI and CLXXVII fall under one heading (1.177 is
  missing), Sabha LXVII is missing, and Drona LIV, LV and CLXXXIX are missing. None of these sections is cited. Drona's
  death is cited as 7.193, following Gutenberg's heading.
- Wilson's Vishnu Purana chapters (4.13–4.20, 5.1–5.38) were read from Wayback copies of sacred-texts `vp106`–`vp155`.
  Dutt's Harivamsha (Gutenberg 61937) uses Dutt's chapter numbers (35, 37, 59).

## Added

- **92 entities**: every slug on the brief list, plus:
  - the 1.95 Kuru kings `viduratha-kuru`, `anashvan`, `parikshit-son-of-anashvan`, `bhimasena-son-of-parikshit` and
    `pratishravas`;
  - `devaka` (needed to source Kamsa as Devaki's cousin);
  - `adhiratha` and `radha-mother-of-karna`;
  - the five sons of Draupadi: `prativindhya`, `sutasoma`, `shrutakirti-son-of-arjuna`, `shatanika-son-of-nakula`
    and `shrutasena`;
  - the groups `pandavas`, `kauravas`, `upapandavas` and `yadavas`.
- **3 variants**: `mahabharata-people-kuru-line-adi-94`, `mahabharata-people-kuru-line-adi-95` and
  `mahabharata-people-amba-udyoga`. The existing `mahabharata-adi-parva` variant is reused for the section 67
  incarnation claims.
- **240 relationships** in 7 files: `content/relationships/mahabharata-kuru-line`, `-pandava-kaurava-families`,
  `-krishna-family`, `-teachers-curses`, `-allies-enemies`, `-incarnations` and `-groups`.
- Kuru- and Yadava-dynasty associations were added on the relevant entities.
- **Slug clash, fixed:** my first run overwrote the ramayana-people agent's `entities/shrutakirti.yaml` (Shatrughna's
  wife). I restored it from that agent's generator data (the same summary and Griffith 1.72/1.73 references) and renamed
  my record to `shrutakirti-son-of-arjuna`. **The ramayana-people agent should check that file.**

## Modelling decisions

- **Niyoga births.** Vyasa is the `biological` father and Vichitravirya the `legal` father of Dhritarashtra and Pandu
  ("born in the field of Vichitravirya", 1.106, 1.63). Vidura has only Vyasa as father, because his mother was a maid,
  not Vichitravirya's wife.
- **Pandavas.** Pandu is the `legal` father. The `divine` fathers are `dharma`, `vayu`, `indra` and `ashvins`
  (1.123–1.124; VP 4.14 agrees).
  - Yudhishthira: the text says Dharma, "the god of justice". Ganguli adds the gloss "(Yama, the god of justice)" at
    1.63. I linked the existing personified `dharma` and not `yama`; the gloss is given in the explanation.
- **Karna.** Kunti is his mother and `surya` his divine father. Adhiratha and Radha are entered as `adoptive`, not
  foster: 3.307 says Radha adopted him "according to the ordinance". The brief said foster, so this is a deliberate
  deviation.
- **Balarama.** Devaki is the `biological` mother (the seventh conception) and Rohini is mode `other` (the embryo was
  transferred into her and she gave birth). This follows VP 4.15, 5.1 and Harivamsha 59.
- **Draupadi and Dhrishtadyumna** arise from Drupada's sacrifice, so Drupada is father with mode `other` (1.169).
- **Portions.** "Born of a portion of" (1.67) is stored as `manifestation_of`, following the avatars agent's precedent;
  "was X himself" is stored as `identified_with`.
  - Duryodhana as a portion of Kali (the age, not the goddess) and Shakuni as Dvapara are mentioned in summaries only.
- **Kamsa and Devaki** are cousins through the brothers Devaka and Ugrasena (VP 4.14, HV 37). No source I read calls
  Kamsa her brother.

## Disagreements recorded

- **Kuru to Pratipa.** Section 94 runs Kuru → Avikshit … Janamejaya … Dhritarashtra → (grandson) Pratipa, without
  every link (stored as `descendant_of`). Section 95 runs Kuru → Viduratha → Anashvan → Parikshit → Bhimasena →
  Pratishravas → Pratipa.
- **Shikhandi.** The 1.67 incarnation list makes Shikhandi a rakshasa, while the Udyoga Parva (5.190–5.191) makes
  Shikhandi Amba reborn. Only the Udyoga link is stored, under its own variant.
- **Gandhari's hundred sons** come from Shiva's boon in 1.110 but from Vyasa's in 1.115. Both are stored as blessings.
- **Sons of Draupadi.** Arjuna's son is Shrutakirti in 1.63 and 1.67 but Shrutakarman in 1.223. Sahadeva's son is
  Shrutasena in 1.63 and 1.223 but Shrutakarman in 1.95.
- **Ambika** is the "princess of Kosala" in 1.106 but a daughter of the Kashi king in 1.102.
- **Shalya** is called Duryodhana's "maternal uncle" in 5.8, although 1.113 makes him Madri's brother.

## Dropped or not entered

- **Ulupi as Iravan's mother.** 6.91 names only an unnamed widowed Naga princess, so no mother link is entered.
- **Ulupi as Babruvahana's stepmother** (14.79): there is no step mode, so this is in the summary only.
- **Unnamed or missing figures.** These parents have no slug and are described in summaries instead: Shura,
  Kuntibhoja, Uparichara Vasu, Bharadwaja, Sharadvat, Prishata, Brihadratha, Damaghosha, Satrajit, Jambavati,
  Bhishmaka and Vidura's and Yuyutsu's unnamed mothers. Samvarana and Tapati, above Kuru, were also left out.
- **Partial incarnations without slugs:** Draupadi (Sachi), Kunti/Madri/Gandhari (Siddhi/Dhriti/Mati), Kamsa
  (Kalanemi), Jarasandha (Viprachitti), Shalya (Samhlada), Bhagadatta (Vashkala), Pradyumna (Sanatkumara) and
  Abhimanyu (Varchas, son of Soma).
- **Not read:** the Bhagavata Purana's Krishna books, and the Harivamsha's Vishnu Parva beyond chapters 35, 37 and 59.

## Unresolved cross-references

None: `validate:content` reports the content as valid.

## Sources

No new sources were used or proposed.
