# Genealogy agent notes

## Access

sacred-texts.com returned a Cloudflare challenge (403) for every request. Passages were read instead in
the same editions: Ganguli's Mahabharata vol. 1 on Project Gutenberg (ebook 15474, Ganguli's section
numbering kept), and Wilson's Vishnu Purana on wisdomlib.org (Wilson's book/chapter numbering). Both
are the editions in `content/sources`.

## Added

- 21 entities: kashyapa, aditi, diti, danu, vinata, kadru, garuda, aruna, indra, surya, varuna,
  hiranyakashipu, hiranyaksha, shesha, vasuki, takshaka, adityas, daityas, danavas, nagas, ashvins.
- 42 relationships in `content/relationships/genealogy-kashyapa-marriages.yaml`, `genealogy-aditi-line.yaml`,
  `genealogy-diti-danu-line.yaml` and `genealogy-vinata-kadru.yaml`.
- Locators used: MBh 1.16, 1.18, 1.20, 1.23, 1.33, 1.34, 1.35, 1.36, 1.64, 1.65, 1.66; VP 1.15, 1.21, 3.2.

## Disagreements between sources

- **Kashyapa's wives (both say 13):** MBh 1.65 has Aditi, Diti, Danu, Kala, Danayu, Sinhika, Krodha,
  Pradha, Viswa, Vinata, Kapila, Muni, Kadru. VP 1.15 has Aditi, Diti, Danu, Arishta, Surasa, Surabhi,
  Vinata, Tamra, Krodhavasha, Ira, Khasa, Kadru, Muni. Only the five wives we cover are entered, and
  they appear in both lists, so no variant was needed.
- **The twelve Adityas:** MBh 1.65 has Dhatri, Mitra, Aryaman, Sakra, Varuna, Ansa, Vaga, Vivaswat, Usha,
  Savitri, Tvashtri, Vishnu. VP 1.15 has Pushan instead of Usha, and Dhuti for Dhatri. Indra (Sakra),
  Vivasvat and Varuna are in both lists, so their parentage has no variant. VP 1.15 also says the
  Adityas were the Tushita gods of the previous manvantara.
- **Diti's sons:** MBh 1.65 says Diti had one son, Hiranyakashipu. VP 1.15 gives two, Hiranyakashipu and
  Hiranyaksha. The Hiranyaksha links carry `variant: vishnu-purana-account`.
- **Danavas:** MBh 1.65 lists 40 sons of Danu plus 10 more. VP 1.21 has a shorter list. Only group-level
  links were entered.
- **Vinata's sons:** MBh 1.65 lists six (Tarkhya, Arishtanemi, Garuda, Aruna, Aruni, Varuni). MBh 1.16 and
  1.66, and VP 1.21, name two (Garuda and Aruna). Only Garuda and Aruna are entered.
- **Ashvins' father:** VP 3.2 says it is the Sun, by Sanjna in the form of a mare. MBh 1.66 says Tvashtri,
  in the form of a mare, bore them as the wife of Savitri. `surya-father-of-ashvins` carries the VP
  variant. No MBh link was added because Savitri has no agreed slug.

## Dropped or left out

- **vasus, rudras:** I did not create these. In MBh 1.66 the Rudras are the sons of Sthanu, and the
  Vasus are the sons of a "Prajapati" who is Manu's son. In VP 1.15 the Vasus are children of Vasu,
  Dharma's wife, and the Rudras' parentage is unclear. None of these parents has an agreed slug, and
  the schema has no "member of" type, so the groups could not join any relationship. Agreed slugs for
  dharma and sthanu, or a membership relationship type, would fix this.
- Aruna as charioteer of the Sun (MBh 1.16): no suitable relationship type.
- Kadru and Vinata as rivals: the wager (MBh 1.20–23) is a deceitful contest, not a stated enmity, so I
  left out an `enemy` link. Kadru cursing the nagas (1.20) and Aruna cursing Vinata (1.16) are entered
  as `curse`.
- MBh 1.66 counts Garuda, Aruna and Brihaspati "among the Adityas". This is a classification, not
  parentage, so it is not entered.
- Shesha's link to Vishnu (his bed, mentioned in MBh 1.21) and Garuda helping Shesha (MBh 1.36):
  not entered.

## Expected validation issue

- `garuda-vahana-of-vishnu` points to `vishnu` (owned by the deities agent). It will resolve once that
  agent's record exists.

## Sources wished for

- Sources for the Ramayana and the Bhagavata on Kashyapa's family (Dutt's Bhagavata 6.6 gives yet
  another list). Not cited, because those passages were not checked.
