// Server-side shaping of the historical atlas: periods on a historical axis, the sites and polities
// active in each, and each polity's approximate reach from its attested sites. Historical time only.
import type { HistoricalTime } from "@kala/schema";
import { anchor } from "../geo/features";
import type { Kala } from "../graph/kala";
import { overlaps, reachArea, type LonLat } from "./reach";

export type AtlasPeriod = {
  slug: string;
  label: string;
  start: number;
  end: number;
  confidence: string;
  summary: string;
};

export type AtlasPolity = {
  slug: string;
  label: string;
  href: string;
  start: number;
  end: number;
  confidence: string;
  area: LonLat[] | null;
  siteCount: number;
};

export type AtlasSite = {
  slug: string;
  label: string;
  href: string;
  point: LonLat;
  start: number;
  end: number;
  confidence: string;
};

const range = (t: HistoricalTime) => ({ start: t.start, end: t.end, confidence: t.confidence });

export function atlasData(kala: Kala) {
  const periods: AtlasPeriod[] = kala.dataset.periods
    .map((p) => ({
      slug: p.slug,
      label: kala.nameOf("periods", p.slug),
      ...range(p.historical_time),
      summary: p.summary_beginner,
    }))
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const polities: AtlasPolity[] = kala.dataset.kingdoms
    .filter((k) => k.kind !== "epic_legendary" && k.historical_time)
    .map((k) => {
      const pts = k.evidence_sites
        .map((e) => anchor(kala.get("places", e.to)?.geometry))
        .filter((p): p is LonLat => p !== null);
      return {
        slug: k.slug,
        label: kala.nameOf("kingdoms", k.slug),
        href: `/kingdom/${k.slug}`,
        ...range(k.historical_time!),
        area: reachArea(pts),
        siteCount: pts.length,
      };
    });

  const sites: AtlasSite[] = kala.dataset.places.flatMap((p) => {
    const point = anchor(p.geometry);
    const t = p.historical_time[0];
    if (!point || !t || p.realm !== "terrestrial") return [];
    const start = Math.min(...p.historical_time.map((x) => x.start));
    const end = Math.max(...p.historical_time.map((x) => x.end));
    return [
      {
        slug: p.slug,
        label: kala.nameOf("places", p.slug),
        href: `/place/${p.slug}`,
        point,
        start,
        end,
        confidence: t.confidence,
      },
    ];
  });

  return { periods, polities, sites };
}

export function activeIn<T extends { start: number; end: number }>(
  items: T[],
  p: { start: number; end: number },
): T[] {
  return items.filter((x) => overlaps(x, p));
}
