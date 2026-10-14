# Groups and Imperial Gazetteer notes

## Where passages were read

- Ganguli Mahabharata: Project Gutenberg #15474 (Adi Parva sections XXXV, LXV, LXVI).
- Wilson Vishnu Purana: Wayback Machine copies of sacred-texts vp050.htm (1.15) and vp075.htm (3.1).
- Imperial Gazetteer: DSAL (Univ. of Chicago) search and page images; archive.org OCR of vols 9, 10, 13, 18, 21.

## Task 1: memberships (`member_of`)

New entities: `vasus`, `rudras`, `dharma`, `sthanu`, and Vasus `dhruva-vasu`, `soma-vasu`, `anila-vasu`, `anala-vasu`, `pratyusha-vasu`, `prabhasa-vasu` (in both lists), `dhara-vasu`, `aha-vasu` (MBh only), `apa-vasu`, `dhava-vasu` (VP only).
New variants: `groups-vasus-mahabharata`, `groups-vasus-vishnu-purana`.
Relationship files: `groups-vasus-rudras.yaml`, `groups-saptarishis.yaml`, `groups-adityas-nagas.yaml`.

- Vasus. MBh 1.66 makes them sons of **Prajapati, son of Manu**, not of Dharma. That Prajapati has no record, so no parent link is stored for the MBh account. VP 1.15 makes them children of Dharma by Vasu → `dharma` parent of `vasus` (VP variant). The mother Vasu has no record.
- Soma the Vasu is kept separate from `chandra`. MBh glosses him as "Chandramas", but the VP treats the Vasu Soma as a separate figure with his own son Varchas. Open question whether to merge.
- Rudras. MBh 1.66: eleven sons of Sthanu, a further spiritual son of Brahma → `brahma` parent of `sthanu` (mind_born), `sthanu` parent of `rudras`. VP 1.15 gives eleven different names and no father. Wilson's note gives Kashyapa and Surabhi (Vayu), Brahma and Surabhi (Matsya etc.) or Bhuta (Bhagavata). These are note-only, so they were not entered. No named Rudras were added because the two lists barely overlap (only Mrigavyadha and Kapali).
- `brahma` → `dharma` (MBh 1.66, from Brahma's right breast, mode `other`).
- Seven rishis. The only seven-rishi list variant is the VP Vaivasvata list (3.1), so only `vasishtha`, `kashyapa` and `atri` are linked. Jamadagni, Gautama, Vishvamitra and Bharadvaja have no records. The mind-born-sons variants are not seven-rishi lists, so marichi, angiras, pulastya, pulaha, kratu and bhrigu were not linked. The Mahabharata's Shanti Parva list (the seven Chitrasikhandins) would need a text beyond the Gutenberg Ganguli volumes; not done.
- Adityas. Indra (Sakra), Surya (Vivasvat), Varuna and Vishnu are named in both MBh 1.65 and VP 1.15, so no variant is needed. MBh 1.66 also reckons Garuda, Aruna and Brihaspati "among the Adityas" (not entered).
- Nagas. MBh 1.35 lists Shesha, Vasuki and Takshaka first among the chief snakes, and MBh 1.65 has them as sons of Kadru.

## Task 2: Imperial Gazetteer

Verified: new edition, Oxford: Clarendon Press, 1907–09, 26 vols. Editors are named in the General Preface (vol. 1 p. vi): W. S. Meyer and then R. Burn (India), J. S. Cotton (England), with the outline planned with H. H. Risley. It is PD in the US (pre-1931), and UK Crown copyright (50 years from publication) has expired. The DSAL listing says 1908–1931 because of the revised 1931 atlas, which is excluded.

Evidence added (locator volume:page). No confidence class was changed.

| Place            | Article                                       | Locator     | Type                                                                                |
| ---------------- | --------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| vrindavan        | Brindaban                                     | 9:17        | traditional                                                                         |
| chitrakoot       | Chitrakut                                     | 10:300      | traditional                                                                         |
| kishkindha       | Vijayanagar                                   | 24:313      | traditional (assertion of local Brahmans)                                           |
| panchavati       | Nasik Town                                    | 18:410      | traditional                                                                         |
| kailash-mountain | Physical Aspects (Sutlej); Almora/Askot route | 1:31; 5:250 | traditional                                                                         |
| rameswaram       | Rameswaram                                    | 21:173      | traditional                                                                         |
| indraprastha     | Indarpat                                      | 13:331      | historical (site identification; it says scarcely any of the ancient city survives) |

For the geography agent: the `argument` text in the kishkindha and panchavati alternative identifications still says "our sources do not document this". I was allowed to edit only evidence, references and summary_scholar, so I updated summary_scholar instead.

Not done: ayodhya, dwarka, kurukshetra, mithila, lanka-ramayana and rivers. Page numbers come from the running heads; Chitrakut 10:300 was inferred from the archive.org OCR running head ("300 CHITOR"), not seen on a page image.
