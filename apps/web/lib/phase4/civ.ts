// Server-side shaping of the civilisation atlas: tradition branches and typed transmissions.
import type { TransmissionType } from "@kala/schema";
import { anchor } from "../geo/features";
import type { Kala } from "../graph/kala";
import type { LonLat } from "./reach";

export const TRANSMISSION_TYPES: TransmissionType[] = [
  "direct",
  "shared_ancestry",
  "reinterpretation",
  "independent_similarity",
  "uncertain_hypothesis",
];

export type CivLink = {
  slug: string;
  label: string;
  type: TransmissionType;
  from: { label: string; href: string } | null;
  to: { label: string; href: string } | null;
  /** Group heading: the source text, or the source tradition when no text is named. */
  group: string;
  summary: string;
  arc: LonLat[] | null;
};

/** A gentle curve between two points (quadratic Bézier bowed to one side), for the map. */
export function arc(a: LonLat, b: LonLat, steps = 24): LonLat[] {
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const c: LonLat = [mx - dy * 0.2, my + dx * 0.2];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return [
      u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
    ];
  });
}

export type Branch = { slug: string; label: string; children: Branch[] };

export function civData(kala: Kala) {
  const end = (text?: string, tradition?: string) =>
    text
      ? { label: kala.nameOf("texts", text), href: `/text/${text}` }
      : tradition
        ? { label: kala.nameOf("traditions", tradition), href: `/tradition/${tradition}` }
        : null;
  const point = (place?: string) => (place ? anchor(kala.get("places", place)?.geometry) : null);

  const links: CivLink[] = kala.dataset.transmissions.map((t) => {
    const a = point(t.from_place);
    const b = point(t.to_place);
    const from = end(t.from_text, t.from_tradition);
    return {
      slug: t.slug,
      label: kala.nameOf("transmissions", t.slug),
      type: t.type,
      from,
      to: end(t.to_text, t.to_tradition),
      group: from?.label ?? "",
      summary: t.summary_beginner,
      arc: a && b ? arc(a, b) : null,
    };
  });

  const traditions = kala.dataset.traditions;
  const branches = (["vedic", "hindu", "buddhist", "jain", "indigenous", "cross_cultural"] as const)
    .map((family) => {
      const members = traditions.filter((t) => t.family === family);
      const node = (slug: string): Branch => ({
        slug,
        label: kala.nameOf("traditions", slug),
        children: members.filter((m) => m.parent === slug).map((m) => node(m.slug)),
      });
      const roots = members.filter((m) => !m.parent || !members.some((x) => x.slug === m.parent));
      return { family, roots: roots.map((r) => node(r.slug)) };
    })
    .filter((b) => b.roots.length > 0);

  return { links, branches };
}
