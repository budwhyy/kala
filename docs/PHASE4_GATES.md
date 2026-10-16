# Phase 4 gates

| Gate                                                                                   | Result                                                                                                         |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Content validates (`validate:content`)                                                 | ✓ 48 sources, 348 figures, 741 relationships, 133 events, 119 places, 35 kingdoms, 6 periods, 11 transmissions |
| Every cited source listed in SOURCES.md                                                | ✓ (scholarship test)                                                                                           |
| Unit tests                                                                             | ✓ schema 108, db 8, web 86                                                                                     |
| Browser tests (desktop + Pixel 7)                                                      | ✓ 178, incl. `e2e/phase4.spec.ts`                                                                              |
| Accessibility (axe) on atlas, civilisation, period, transmission, kingdom, Tamil pages | ✓ no serious violations                                                                                        |
| No sideways scroll at 390px on new pages                                               | ✓                                                                                                              |
| History only on the atlas axis; no dates on narrative events                           | ✓ (schema + historyOnly notice)                                                                                |
| Polity reach from evidence, never borders                                              | ✓                                                                                                              |
| Modern nations never heirs                                                             | ✓ (disclaimer on civilisation atlas; records say so)                                                           |
| Buddhist / Jain traditions kept distinct                                               | ✓ (families; epics index grouped; no Hindu re-labelling)                                                       |
| Three UI languages (en, hi, ta), message parity tests                                  | ✓                                                                                                              |

Not done (see OPEN_QUESTIONS OQ-044 to OQ-051): Reamker, Kakawin Ramayana, Paumacariya; Vajrayana;
Kalibangan, Rakhigarhi; several translator life dates.
