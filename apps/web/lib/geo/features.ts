// Serializable map data built on the server from content/places and content/kingdoms.
import type { PlaceConfidence } from "@kala/schema";
import type { Kala } from "../graph/kala";
import { displayName } from "../graph/kala";

export type MapPlace = {
  slug: string;
  label: string;
  sub?: string | undefined;
  confidence: PlaceConfidence;
  kind: string;
  summary: string;
  /** [lon, lat] for the marker; null when the place has no agreed location. */
  point: [number, number] | null;
  alternatives: { label: string; confidence: PlaceConfidence; point: [number, number] }[];
  kingdoms: { slug: string; label: string; legendary: boolean }[];
  modern?: string | undefined;
  /** Linked to the epics/Puranas (legendary kingdoms, cosmic time, figures). */
  mythological: boolean;
  /** Has archaeological/historical evidence, historical dates or a historical polity. */
  historical: boolean;
};

type Geom = { type: string; coordinates: unknown };

/** A representative [lon, lat] for any GeoJSON geometry (first vertex; good enough for markers). */
export function anchor(g: Geom | null | undefined): [number, number] | null {
  if (!g) return null;
  let c: unknown = g.coordinates;
  while (Array.isArray(c) && Array.isArray(c[0])) c = c[0];
  return Array.isArray(c) && typeof c[0] === "number" ? [c[0], c[1] as number] : null;
}

export function mapPlaces(kala: Kala): { onMap: MapPlace[]; cosmological: MapPlace[] } {
  const all = kala.dataset.places.map((p): MapPlace => {
    const kingdoms = kala.neighbours("places", p.slug, "kingdoms").map((k) => ({
      slug: k,
      label: kala.nameOf("kingdoms", k),
      legendary: kala.get("kingdoms", k)?.kind === "epic_legendary",
    }));
    const deva = p.names.find((n) => n.script === "Deva");
    return {
      slug: p.slug,
      label: displayName(p.names),
      sub: deva ? `${deva.text}${deva.iast ? ` · ${deva.iast}` : ""}` : undefined,
      confidence: p.confidence,
      kind: p.kind,
      summary: p.summary_beginner,
      point: anchor(p.geometry),
      alternatives: p.alternative_identifications.flatMap((a) => {
        const pt = anchor(a.geometry);
        return pt ? [{ label: a.label, confidence: a.confidence, point: pt }] : [];
      }),
      kingdoms,
      modern: p.modern_admin
        ? [p.modern_admin.region, p.modern_admin.country].filter(Boolean).join(", ")
        : undefined,
      mythological:
        p.cosmic_time.length > 0 ||
        p.entities.length > 0 ||
        kingdoms.some((k) => k.legendary) ||
        p.evidence.some((e) => e.type === "textual" || e.type === "traditional"),
      historical:
        p.historical_time.length > 0 ||
        kingdoms.some((k) => !k.legendary) ||
        p.evidence.some((e) => e.type === "archaeological" || e.type === "historical"),
    };
  });
  return {
    onMap: all.filter((p) => p.confidence !== "mythical"),
    cosmological: all.filter((p) => p.confidence === "mythical"),
  };
}
