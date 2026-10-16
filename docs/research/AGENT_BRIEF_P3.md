# Phase 3 research brief — the epics (addendum to AGENT_BRIEF.md and AGENT_BRIEF_P2.md)

Read `docs/research/AGENT_BRIEF.md`, then `docs/research/AGENT_BRIEF_P2.md`: **every rule there still
applies** (verify every locator by reading the passage online; own words only; no placeholders;
variants for disagreement; no historical dates for myths; no coordinates for cosmological places;
only touch your own files; do not edit docs/SOURCES.md — put proposed rows in your notes; no git).
Then read brief §6.5 in `KALA_BUILD_BRIEF.md`, `docs/DATA_MODEL.md` (§9 and the Route/Battlefield
schemas in `packages/schema/src/geo.ts`), and list `content/` so you reuse existing slugs.

The owner has approved Phase 3: the Ramayana and Mahabharata universes.

## Online texts

sacred-texts.com blocks automated access. Use archive.org scans/full text, Project Gutenberg,
Wayback Machine copies of sacred-texts pages (`web.archive.org/web/2023/https://www.sacred-texts.com/hin/...`),
wisdomlib.org reprints of the same edition.

- Ganguli Mahabharata: Gutenberg #15474 is vol. 1 (Adi Parva) only. Other parvas: archive.org
  (search "Mahabharata of Krishna-Dwaipayana Vyasa Ganguli") or Wayback sacred-texts `/hin/m02/`…`/m18/`.
  Locator: `parva.section` with Ganguli's numbering (Sabha = 2, Vana = 3, Virata = 4, Udyoga = 5,
  Bhishma = 6, Drona = 7, Karna = 8, Shalya = 9, Sauptika = 10, Stri = 11, Shanti = 12, Anushasana = 13,
  Ashvamedhika = 14, Ashramavasika = 15, Mausala = 16, Mahaprasthanika = 17, Svargarohanika = 18).
  The Bhagavad Gita is Bhishma Parva sections 25–42 in Ganguli; `telang-bhagavadgita` uses chapter.verse.
- Griffith Ramayana (`griffith-ramayana`): Gutenberg #24869; locator `book.canto`. Griffith abridges
  Book VII (Uttara). Dutt's prose Ramayana (`dutt-ramayana`) is complete: locator `kanda.sarga`.
- Tulsidas, Ramcharitmanas: F. S. Growse, _The Ramayana of Tulsi Das_ (1877–1883; Growse d. 1893) is
  public domain — verify and add it as a source if you use it (Ramayana story agent only).
- Harivamsha: `dutt-harivamsha` (Gutenberg 61937). Vishnu Purana Book 5 (Krishna): `wilson-vishnu-purana`.

## Hard rules for the epics

- **Routes are literary reconstructions.** `literary_reconstruction: true` is required; the summary
  must say the route follows the text, not a verified itinerary. Stops are places whose own records
  carry their confidence class (often `traditional` or `debated`). Never add a stop the text does not
  name; if the text's place has no agreed location, the stop may use a place record with
  confidence `debated` and alternative identifications.
- **Battle is literary.** Days, formations (vyuhas), commanders, encounters and deaths come from the
  text, never from modern retellings or TV series. No historical dates.
- **Versions.** Valmiki and Tulsidas differ (e.g. the illusory Sita in the Ramcharitmanas): give each
  claim the variant of its text. Book VII (Uttara Kanda) of Valmiki is widely regarded by scholars as a
  later layer — tag Uttara-only claims with a variant that says so, citing scholarship you have read
  (e.g. A. A. Macdonell, _A History of Sanskrit Literature_, 1900, PD) — never present it as settled.
- **Divine parentage** (the Pandavas' fathers, Karna's father) uses `mode: divine` alongside the
  legal father (`mode: legal`) as the text gives it; never "biological" for a god.
- **Respect.** These are scriptures for millions; describe, attribute, never mock or moralise.

## Slug ownership (Phase 3)

Before creating any slug, check `content/entities/` etc. Existing Phase 1–2 slugs are shared
(rama, krishna, balarama, ikshvaku, kuru, puru, yadu, yayati, vishnu, lakshmi, shiva, brahma, indra,
surya, vayu, agni, yama, dharma, vasishtha, parashurama, ganga (the RIVER place; the goddess entity is
`ganga-goddess`), kurukshetra (place), hastinapura, indraprastha, ayodhya, mithila, lanka-ramayana,
kishkindha, panchavati, chitrakoot, rameswaram, dwarka, mathura, vrindavan, gandhara …).

**ramayana-people agent** — entities: dasharatha, kausalya, kaikeyi, sumitra, lakshmana, bharata,
shatrughna, sita, janaka, kushadhvaja, urmila, mandavi, shrutakirti, vishvamitra, ahalya, hanuman,
sugriva, vali, angada, tara-vanara, jambavan, nala-vanara, nila-vanara, ravana, kumbhakarna, vibhishana,
indrajit, mandodari, shurpanakha, maricha (NOT marichi), subahu, tataka, khara, dushana, jatayu,
sampati, guha, shabari, valmiki, lava, kusha, vishravas, kaikasi, sumali, and the Ikshvaku kings between
Ikshvaku and Dasharatha as the Bala Kanda genealogy gives them (e.g. dilipa, bhagiratha, raghu, aja, sagara);
groups `vanaras`, `rakshasas`. Relationship files `content/relationships/ramayana-*.yaml`.

**ramayana-story agent** — events `ramayana-*` with narrative_order (text valmiki-ramayana, sections by
kanda), places new to the epic (e.g. shringaverapura, dandakaranya, rishyamukha, pampa, nandigrama,
mahendra-mountain, setu-ramayana as appropriate — check confidence classes carefully), kingdoms
`kishkindha-kingdom-epic`, `lanka-kingdom-epic`, the `sections` of `content/texts/valmiki-ramayana.yaml`
(seven kandas; you may edit only that field), a new text `ramcharitmanas` + source (Growse) + variants,
and routes: `rama-exile-route-valmiki` (Ayodhya → … → Lanka → Ayodhya) and, if sourced, a Ramcharitmanas
route; `hanuman-leap-route` only if sourced. Travellers: rama, sita, lakshmana (owned by ramayana-people).

**mahabharata-people agent** — entities: pratipa, shantanu, ganga-goddess, bhishma, satyavati, parashara,
vyasa, chitrangada-kuru, vichitravirya, amba, ambika, ambalika, dhritarashtra, pandu, vidura, gandhari,
kunti, madri, yudhishthira, bhima, arjuna, nakula, sahadeva, karna, duryodhana, duhshasana, duhshala,
vikarna, yuyutsu, jayadratha, draupadi, drupada, dhrishtadyumna, shikhandi, drona, kripa, kripi,
ashwatthama, shakuni, subala, abhimanyu, uttara-princess, uttara-prince, virata, parikshit, janamejaya,
ghatotkacha, hidimbi, ulupi, chitrangada-manipura, babruvahana, iravan, vasudeva-shura (Krishna's father),
devaki, rohini, nanda, yashoda, subhadra, rukmini, satyabhama, pradyumna, aniruddha, samba, kamsa,
ugrasena, jarasandha, shishupala, shalya, bhagadatta, sanjaya, kritavarma, satyaki, bhurishravas,
somadatta, bahlika, and the Kuru line between Kuru and Pratipa as the Adi Parva gives it (sections 94 and
95 differ — use variants). Groups: pandavas, kauravas, upapandavas, yadavas. Relationship files
`content/relationships/mahabharata-*.yaml`. Also: krishna is a cousin of the Pandavas through Kunti
(Pritha), sister of Vasudeva — source it.

**mahabharata-story agent** — events `mahabharata-*` with narrative_order (text mahabharata, sections by
parva), the `sections` of `content/texts/mahabharata.yaml` (18 parvas; you may edit only that field),
Gita events linked to existing concepts where the narrative sets them, places new to the epic (e.g.
varanavata, ekachakra, kampilya, kamyaka-forest, dvaitavana, upaplavya, viratanagara, gokula, govardhana,
prabhasa, kundina …), new epic kingdoms (exact slugs: `matsya-kingdom-epic`, `madra-kingdom-epic`,
`chedi-kingdom-epic`, `anga-kingdom-epic`, `yadava-kingdom-epic`, `sindhu-kingdom-epic`,
`pragjyotisha-kingdom-epic`, `kamboja-kingdom-epic`, `kekaya-kingdom-epic`, `kalinga-kingdom-epic` — create
only those you can source), kingdom `relations` (alliances, marriages, wars) on epic kingdoms, and routes:
`pandavas-exile-route` (Vana/Virata parvas), `krishna-life-route` (Mathura → Gokula/Vrindavan → Mathura →
Dwarka; Harivamsha / Vishnu Purana Book 5; separate routes per account if they differ),
`pandavas-final-journey` (Mahaprasthanika), and `pandavas-early-wanderings` (Varanavata → Ekachakra →
Kampilya) if sourced. You may edit only `relations` on existing epic kingdoms.

**kurukshetra agent** — `content/battlefields/kurukshetra-war.yaml` only (+ variants `kurukshetra-*`):
sides `pandava-army` and `kaurava-army` with leaders and the kingdoms the Udyoga Parva says joined each
side (reference ONLY the kingdom slugs listed above and existing ones), the eighteen days with commanders
(Bhishma days 1–10, Drona 11–15, Karna 16–17, Shalya 18 — as the text gives it), named formations
(vyuhas) with the side that formed them, key encounters, and the fallen (with who slew them when the text
says), each with locators in Bhishma/Drona/Karna/Shalya parvas. The night raid (Sauptika Parva) is NOT a
day of battle: mention it in the summary only. People slugs: use the mahabharata-people list.

Cross-agent references are resolved when all agents finish; list any unresolved ones in your notes.

## Finish

Run `pnpm --filter @kala/schema validate:content` from the repo root; fix every issue in your files
(others' unresolved slugs are expected). Write `docs/research/<agent>-p3-notes.md`: what you added,
claims dropped, disagreements between versions, proposed SOURCES.md rows, open questions. Final report
under 300 words.
