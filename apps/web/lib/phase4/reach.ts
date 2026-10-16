// Approximate reach of a historical polity, derived only from its attested sites (inscriptions,
// coins, excavations). Each site is widened into a small disc and the convex hull of those discs is
// drawn as a soft, translucent area — an indication of where evidence is found, never a border.
export type LonLat = [number, number];

/** Andrew's monotone-chain convex hull. */
export function convexHull(points: readonly LonLat[]): LonLat[] {
  const pts = [...new Map(points.map((p) => [`${p[0]},${p[1]}`, p])).values()].sort(
    (a, b) => a[0] - b[0] || a[1] - b[1],
  );
  if (pts.length <= 2) return pts;
  const cross = (o: LonLat, a: LonLat, b: LonLat) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: LonLat[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower.at(-2)!, lower.at(-1)!, p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: LonLat[] = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2)!, upper.at(-1)!, p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/**
 * A closed polygon ring around the sites, padded by `radiusDeg` (≈ 0.75° ≈ 80 km) so that even one or
 * two sites give a visible soft area. Returns null with no sites.
 */
export function reachArea(sites: readonly LonLat[], radiusDeg = 0.75, steps = 12): LonLat[] | null {
  if (sites.length === 0) return null;
  const discs: LonLat[] = [];
  for (const [x, y] of sites)
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      discs.push([
        +(x + radiusDeg * Math.cos(a)).toFixed(4),
        +(y + radiusDeg * Math.sin(a)).toFixed(4),
      ]);
    }
  const hull = convexHull(discs);
  return [...hull, hull[0]!];
}

/** Do two historical ranges overlap? Years are signed (negative = BCE). */
export const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.start <= b.end && b.start <= a.end;
