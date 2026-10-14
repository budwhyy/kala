import type { CollectionName, Dataset, Name } from "@kala/schema";
import type * as t from "./schema";

type Insert<T extends { $inferInsert: unknown }> = T["$inferInsert"];

export type LinkRow = Insert<typeof t.links>;
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
    names: nameRows(ds),
    links: linkRows(ds),
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
  return rows;
}

function linkRows(ds: Dataset): LinkRow[] {
  const rows = new Map<string, LinkRow>();
  const add = (
    fromType: CollectionName,
    fromSlug: string,
    toType: CollectionName,
    targets: (string | undefined)[],
    role: string,
  ) => {
    for (const toSlug of targets) {
      if (!toSlug) continue;
      const row = { fromType, fromSlug, toType, toSlug, role };
      rows.set(`${fromType}|${fromSlug}|${toType}|${toSlug}|${role}`, row);
    }
  };

  for (const s of ds.sources) add("sources", s.slug, "texts", [s.text], "text");
  for (const x of ds.texts) add("texts", x.slug, "traditions", x.traditions, "traditions");
  for (const v of ds.variants) {
    add("variants", v.slug, "traditions", [v.tradition], "tradition");
    add("variants", v.slug, "texts", [v.text], "text");
  }
  for (const e of ds.entities) {
    add("entities", e.slug, "traditions", e.traditions, "traditions");
    add(
      "entities",
      e.slug,
      "dynasties",
      e.dynasties.map((d) => d.to),
      "dynasties",
    );
  }
  for (const e of ds.events) {
    add(
      "events",
      e.slug,
      "entities",
      e.participants.map((p) => p.entity),
      "participants",
    );
    add("events", e.slug, "places", e.places, "places");
    add("events", e.slug, "texts", [e.narrative_order?.text], "narrative_order");
    add("events", e.slug, "traditions", e.traditions, "traditions");
  }
  for (const d of ds.dynasties) {
    add("dynasties", d.slug, "entities", d.founders, "founders");
    add(
      "dynasties",
      d.slug,
      "kingdoms",
      d.kingdoms.map((k) => k.to),
      "kingdoms",
    );
    add("dynasties", d.slug, "traditions", d.traditions, "traditions");
  }
  for (const p of ds.places) {
    add(
      "places",
      p.slug,
      "kingdoms",
      p.kingdoms.map((k) => k.to),
      "kingdoms",
    );
    add(
      "places",
      p.slug,
      "entities",
      p.entities.map((e) => e.to),
      "entities",
    );
    add(
      "places",
      p.slug,
      "places",
      p.related_places.map((r) => r.to),
      "related_places",
    );
    add("places", p.slug, "traditions", p.traditions, "traditions");
  }
  for (const k of ds.kingdoms) {
    add("kingdoms", k.slug, "kingdoms", k.same_name_as, "same_name_as");
    add(
      "kingdoms",
      k.slug,
      "places",
      k.capitals.map((c) => c.to),
      "capitals",
    );
    add(
      "kingdoms",
      k.slug,
      "entities",
      k.rulers.map((r) => r.entity),
      "rulers",
    );
    add("kingdoms", k.slug, "kingdoms", k.neighbours, "neighbours");
    add(
      "kingdoms",
      k.slug,
      "dynasties",
      k.dynasties.map((d) => d.to),
      "dynasties",
    );
    add(
      "kingdoms",
      k.slug,
      "kingdoms",
      k.relations.map((r) => r.kingdom),
      "relations",
    );
    add("kingdoms", k.slug, "traditions", k.traditions, "traditions");
  }
  for (const c of ds.concepts) {
    add("concepts", c.slug, "concepts", c.related, "related");
    add(
      "concepts",
      c.slug,
      "traditions",
      c.interpretations.map((i) => i.tradition),
      "interpretations",
    );
  }
  for (const r of ds.routes) {
    add("routes", r.slug, "texts", [r.text], "text");
    add(
      "routes",
      r.slug,
      "places",
      r.stops.map((s) => s.place),
      "stops",
    );
    add(
      "routes",
      r.slug,
      "events",
      r.stops.map((s) => s.event),
      "stops",
    );
  }
  for (const b of ds.battlefields) {
    add("battlefields", b.slug, "places", [b.place], "place");
    add("battlefields", b.slug, "texts", [b.text], "text");
  }
  return [...rows.values()];
}
