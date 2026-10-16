# Phase 4 research brief — wider traditions and historical geography

Read `docs/research/AGENT_BRIEF.md`, `AGENT_BRIEF_P2.md` and `AGENT_BRIEF_P3.md` first: **every rule
there still applies** (verify every locator by reading the passage online; own words; no placeholders;
variants for disagreement; no coordinates for cosmological places; only your own files; propose
SOURCES.md rows in your notes; no git; no global prettier). Then read brief §6.8 and §9 Phase 4 in
`KALA_BUILD_BRIEF.md`, `docs/DATA_MODEL.md`, and `packages/schema/src/history.ts` (new: `Period`,
`Transmission`) and `geo.ts` (`Kingdom.evidence_sites`). List `content/` to reuse slugs.

The owner has approved Phase 4.

## New in Phase 4

- **History is history, myth is myth.** Historical people, polities, sites and periods get
  `historical_time` (signed years, precision, confidence, references to scholarship). Never give a
  date to a narrative event (even a Buddhist or Jain one): narrative events use `narrative_order`.
  A historical person may appear in both: e.g. Ashoka (attested by inscriptions) and Ashoka in later
  legend — one entity, with the legend's claims under a variant naming the legend's text.
- **Polity reach comes from evidence.** For historical polities fill `evidence_sites` (places where
  inscriptions, coins or excavations attest them, each with a note and reference). The map draws a
  soft area around those sites. Never draw or invent a border. `extent` stays empty unless a
  scholarly source gives one.
- **Periods** (`content/periods/`): archaeological cultures and political eras with historical time.
- **Transmissions** (`content/transmissions/`): how a story or tradition reached another culture,
  typed `direct`, `shared_ancestry`, `reinterpretation`, `independent_similarity` or
  `uncertain_hypothesis`. Use the type your sources support; when scholars disagree, use
  `uncertain_hypothesis` and explain. Modern nations are never presented as heirs or extensions of
  ancient territories; `modern_admin` is orientation only.
- **Distinct traditions.** Buddhist and Jain material uses families `buddhist` / `jain`; sub-schools
  (Theravada, Mahayana, Vajrayana; Svetambara, Digambara) are child traditions in the same family.
  Never re-label a Buddhist or Jain figure through a Hindu lens (e.g. the Jain Rishabha is not the
  Bhagavata's Rishabha avatar; the historical Buddha is not `buddha-avatar`) — if a Hindu text claims
  such an identification, store it as `identified_with` under that Hindu text's variant, and say so.
- **Copyright.** Public-domain translations for content; modern scholarship may be cited by page
  (`cited_only`) only if you actually read the page (e.g. an open-access article or a full-view scan).

## Useful public-domain sources (verify each before adding)

Cowell (ed.), _The Jataka_ (1895–1907); Cowell, _The Buddha-karita of Asvaghosha_ (SBE 49, 1894);
Rhys Davids, _Buddhist Birth Stories_ (1880) and _Buddhist Suttas_ (SBE 11, 1881 — exists);
Oldenberg / Rhys Davids, _Vinaya Texts_ (SBE 13, 17, 20); Jacobi, _Gaina Sutras_ I–II (SBE 22, 45);
J. L. Jaini, _Tattvarthadhigama Sutra_ (1920); Hultzsch, _Inscriptions of Asoka_ (CII vol. 1, 1925);
Fleet, _Inscriptions of the Early Gupta Kings_ (CII vol. 3, 1888); V. A. Smith, _The Early History of
India_ (1904; Smith d. 1920); Pargiter, _The Purana Text of the Dynasties of the Kali Age_ (1913);
Cunningham, _Ancient Geography of India_ (1871, exists) and ASI reports; Imperial Gazetteer (exists);
Marshall, _A Guide to Taxila_ (1918), _A Guide to Sanchi_ (1918); Legge's Fa-hien and Beal's Si-yu-ki
(exist); for Southeast Asia, pre-1931 scholarship read in full view (e.g. Kern, Krom, Coedès's early
articles, Journal of the Siam Society, Bulletin de l'École française d'Extrême-Orient) — verify.

## Slug ownership (Phase 4)

**buddhist agent** — the Buddhist narrative universe: a text for each narrative source you use (e.g.
`buddhacarita`, `nidanakatha`, `jataka`), events `buddhist-*` with narrative_order (Siddhartha's
birth, the four sights, the great departure, awakening at Bodh Gaya, first teaching at Sarnath,
parinirvana at Kushinagar… — places exist from Phase 2, reuse them; create `kapilavastu` (debated:
Piprahwa / Tilaurakot) if needed), people (`siddhartha-gautama` — the historical Buddha, kinds human,
historical_time only from scholarship with low confidence and an honest note that dates are debated;
`suddhodana`, `maya-buddhist`, `yashodhara`, `rahula`, `ananda`, `shariputra`, `maudgalyayana`,
`devadatta`, `mahaprajapati-gautami`), a few Jataka stories as events (including the
**Dasaratha Jataka** — a Buddhist telling of the Rama story: link it with `same_story_as` to the
Valmiki event it parallels where honest; the civilisation agent writes the transmission record),
Buddhist cosmology only if sourced (realms as cosmological places, no coordinates), sub-traditions
`theravada`, `mahayana`, `vajrayana` (family buddhist). Relationships `content/relationships/buddhist-*`.

**jain agent** — the Jain narrative universe: texts (`kalpa-sutra` exists; `acaranga-sutra`,
`tattvartha-sutra` if used), the 24 Tirthankaras as an ordered list (variant kind list, member_of a
group `tirthankaras` with `position`), `mahavira` and `parshvanatha` and `rishabhanatha` with their
narrative events `jain-*` (birth, renunciation, kevala jnana, nirvana — places from Phase 2: pavapuri,
parasnath/Sammet Shikhar, girnar, etc.), Mahavira's family (Siddhartha and Trishala, as the Kalpa Sutra
gives them — slug `siddhartha-jain-king` to avoid any clash), Jain cosmology (Jain loka structure,
Jambudvipa as the Jain texts describe it — cosmological places, prefix `jain-`), sub-traditions
`svetambara`, `digambara` (family jain), and the historical evidence for Mahavira only from
scholarship (low confidence). Relationships `content/relationships/jain-*`.

**history agent** — historical geography: periods (`harappan-civilisation`, `vedic-period` (textual,
with heavy caveats), `mahajanapada-period`, `maurya-period`, `post-maurya-period`, `gupta-period`, …),
archaeological sites as places with historical_time and archaeological evidence (harappa,
mohenjo-daro, lothal, kalibangan, dholavira, rakhigarhi if sourced, taxila, pataliputra, kaushambi,
ashokan edict sites, …), historical polities as kingdoms (`maurya-empire`, `shunga-kingdom`,
`kushan-empire`, `satavahana-kingdom`, `gupta-empire`, others you can source) with historical_time,
capitals, attested rulers (`chandragupta-maurya`, `bindusara`, `ashoka`, `samudragupta`,
`chandragupta-ii`, `kanishka` … each attested: inscriptions/coins), and `evidence_sites`. Link
`magadha-mahajanapada` → maurya-empire etc. with kingdom `relations` (succession). Ashoka's Buddhist
patronage as sourced relationships to the buddhist agent's slugs only via the agreed slugs above.
Relationship files `content/relationships/history-*`.

**civilisation agent** — the civilisation atlas: cross-cultural traditions (family `cross_cultural`,
e.g. `thai-ramakien-tradition`, `khmer-reamker-tradition`, `javanese-kakawin-tradition`), texts
(`ramakien`, `reamker`, `kakawin-ramayana`, `hikayat-seri-rama`, `paumacariya` (Jain Ramayana, family
jain), `dasaratha-jataka` is the buddhist agent's — reference its text slug `jataka`), places outside
South Asia with honest confidence (prambanan, angkor-wat, ayutthaya, bangkok-grand-palace (Ramakien
murals), anuradhapura, borobudur, bagan …, with evidence), and **transmissions** between them typed per
the rules above: the Rama story from Valmiki to the Ramakien, Reamker, Kakawin Ramayana, Hikayat Seri
Rama, Dasaratha Jataka, Paumacariya; Buddhism to Sri Lanka, Myanmar, Thailand, Cambodia, Tibet; the
temple traditions of Java and Angkor. Also the Indo-Iranian connection (Rigveda and Avesta) as
`shared_ancestry` only with a source you read. Never call a modern nation the heir of an ancient one.

**puranic-dynasties agent** — additional Puranic material: the Puranas' own lists of the "kings of the
Kali age" (Pargiter 1913, Vishnu Purana Book 4 ch. 21–24): Barhadratha, Pradyota, Shishunaga, Nanda,
Maurya, Shunga, Kanva, Andhra dynasties as the Puranas give them, as a legendary-kind dynasty or
kingdom record per list with variants for the Puranas that differ, linked by `same_name_as` to the
history agent's historical polities (`maurya-empire`, `shunga-kingdom`, `satavahana-kingdom`) — the
Puranic account and the historical record stay separate records. Kings: create only those not in the
history agent's list (you may reference `chandragupta-maurya`, `bindusara`, `ashoka`). Also regional
variants: at least two regionally rooted traditions with PD sources and a `sourcing_note` (e.g.
Jagannath at Puri from the Gazetteer / Hunter's _Orissa_ 1872; Vithoba of Pandharpur) — distinct
traditions, attributed. Files `content/relationships/puranic-*`, `content/dynasties/puranic-*`.

Cross-agent references resolve when all finish; list unresolved ones in your notes.

## Finish

Run `pnpm --filter @kala/schema validate:content` from the repo root and fix every issue in your files.
Write `docs/research/<agent>-p4-notes.md` (added, dropped, disagreements, proposed SOURCES.md rows, open
questions). Report under 300 words.
