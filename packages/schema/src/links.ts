import type { CollectionName, Dataset } from "./dataset";

/** One edge of the navigation graph, as authored (reverse directions are derived on read). */
export type Link = {
  fromType: CollectionName;
  fromSlug: string;
  toType: CollectionName;
  toSlug: string;
  /** Field the link came from, e.g. "capitals", "participants". */
  role: string;
};

/**
 * Flatten every record's links (place → kingdom, event → place, …) into one edge list.
 * Entity ↔ entity relationships are not included; they live in `relationships`.
 */
export function extractLinks(ds: Dataset): Link[] {
  const rows = new Map<string, Link>();
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
    add("events", e.slug, "concepts", e.concepts, "concepts");
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
    add("routes", r.slug, "entities", r.travellers, "travellers");
  }
  for (const b of ds.battlefields) {
    add("battlefields", b.slug, "places", [b.place], "place");
    add("battlefields", b.slug, "texts", [b.text], "text");
    for (const s of b.sides) {
      add("battlefields", b.slug, "entities", s.leaders, "leaders");
      add(
        "battlefields",
        b.slug,
        "kingdoms",
        s.kingdoms.map((k) => k.to),
        "sides",
      );
    }
    const warriors = b.days.flatMap((d) => [
      ...d.commanders.map((c) => c.entity),
      ...d.encounters.flatMap((e) => e.participants),
      ...d.fallen.map((f) => f.entity),
    ]);
    add("battlefields", b.slug, "entities", warriors, "warriors");
  }
  for (const p of ds.places) {
    add(
      "places",
      p.slug,
      "networks",
      p.pilgrimage_networks.map((n) => n.network),
      "pilgrimage_networks",
    );
  }
  for (const n of ds.networks) {
    add("networks", n.slug, "traditions", n.traditions, "traditions");
    add("networks", n.slug, "variants", n.variants, "variants");
  }
  for (const j of ds.journeys) {
    for (const step of j.steps) {
      for (const l of step.links) add("journeys", j.slug, l.collection, [l.slug], "steps");
      add("journeys", j.slug, "cosmic", [step.cosmic_model], "steps");
    }
  }
  return [...rows.values()];
}
