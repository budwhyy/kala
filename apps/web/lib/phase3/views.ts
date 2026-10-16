// Server-side view builders for the epic pages. Pure functions over the graph index.
import { shortSource } from "@/components/cards/ui";
import type { BattleView } from "@/components/explore/BattlefieldExplorer";
import type { Kala } from "../graph/kala";
import type { Cite } from "./epic";

export const citer =
  (kala: Kala) =>
  (source: string, locator: string): Cite => ({
    text: `${shortSource(kala, source)} ${locator}`,
    href: `/source/${source}`,
  });

export function battleView(kala: Kala, slug: string): BattleView {
  const b = kala.get("battlefields", slug)!;
  const cite = citer(kala);
  const refs = (rs: { source: string; locator: string }[]) =>
    rs.map((r) => cite(r.source, r.locator));
  const person = (s: string) => ({ label: kala.nameOf("entities", s), href: `/entity/${s}` });
  return {
    sides: b.sides.map((s) => ({
      id: s.id,
      name:
        s.names.find((n) => n.lang === (kala.locale === "hi" ? "hi" : "en"))?.text ??
        s.names[0]!.text,
      leaders: s.leaders.map(person),
      kingdoms: s.kingdoms.map((k) => ({
        label: kala.nameOf("kingdoms", k.to),
        href: `/kingdom/${k.to}`,
        note: k.note,
        cites: refs(k.references),
      })),
      cites: refs(s.references),
    })),
    days: [...b.days]
      .sort((a, z) => a.day - z.day)
      .map((d) => ({
        day: d.day,
        section: d.section,
        summary: d.summary,
        commanders: d.commanders.map((c) => ({
          ...person(c.entity),
          side: c.side,
          cites: refs(c.references),
        })),
        formations: d.formations.map((f) => ({
          side: f.side,
          name: f.name.text,
          sub: f.name.iast,
          note: f.note,
          cites: refs(f.references),
        })),
        encounters: d.encounters.map((e) => ({
          people: e.participants.map(person),
          summary: e.summary,
          cites: refs(e.references),
        })),
        fallen: d.fallen.map((f) => ({
          ...person(f.entity),
          by: f.by.map(person),
          note: f.note,
          cites: refs(f.references),
        })),
        cites: refs(d.references),
      })),
  };
}

export type KingdomRelationView = {
  from: { label: string; href: string };
  to: { label: string; href: string };
  type: string;
  note: string;
  variant?: string | undefined;
  cites: Cite[];
};

/**
 * Political geography of an epic: relations (war, alliance, marriage…) between legendary kingdoms that
 * the epic's own sources attest, plus the kingdoms its battlefields and event places involve.
 */
export function epicPolitics(kala: Kala, textSlug: string) {
  const cite = citer(kala);
  const editions = new Set(
    kala.dataset.sources.filter((s) => s.text === textSlug).map((s) => s.slug),
  );
  const inEpic = new Set<string>();
  for (const b of kala.dataset.battlefields)
    if (b.text === textSlug) b.sides.forEach((s) => s.kingdoms.forEach((k) => inEpic.add(k.to)));
  for (const e of kala.dataset.events)
    if (e.narrative_order?.text === textSlug)
      for (const p of e.places)
        kala.neighbours("places", p, "kingdoms").forEach((k) => inEpic.add(k));

  const relations: KingdomRelationView[] = [];
  for (const k of kala.dataset.kingdoms) {
    if (k.kind !== "epic_legendary") continue;
    for (const r of k.relations) {
      if (!r.references.some((x) => editions.has(x.source))) continue;
      inEpic.add(k.slug);
      inEpic.add(r.kingdom);
      relations.push({
        from: { label: kala.nameOf("kingdoms", k.slug), href: `/kingdom/${k.slug}` },
        to: { label: kala.nameOf("kingdoms", r.kingdom), href: `/kingdom/${r.kingdom}` },
        type: r.type,
        note: r.note,
        variant: r.variant,
        cites: r.references.map((x) => cite(x.source, x.locator)),
      });
    }
  }
  const kingdoms = [...inEpic]
    .filter((s) => kala.get("kingdoms", s)?.kind === "epic_legendary")
    .map((s) => ({ slug: s, label: kala.nameOf("kingdoms", s), href: `/kingdom/${s}` }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return { kingdoms, relations };
}
