import { describe, expect, it } from "vitest";
import { convexHull, overlaps, reachArea } from "./reach";

describe("convexHull", () => {
  it("keeps only outer points", () => {
    const h = convexHull([
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
      [1, 1],
    ]);
    expect(h).toHaveLength(4);
    expect(h).not.toContainEqual([1, 1]);
  });
});

describe("reachArea", () => {
  it("is null without evidence and a closed padded ring with it", () => {
    expect(reachArea([])).toBeNull();
    const ring = reachArea([[80, 25]])!;
    expect(ring[0]).toEqual(ring.at(-1));
    const xs = ring.map((p) => p[0]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(1.5, 1);
  });
  it("contains every site", () => {
    const sites: [number, number][] = [
      [75, 20],
      [85, 25],
      [80, 30],
    ];
    const ring = reachArea(sites)!;
    const xs = ring.map((p) => p[0]);
    const ys = ring.map((p) => p[1]);
    for (const [x, y] of sites) {
      expect(x).toBeGreaterThan(Math.min(...xs));
      expect(y).toBeLessThan(Math.max(...ys));
    }
  });
});

describe("overlaps", () => {
  it("compares signed historical years", () => {
    expect(overlaps({ start: -322, end: -185 }, { start: -268, end: -232 })).toBe(true);
    expect(overlaps({ start: -322, end: -185 }, { start: 320, end: 550 })).toBe(false);
  });
});
