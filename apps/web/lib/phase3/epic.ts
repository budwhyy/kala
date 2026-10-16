// Server-side shaping of an epic: its story in narrative order by section, its people, routes and
// battlefields. Pure functions over the graph index; every label comes from content.
import type { Event, TextSection } from "@kala/schema";
import { anchor } from "../geo/features";
import type { Kala } from "../graph/kala";

/** Flatten a text's sections into reading order. */
export function sectionOrder(sections: readonly TextSection[]): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const walk = (list: readonly TextSection[]) => {
    for (const s of list) {
      out.push({ id: s.id, label: s.label });
      if (s.sections) walk(s.sections);
    }
  };
  walk(sections);
  return out;
}

/** The text's events grouped by section, in narrative order. Events without a known section come last. */
export function storyBySection(kala: Kala, textSlug: string) {
  const text = kala.get("texts", textSlug);
  const order = sectionOrder(text?.sections ?? []);
  const events = kala.dataset.events
    .filter((e) => e.narrative_order?.text === textSlug)
    .sort((a, b) => a.narrative_order!.position - b.narrative_order!.position);
  const groups = order.map((s) => ({ ...s, events: [] as Event[] }));
  const rest: Event[] = [];
  for (const e of events) {
    const g = groups.find((x) => x.id === e.narrative_order!.section);
    if (g) g.events.push(e);
    else rest.push(e);
  }
  return { groups: groups.filter((g) => g.events.length > 0), rest, count: events.length };
}

/** Everyone the epic's events, routes and battlefields involve. */
export function epicPeople(kala: Kala, textSlug: string): Set<string> {
  const people = new Set<string>();
  for (const e of kala.dataset.events)
    if (e.narrative_order?.text === textSlug || retoldIn(kala, e, textSlug))
      e.participants.forEach((p) => people.add(p.entity));
  for (const r of kala.dataset.routes)
    if (r.text === textSlug) r.travellers.forEach((t) => people.add(t));
  for (const b of kala.dataset.battlefields)
    if (b.text === textSlug) {
      b.sides.forEach((s) => s.leaders.forEach((l) => people.add(l)));
      b.days.forEach((d) => {
        d.commanders.forEach((c) => people.add(c.entity));
        d.fallen.forEach((f) => people.add(f.entity));
      });
    }
  return people;
}

function retoldIn(kala: Kala, e: Event, textSlug: string): boolean {
  return e.same_story_as.some((s) => kala.get("events", s)?.narrative_order?.text === textSlug);
}

/** Other texts that retell this epic's events (e.g. the Ramcharitmanas for the Ramayana). */
export function retellingTexts(kala: Kala, textSlug: string): string[] {
  const texts = new Set<string>();
  for (const e of kala.dataset.events) {
    const t = e.narrative_order?.text;
    if (t && t !== textSlug && retoldIn(kala, e, textSlug)) texts.add(t);
  }
  return [...texts];
}

export type Cite = { text: string; href: string };

export type RouteStopView = {
  order: number;
  place: string;
  label: string;
  href: string;
  point: [number, number] | null;
  confidence: string;
  event?: { label: string; href: string } | undefined;
  note?: string | undefined;
  cites: Cite[];
};

export type RouteView = {
  slug: string;
  name: string;
  variant: string;
  variantName: string;
  travellers: { label: string; href: string }[];
  summary: string;
  stops: RouteStopView[];
};

export function routeView(
  kala: Kala,
  slug: string,
  cite: (source: string, locator: string) => Cite,
): RouteView {
  const r = kala.get("routes", slug)!;
  return {
    slug,
    name: kala.nameOf("routes", slug),
    variant: r.variant,
    variantName: kala.nameOf("variants", r.variant),
    travellers: r.travellers.map((t) => ({
      label: kala.nameOf("entities", t),
      href: `/entity/${t}`,
    })),
    summary: r.summary_beginner,
    stops: [...r.stops]
      .sort((a, b) => a.order - b.order)
      .map((s) => {
        const p = kala.get("places", s.place);
        return {
          order: s.order,
          place: s.place,
          label: kala.nameOf("places", s.place),
          href: `/place/${s.place}`,
          point: p
            ? (anchor(p.geometry) ?? anchor(p.alternative_identifications[0]?.geometry))
            : null,
          confidence: p?.confidence ?? "debated",
          event: s.event
            ? { label: kala.nameOf("events", s.event), href: `/event/${s.event}` }
            : undefined,
          note: s.note,
          cites: s.references.map((x) => cite(x.source, x.locator)),
        };
      }),
  };
}
