import type { z } from "zod";
import { Concept, Dynasty, Entity, Event, Relationship, SYMMETRIC_TYPES } from "./beings";
import type { Reference } from "./common";
import { CosmicCycleModel } from "./cosmic";
import { Journey, PilgrimageNetwork } from "./journeys";
import { Battlefield, Kingdom, Place, Route } from "./geo";
import { Source, Text, Tradition, Variant } from "./sources";
import type { CosmicTime } from "./time";

/**
 * Every content collection: its folder under content/, its schema, and its key field.
 * Adding a collection here is enough for the loader and the seed runner to pick it up.
 */
export const COLLECTIONS = {
  sources: { schema: Source, key: "slug" },
  texts: { schema: Text, key: "slug" },
  traditions: { schema: Tradition, key: "slug" },
  variants: { schema: Variant, key: "slug" },
  entities: { schema: Entity, key: "slug" },
  relationships: { schema: Relationship, key: "id" },
  events: { schema: Event, key: "slug" },
  dynasties: { schema: Dynasty, key: "slug" },
  places: { schema: Place, key: "slug" },
  kingdoms: { schema: Kingdom, key: "slug" },
  concepts: { schema: Concept, key: "slug" },
  routes: { schema: Route, key: "slug" },
  battlefields: { schema: Battlefield, key: "slug" },
  cosmic: { schema: CosmicCycleModel, key: "slug" },
  networks: { schema: PilgrimageNetwork, key: "slug" },
  journeys: { schema: Journey, key: "slug" },
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
export const COLLECTION_NAMES = Object.keys(COLLECTIONS) as CollectionName[];

export type Dataset = { [K in CollectionName]: z.infer<(typeof COLLECTIONS)[K]["schema"]>[] };

export function emptyDataset(): Dataset {
  return Object.fromEntries(COLLECTION_NAMES.map((c) => [c, []])) as unknown as Dataset;
}

export type Issue = {
  collection: CollectionName;
  /** Slug or id of the offending record. */
  id: string;
  message: string;
};

function keyOf(collection: CollectionName, record: unknown): string {
  return String((record as Record<string, unknown>)[COLLECTIONS[collection].key]);
}

/** Collect every Reference object anywhere inside a record. */
function collectReferences(value: unknown, out: Reference[] = []): Reference[] {
  if (Array.isArray(value)) {
    for (const v of value) collectReferences(v, out);
  } else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.source === "string" && typeof o.locator === "string") out.push(o as Reference);
    for (const v of Object.values(o)) collectReferences(v, out);
  }
  return out;
}

/** Collect every CosmicTime anywhere inside a record (they are the only objects with a `phase`). */
function collectCosmicTimes(value: unknown, out: CosmicTime[] = []): CosmicTime[] {
  if (Array.isArray(value)) {
    for (const v of value) collectCosmicTimes(v, out);
  } else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.phase === "string" && typeof o.variant === "string") out.push(o as CosmicTime);
    for (const v of Object.values(o)) collectCosmicTimes(v, out);
  }
  return out;
}

const isLegendaryKind = (kind: string) => kind === "epic_legendary";

/**
 * Cross-record rules that a single-record schema cannot check:
 * unique keys, referential integrity, citations resolve, every entity is connected,
 * and conflicting claims only across different variants.
 */
export function validateDataset(ds: Dataset): Issue[] {
  const issues: Issue[] = [];
  const index = Object.fromEntries(
    COLLECTION_NAMES.map((c) => [c, new Map(ds[c].map((r) => [keyOf(c, r), r]))]),
  ) as { [K in CollectionName]: Map<string, Dataset[K][number]> };

  // Unique keys.
  for (const c of COLLECTION_NAMES) {
    const seen = new Set<string>();
    for (const r of ds[c]) {
      const k = keyOf(c, r);
      if (seen.has(k))
        issues.push({ collection: c, id: k, message: `duplicate ${COLLECTIONS[c].key} '${k}'` });
      seen.add(k);
    }
  }

  // Referential integrity helpers.
  const need = (
    from: CollectionName,
    id: string,
    target: CollectionName,
    slug: string | undefined,
    field: string,
  ) => {
    if (slug !== undefined && !index[target].has(slug)) {
      issues.push({ collection: from, id, message: `${field} → unknown ${target} '${slug}'` });
    }
  };
  const needAll = (
    from: CollectionName,
    id: string,
    target: CollectionName,
    slugs: (string | undefined)[],
    field: string,
  ) => slugs.forEach((s) => need(from, id, target, s, field));

  // Every citation resolves; every cosmic time names a known variant.
  for (const c of COLLECTION_NAMES) {
    for (const r of ds[c]) {
      const id = keyOf(c, r);
      for (const ref of collectReferences(r)) {
        need(c, id, "sources", ref.source, "reference");
        if (/<[^>]*>/.test(ref.locator)) {
          issues.push({ collection: c, id, message: `placeholder locator '${ref.locator}'` });
        }
      }
      for (const t of collectCosmicTimes(r))
        need(c, id, "variants", t.variant, "cosmic_time.variant");
    }
  }

  for (const t of ds.texts) needAll("texts", t.slug, "traditions", t.traditions, "traditions");
  for (const s of ds.sources) {
    need("sources", s.slug, "texts", s.text, "text");
    needAll("sources", s.slug, "traditions", s.traditions, "traditions");
  }
  for (const t of ds.traditions) {
    need("traditions", t.slug, "traditions", t.parent, "parent");
    const parent = t.parent ? index.traditions.get(t.parent) : undefined;
    if (parent && parent.family !== t.family) {
      issues.push({
        collection: "traditions",
        id: t.slug,
        message: `family '${t.family}' differs from parent '${parent.slug}' (${parent.family}); traditions stay distinct`,
      });
    }
  }
  for (const v of ds.variants) {
    need("variants", v.slug, "traditions", v.tradition, "tradition");
    need("variants", v.slug, "texts", v.text, "text");
  }
  for (const e of ds.entities) {
    needAll("entities", e.slug, "traditions", e.traditions, "traditions");
    needAll(
      "entities",
      e.slug,
      "dynasties",
      e.dynasties.map((d) => d.to),
      "dynasties",
    );
  }
  for (const r of ds.relationships) {
    need("relationships", r.id, "entities", r.from, "from");
    need("relationships", r.id, "entities", r.to, "to");
    need("relationships", r.id, "variants", r.variant, "variant");
  }
  for (const e of ds.events) {
    needAll(
      "events",
      e.slug,
      "entities",
      e.participants.map((p) => p.entity),
      "participants",
    );
    needAll("events", e.slug, "places", e.places, "places");
    needAll("events", e.slug, "traditions", e.traditions, "traditions");
    needAll("events", e.slug, "events", e.same_story_as, "same_story_as");
    needAll("events", e.slug, "concepts", e.concepts, "concepts");
    for (const other of e.same_story_as.map((x) => index.events.get(x))) {
      if (other && !other.same_story_as.includes(e.slug))
        issues.push({
          collection: "events",
          id: e.slug,
          message: `same_story_as '${other.slug}' must link back to '${e.slug}'`,
        });
    }
    need("events", e.slug, "variants", e.variant, "variant");
    if (e.narrative_order) {
      need("events", e.slug, "texts", e.narrative_order.text, "narrative_order.text");
      const text = index.texts.get(e.narrative_order.text);
      const section = e.narrative_order.section;
      if (text && section && !sectionIds(text.sections).has(section)) {
        issues.push({
          collection: "events",
          id: e.slug,
          message: `narrative_order.section '${section}' not in text '${text.slug}'`,
        });
      }
    }
  }
  for (const d of ds.dynasties) {
    needAll("dynasties", d.slug, "entities", d.founders, "founders");
    needAll(
      "dynasties",
      d.slug,
      "kingdoms",
      d.kingdoms.map((k) => k.to),
      "kingdoms",
    );
    needAll("dynasties", d.slug, "traditions", d.traditions, "traditions");
    need("dynasties", d.slug, "variants", d.variant, "variant");
  }
  for (const p of ds.places) {
    needAll(
      "places",
      p.slug,
      "kingdoms",
      p.kingdoms.map((k) => k.to),
      "kingdoms",
    );
    needAll(
      "places",
      p.slug,
      "entities",
      p.entities.map((e) => e.to),
      "entities",
    );
    needAll(
      "places",
      p.slug,
      "places",
      p.related_places.map((r) => r.to),
      "related_places",
    );
    needAll("places", p.slug, "traditions", p.traditions, "traditions");
    needAll(
      "places",
      p.slug,
      "variants",
      p.pilgrimage_networks.map((n) => n.variant),
      "pilgrimage_networks.variant",
    );
    for (const rel of p.related_places) {
      const other = index.places.get(rel.to);
      if (rel.relation === "cosmological_counterpart" && other && other.realm === p.realm) {
        issues.push({
          collection: "places",
          id: p.slug,
          message: `cosmological_counterpart '${rel.to}' must be in the other realm`,
        });
      }
    }
  }
  for (const k of ds.kingdoms) {
    needAll("kingdoms", k.slug, "kingdoms", k.same_name_as, "same_name_as");
    needAll(
      "kingdoms",
      k.slug,
      "places",
      k.capitals.map((c) => c.to),
      "capitals",
    );
    needAll(
      "kingdoms",
      k.slug,
      "entities",
      k.rulers.map((r) => r.entity),
      "rulers",
    );
    needAll("kingdoms", k.slug, "kingdoms", k.neighbours, "neighbours");
    needAll(
      "kingdoms",
      k.slug,
      "dynasties",
      k.dynasties.map((d) => d.to),
      "dynasties",
    );
    needAll(
      "kingdoms",
      k.slug,
      "kingdoms",
      k.relations.map((r) => r.kingdom),
      "relations",
    );
    needAll(
      "kingdoms",
      k.slug,
      "variants",
      k.relations.map((r) => r.variant),
      "relations.variant",
    );
    needAll("kingdoms", k.slug, "traditions", k.traditions, "traditions");
    for (const other of k.same_name_as.map((s) => index.kingdoms.get(s))) {
      if (other && isLegendaryKind(other.kind) === isLegendaryKind(k.kind)) {
        issues.push({
          collection: "kingdoms",
          id: k.slug,
          message: `same_name_as '${other.slug}' must link a legendary record to a historical one`,
        });
      }
    }
  }
  for (const c of ds.concepts) {
    needAll(
      "concepts",
      c.slug,
      "traditions",
      c.interpretations.map((i) => i.tradition),
      "interpretations.tradition",
    );
    needAll("concepts", c.slug, "concepts", c.related, "related");
  }
  for (const r of ds.routes) {
    need("routes", r.slug, "texts", r.text, "text");
    need("routes", r.slug, "variants", r.variant, "variant");
    needAll(
      "routes",
      r.slug,
      "places",
      r.stops.map((s) => s.place),
      "stops.place",
    );
    needAll(
      "routes",
      r.slug,
      "events",
      r.stops.map((s) => s.event),
      "stops.event",
    );
    needAll("routes", r.slug, "entities", r.travellers, "travellers");
  }
  for (const b of ds.battlefields) {
    need("battlefields", b.slug, "places", b.place, "place");
    need("battlefields", b.slug, "texts", b.text, "text");
    need("battlefields", b.slug, "variants", b.variant, "variant");
    const people = b.days.flatMap((d) => [
      ...d.encounters.flatMap((e) => e.participants),
      ...d.commanders.map((c) => c.entity),
      ...d.fallen.flatMap((f) => [f.entity, ...f.by]),
    ]);
    needAll("battlefields", b.slug, "entities", people, "days.people");
    for (const s of b.sides) {
      needAll("battlefields", b.slug, "entities", s.leaders, `sides.${s.id}.leaders`);
      needAll(
        "battlefields",
        b.slug,
        "kingdoms",
        s.kingdoms.map((k) => k.to),
        `sides.${s.id}.kingdoms`,
      );
    }
    // A figure may fall only once in one telling.
    const fell = new Map<string, number>();
    for (const d of b.days)
      for (const f of d.fallen) {
        const prior = fell.get(f.entity);
        if (prior !== undefined)
          issues.push({
            collection: "battlefields",
            id: b.slug,
            message: `'${f.entity}' falls on day ${prior} and again on day ${d.day}`,
          });
        else fell.set(f.entity, d.day);
      }
  }
  for (const m of ds.cosmic) {
    need("cosmic", m.slug, "variants", m.variant, "variant");
    needAll(
      "cosmic",
      m.slug,
      "entities",
      m.manvantaras.map((x) => x.manu),
      "manvantaras.manu",
    );
  }

  for (const n of ds.networks) {
    needAll("networks", n.slug, "traditions", n.traditions, "traditions");
    needAll("networks", n.slug, "variants", n.variants, "variants");
    for (const v of n.variants) {
      const variant = index.variants.get(v);
      if (variant && variant.kind !== "list") {
        issues.push({
          collection: "networks",
          id: n.slug,
          message: `variant '${v}' must be a list (kind: list)`,
        });
      }
    }
  }
  for (const p of ds.places) {
    for (const m of p.pilgrimage_networks) {
      need("places", p.slug, "networks", m.network, "pilgrimage_networks.network");
      const network = index.networks.get(m.network);
      if (network && m.variant && !network.variants.includes(m.variant)) {
        issues.push({
          collection: "places",
          id: p.slug,
          message: `pilgrimage_networks variant '${m.variant}' is not one of network '${m.network}' lists`,
        });
      }
    }
  }
  for (const j of ds.journeys) {
    const seen = new Set<string>();
    for (const step of j.steps) {
      if (seen.has(step.id))
        issues.push({
          collection: "journeys",
          id: j.slug,
          message: `duplicate step id '${step.id}'`,
        });
      seen.add(step.id);
      need("journeys", j.slug, "cosmic", step.cosmic_model, `steps.${step.id}.cosmic_model`);
      for (const l of step.links)
        need("journeys", j.slug, l.collection, l.slug, `steps.${step.id}.links`);
    }
  }

  // Every entity takes part in at least one relationship.
  const connected = new Set(ds.relationships.flatMap((r) => [r.from, r.to]));
  for (const e of ds.entities) {
    if (!connected.has(e.slug)) {
      issues.push({ collection: "entities", id: e.slug, message: "entity has no relationships" });
    }
  }

  // Positions within one list must be unique (e.g. a Dashavatara has one 1st avatar).
  const positions = new Map<string, string>();
  for (const r of ds.relationships) {
    if (r.position === undefined) continue;
    const key = `${r.to}|${r.type}|${r.variant}|${r.position}`;
    const prior = positions.get(key);
    if (prior)
      issues.push({
        collection: "relationships",
        id: r.id,
        message: `position ${r.position} in variant '${r.variant}' is already used by '${prior}'`,
      });
    else positions.set(key, r.id);
  }

  issues.push(...relationshipConflicts(ds.relationships));
  return issues;
}

function sectionIds(
  sections: { id: string; sections?: unknown }[],
  out = new Set<string>(),
): Set<string> {
  for (const s of sections) {
    out.add(s.id);
    if (Array.isArray(s.sections)) sectionIds(s.sections as { id: string }[], out);
  }
  return out;
}

/**
 * Conflicting claims are allowed only when they carry different variants:
 * - two different parents in the same role and mode for one child must be in different variants,
 *   and none of them may be variant-less (a variant-less claim asserts there is no disagreement);
 * - the same edge may not be stated twice in the same variant (including reversed symmetric edges).
 */
export function relationshipConflicts(relationships: z.infer<typeof Relationship>[]): Issue[] {
  const issues: Issue[] = [];

  const parentGroups = new Map<string, z.infer<typeof Relationship>[]>();
  for (const r of relationships) {
    if (r.type !== "parent") continue;
    const key = `${r.to}|${r.role}|${r.mode}`;
    parentGroups.set(key, [...(parentGroups.get(key) ?? []), r]);
  }
  for (const group of parentGroups.values()) {
    const parents = new Set(group.map((r) => r.from));
    if (parents.size < 2) continue;
    for (const r of group) {
      if (!r.variant) {
        issues.push({
          collection: "relationships",
          id: r.id,
          message: `'${r.to}' has conflicting ${r.mode} ${r.role}s; each claim needs a variant`,
        });
      }
    }
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i]!;
        const b = group[j]!;
        if (a.from !== b.from && a.variant && a.variant === b.variant) {
          issues.push({
            collection: "relationships",
            id: b.id,
            message: `conflicts with '${a.id}': two different ${b.mode} ${b.role}s of '${b.to}' in variant '${b.variant}'`,
          });
        }
      }
    }
  }

  const seen = new Map<string, string>();
  for (const r of relationships) {
    const ends = SYMMETRIC_TYPES.has(r.type) ? [r.from, r.to].sort() : [r.from, r.to];
    const key = `${ends.join("→")}|${r.type}|${r.role ?? ""}|${r.mode ?? ""}|${r.variant ?? ""}`;
    const prior = seen.get(key);
    if (prior) {
      issues.push({
        collection: "relationships",
        id: r.id,
        message: `duplicates relationship '${prior}'`,
      });
    } else {
      seen.set(key, r.id);
    }
  }
  return issues;
}
