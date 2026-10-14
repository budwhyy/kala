// In-memory index over the validated dataset: lookups by slug, derived reverse links and
// relationships seen from either end. Pure (no file system), so it is unit-testable and can run
// anywhere. Build it once per process via lib/content.ts.
import {
  extractLinks,
  SYMMETRIC_TYPES,
  type CollectionName,
  type Dataset,
  type Link,
  type Name,
  type Relationship,
} from "@kala/schema";

export type Kala = ReturnType<typeof buildKala>;

/** Where each collection's records live in the app. Collections without pages map to null. */
export const ROUTES: Record<CollectionName, string | null> = {
  entities: "/entity",
  places: "/place",
  kingdoms: "/kingdom",
  dynasties: "/dynasty",
  texts: "/text",
  sources: "/source",
  variants: "/variant",
  traditions: "/tradition",
  relationships: null,
  events: "/event",
  concepts: "/concept",
  networks: "/network",
  journeys: "/journey",
  routes: null,
  battlefields: null,
  cosmic: null,
};

export function hrefFor(collection: CollectionName, slug: string): string | null {
  const base = ROUTES[collection];
  return base ? `${base}/${slug}` : null;
}

export function displayName(names: Name[]): string {
  return names.find((n) => n.lang === "en")?.text ?? names[0]?.text ?? "";
}

/** A relationship seen from one of its ends. */
export type RelationView = {
  relationship: Relationship;
  /** "out" when the viewed entity is `from`; symmetric types are always "out". */
  direction: "out" | "in";
  other: string;
};

export function buildKala(ds: Dataset) {
  const maps = Object.fromEntries(
    (Object.keys(ds) as CollectionName[]).map((c) => [
      c,
      new Map((ds[c] as { slug?: string; id?: string }[]).map((r) => [r.slug ?? r.id ?? "", r])),
    ]),
  ) as { [K in CollectionName]: Map<string, Dataset[K][number]> };

  const links = extractLinks(ds);
  const linksFrom = new Map<string, Link[]>();
  const linksTo = new Map<string, Link[]>();
  for (const l of links) {
    const f = `${l.fromType}:${l.fromSlug}`;
    const t = `${l.toType}:${l.toSlug}`;
    linksFrom.set(f, [...(linksFrom.get(f) ?? []), l]);
    linksTo.set(t, [...(linksTo.get(t) ?? []), l]);
  }

  const relations = new Map<string, RelationView[]>();
  const push = (slug: string, view: RelationView) =>
    relations.set(slug, [...(relations.get(slug) ?? []), view]);
  for (const r of ds.relationships) {
    const symmetric = SYMMETRIC_TYPES.has(r.type);
    push(r.from, { relationship: r, direction: "out", other: r.to });
    push(r.to, { relationship: r, direction: symmetric ? "out" : "in", other: r.from });
  }

  return {
    dataset: ds,
    get<K extends CollectionName>(collection: K, slug: string): Dataset[K][number] | undefined {
      return maps[collection].get(slug) as Dataset[K][number] | undefined;
    },
    /** Display name of any record that has `names` (or `title` for sources). */
    nameOf(collection: CollectionName, slug: string): string {
      const r = maps[collection].get(slug) as { names?: Name[]; title?: string } | undefined;
      if (!r) return slug;
      return r.names ? displayName(r.names) : (r.title ?? slug);
    },
    /** Links authored on this record (e.g. a place's kingdoms). */
    linksFrom(collection: CollectionName, slug: string): Link[] {
      return linksFrom.get(`${collection}:${slug}`) ?? [];
    },
    /** Links other records make to this one (e.g. dynasties that name this kingdom). */
    linksTo(collection: CollectionName, slug: string): Link[] {
      return linksTo.get(`${collection}:${slug}`) ?? [];
    },
    /** Records of `type` linked to this record in either direction, de-duplicated. */
    neighbours(collection: CollectionName, slug: string, type: CollectionName): string[] {
      const out = new Set<string>();
      for (const l of linksFrom.get(`${collection}:${slug}`) ?? [])
        if (l.toType === type) out.add(l.toSlug);
      for (const l of linksTo.get(`${collection}:${slug}`) ?? [])
        if (l.fromType === type) out.add(l.fromSlug);
      return [...out];
    },
    relationsOf(entity: string): RelationView[] {
      return relations.get(entity) ?? [];
    },
  };
}
