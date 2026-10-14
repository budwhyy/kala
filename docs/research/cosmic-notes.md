# Cosmic agent notes

## Access

sacred-texts.com returned 403 / a Cloudflare challenge for every fetch. I read the passages instead
from full-text scans on archive.org of the same editions:

- Wilson, _Vishnu Purana_ (complete set, item `the-vishnu-purana-complete-6-books-set-horace-hayman-wilson`)
- Bühler, _Laws of Manu_, SBE 25 (item `lawsofmanu00manuuoft`)
- Ganguli, _Mahabharata_ (item `the-mahabharata-of-krishna-dwaipayana-vyasa-complete-18-volumes-kisari-mohan-ganguli_202008`)

## Added

- `content/cosmic/vishnu-purana-cycle.yaml`: yugas, 71 / 14 / 1000, sandhi note, 14 manvantaras, 4 kinds of pralaya.
- `content/cosmic/manusmriti-cycle.yaml`: yugas, 71 / 1000, 7 named Manus.
- `content/variants/cosmic-vishnu-purana.yaml`, `content/variants/cosmic-manusmriti.yaml` (kind `cosmic_model`).

Passages confirmed: VP 1.3 (time measures), 1.7 (four kinds of dissolution), 3.1 (Manus 1–7), 3.2
(Manus 8–14), 6.3 (three kinds; naimittika described), 6.4 (naimittika continued, prakritika), 6.5
(atyantika). Manu 1.61–63, 1.67, 1.69–72, 1.79–80.

## Readings and ambiguities

- **Yuga totals.** Both texts give the age proper (4000/3000/2000/1000) plus a twilight of as many
  hundreds before and after, and both state the four ages total 12,000. The schema counts twilights
  inside `divine_years`, so I recorded 4800/3600/2400/1200 with dawn and dusk of 400/300/200/100.
  That sum is the only arithmetic I did; it is checked by the stated 12,000 total.
- **Human years per divine year: omitted in both.** VP 1.3 says the northern half-year is a day of
  the gods; Manu 1.67 says a human year is a day and night of the gods. Neither states a number of
  human years per divine year. Wilson's "(three hundred and sixty)" is his bracketed insertion; and
  his figure of 306,720,000 mortal years per manvantara also comes from Wilson's rendering, not a
  clearly marked verse conversion. Left for lib/time to decide.
- **"A little more than 71."** VP 1.3 says a manvantara is seventy-one times the four ages "with some
  additional years", amount unstated. I recorded 71 and put the addition in `sandhi_note`. VP gives
  1000 mahayugas per day of Brahma and 14 Manus, so 14 × 71 = 994 does not equal 1000; that gap is the
  text's own and is why `mahayugas_per_kalpa` is stored separately.
- **Manu's manvantaras per kalpa: NOT STATED.** Manu 1.79 gives 71 ages of the gods per Manu and 1.72
  gives 1000 per day of Brahma, but 1.80 calls the Manu-periods "numberless" and 1.61–63 names only
  seven Manus. The schema requires `manvantaras_per_kalpa`, so I entered **7** (the Manus he names)
  and said so in the summary. This is a placeholder, not a textual figure. Recommend making
  `manvantaras_per_kalpa` optional in `packages/schema/src/cosmic.ts`; lib/time should use
  `mahayugas_per_kalpa` for this model.

## Differences between Vishnu Purana and Manu

- Manu gives exactly 71 for a manvantara; the VP adds unquantified extra years.
- The VP names 14 Manus in a day of Brahma (past six, present Vaivasvata, seven future); Manu names
  seven and calls the series numberless, with no count per day of Brahma.
- The VP describes kinds of pralaya (four in Book 1, three in Book 6); Manu 1.64–80 has none, only
  Brahma's sleep and waking.
- Manu calls the 12,000-year round "an age of the gods"; the VP calls it a great age (the four ages together).
- Small unit difference: Manu 1.64 has 18 nimeshas per kashtha; VP 1.3 has 15 twinklings. Not stored
  (no schema field).
- Inside the VP: Book 1 ch. 7 lists four dissolutions (incl. nitya); Book 6 ch. 3 lists three.

## Mahabharata: skipped

Confirmed in Ganguli: Vana Parva section 187 (as numbered in the archive.org scan; the brief
expected ~188, so check against sacred-texts m03187/m03188) gives the same yuga lengths and twilights,
12,000 per cycle and 1000 cycles per day of Brahma. Shanti Parva section 231 (12.231) gives the same
figures, plus a human year as a day and night of the gods. **Neither passage states mahayugas per
manvantara or manvantaras per kalpa**, which the schema requires, so I did not author a model. If those
fields become optional, a `cosmic-mahabharata` model can be built from 3.187 and 12.231.

## Validation

`pnpm --filter @kala/schema validate:content`: my files are clean apart from the expected
`svayambhuva-manu` / `vaivasvata-manu` unknown-entity issues (owned by the deities agent). One
unrelated issue: `relationships/garuda-vahana-of-vishnu` → `vishnu`, which is not my file.
