// Synthetic records for tests. Names are deliberately fictional ("fixture-…"):
// tests must never become a back door for unsourced claims about real figures or places.
import { COLLECTIONS, emptyDataset, type CollectionName, type Dataset } from "../src";

const ref = [{ source: "fixture-source", locator: "1.1" }];
const en = (text: string) => [{ text, lang: "en", script: "Latn" }];

export const raw = {
  source: () => ({
    slug: "fixture-source",
    title: "Fixture Translation",
    text: "fixture-text",
    kind: "translation",
    creators: ["A. Translator"],
    language: "en",
    published: { year: 1890 },
    licence: "public_domain",
    licence_note: "Fixture: published 1890, translator d. 1900.",
  }),
  text: () => ({
    slug: "fixture-text",
    names: en("Fixture Text"),
    genre: "purana",
    original_language: "sa",
    traditions: ["fixture-tradition"],
    sections: [{ id: "book-1", label: "Book 1" }],
    summary_beginner: "A fixture text.",
  }),
  tradition: (slug = "fixture-tradition", family = "hindu", parent?: string) => ({
    slug,
    names: en("Fixture Tradition"),
    family,
    ...(parent ? { parent } : {}),
    summary_beginner: "A fixture tradition.",
    references: ref,
  }),
  variant: (slug: string) => ({
    slug,
    names: en(slug),
    kind: "genealogy",
    tradition: "fixture-tradition",
    description: "A fixture account.",
    references: ref,
  }),
  entity: (slug: string, extra: Record<string, unknown> = {}) => ({
    slug,
    names: en(slug),
    kinds: ["deity"],
    traditions: ["fixture-tradition"],
    summary_beginner: "A fixture being.",
    references: ref,
    ...extra,
  }),
  parent: (id: string, from: string, to: string, extra: Record<string, unknown> = {}) => ({
    id,
    from,
    to,
    type: "parent",
    role: "father",
    mode: "biological",
    explanation: "Fixture parentage.",
    references: ref,
    ...extra,
  }),
  terrestrialPlace: (extra: Record<string, unknown> = {}) => ({
    slug: "fixture-town",
    names: en("Fixture Town"),
    realm: "terrestrial",
    kind: "city",
    confidence: "verified",
    geometry: { type: "Point", coordinates: [78.0, 27.0] },
    modern_admin: { country: "Fixtureland" },
    evidence: [{ type: "archaeological", summary: "Fixture excavation.", references: ref }],
    summary_beginner: "A fixture town.",
    references: ref,
    ...extra,
  }),
  cosmologicalPlace: (extra: Record<string, unknown> = {}) => ({
    slug: "fixture-heaven",
    names: en("Fixture Heaven"),
    realm: "cosmological",
    kind: "realm",
    confidence: "mythical",
    summary_beginner: "A fixture realm.",
    references: ref,
    ...extra,
  }),
  historicalTime: () => ({
    start: -600,
    end: -300,
    precision: "century",
    confidence: "medium",
    references: ref,
  }),
  kingdom: (slug: string, kind: string, extra: Record<string, unknown> = {}) => ({
    slug,
    names: en(slug),
    kind,
    summary_beginner: "A fixture kingdom.",
    references: ref,
    ...(kind === "epic_legendary" ? {} : { historical_time: raw.historicalTime() }),
    ...extra,
  }),
  ref,
};

/** Parse raw records into a Dataset, throwing on schema errors (fixtures must be valid). */
export function dataset(records: Partial<Record<CollectionName, unknown[]>>): Dataset {
  const ds = emptyDataset();
  for (const [name, list] of Object.entries(records) as [CollectionName, unknown[]][]) {
    (ds[name] as unknown[]) = list.map((r) => COLLECTIONS[name].schema.parse(r));
  }
  return ds;
}

/** The smallest valid dataset: one source, text, tradition, two variants, a parent and a child. */
export function baseRecords(): Record<string, unknown[]> & {
  entities: unknown[];
  relationships: unknown[];
} {
  return {
    sources: [raw.source()],
    texts: [raw.text()],
    traditions: [raw.tradition()],
    variants: [raw.variant("fixture-variant-a"), raw.variant("fixture-variant-b")],
    entities: [raw.entity("fixture-parent"), raw.entity("fixture-child")],
    relationships: [raw.parent("rel-1", "fixture-parent", "fixture-child")],
  };
}
