import { extractLinks, type CollectionName, type Dataset, type Name } from "@kala/schema";
import type * as t from "./schema";

type Insert<T extends { $inferInsert: unknown }> = T["$inferInsert"];

export type NameRow = Insert<typeof t.names>;

/** Table rows for a validated dataset. Pure: no database access. */
export function toRows(ds: Dataset) {
  const displayName = (names: Name[]) => names.find((n) => n.lang === "en")?.text ?? names[0]!.text;

  return {
    sources: ds.sources.map((s) => ({
      slug: s.slug,
      title: s.title,
      kind: s.kind,
      licence: s.licence,
      textSlug: s.text ?? null,
      data: s,
    })),
    texts: ds.texts.map((x) => ({ slug: x.slug, data: x })),
    traditions: ds.traditions.map((x) => ({
      slug: x.slug,
      family: x.family,
      parentSlug: x.parent ?? null,
      data: x,
    })),
    variants: ds.variants.map((x) => ({
      slug: x.slug,
      kind: x.kind,
      traditionSlug: x.tradition,
      data: x,
    })),
    entities: ds.entities.map((x) => ({
      slug: x.slug,
      displayName: displayName(x.names),
      kinds: x.kinds,
      data: x,
    })),
    relationships: ds.relationships.map((x) => ({
      id: x.id,
      fromSlug: x.from,
      toSlug: x.to,
      type: x.type,
      variantSlug: x.variant ?? null,
      data: x,
    })),
    events: ds.events.map((x) => ({ slug: x.slug, variantSlug: x.variant ?? null, data: x })),
    dynasties: ds.dynasties.map((x) => ({ slug: x.slug, kind: x.kind, data: x })),
    places: ds.places.map((x) => ({
      slug: x.slug,
      realm: x.realm,
      kind: x.kind,
      confidence: x.confidence,
      geom: x.geometry ?? null,
      data: x,
    })),
    kingdoms: ds.kingdoms.map((x) => ({
      slug: x.slug,
      kind: x.kind,
      extent: x.extent?.geometry ?? null,
      data: x,
    })),
    concepts: ds.concepts.map((x) => ({ slug: x.slug, data: x })),
    routes: ds.routes.map((x) => ({ slug: x.slug, data: x })),
    battlefields: ds.battlefields.map((x) => ({ slug: x.slug, data: x })),
    cosmicModels: ds.cosmic.map((x) => ({ slug: x.slug, data: x })),
    networks: ds.networks.map((x) => ({ slug: x.slug, kind: x.kind, data: x })),
    journeys: ds.journeys.map((x) => ({ slug: x.slug, data: x })),
    periods: ds.periods.map((x) => ({ slug: x.slug, data: x })),
    transmissions: ds.transmissions.map((x) => ({ slug: x.slug, type: x.type, data: x })),
    names: nameRows(ds),
    links: extractLinks(ds),
  };
}

function nameRows(ds: Dataset): NameRow[] {
  const rows: NameRow[] = [];
  const add = (ownerType: CollectionName, ownerSlug: string, names: Name[]) =>
    names.forEach((n, rank) =>
      rows.push({
        ownerType,
        ownerSlug,
        text: n.text,
        lang: n.lang,
        script: n.script,
        iast: n.iast ?? null,
        rank,
      }),
    );
  for (const x of ds.texts) add("texts", x.slug, x.names);
  for (const x of ds.traditions) add("traditions", x.slug, x.names);
  for (const x of ds.variants) add("variants", x.slug, x.names);
  for (const x of ds.entities) add("entities", x.slug, [...x.names, ...x.epithets]);
  for (const x of ds.events) add("events", x.slug, x.names);
  for (const x of ds.dynasties) add("dynasties", x.slug, x.names);
  for (const x of ds.places) add("places", x.slug, x.names);
  for (const x of ds.kingdoms) add("kingdoms", x.slug, x.names);
  for (const x of ds.concepts) add("concepts", x.slug, x.names);
  for (const x of ds.networks) add("networks", x.slug, x.names);
  for (const x of ds.journeys) add("journeys", x.slug, x.names);
  for (const x of ds.periods) add("periods", x.slug, x.names);
  for (const x of ds.transmissions) add("transmissions", x.slug, x.names);
  return rows;
}
