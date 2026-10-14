import { describe, expect, it } from "vitest";
import { LAYOUT_RADIUS, runLayout } from "./force";

describe("runLayout", () => {
  it("places every node in 3D with finite coordinates, linked nodes closer than average", () => {
    const pos = runLayout({
      nodes: ["a", "b", "c", "d"],
      links: [
        ["a", "b"],
        ["c", "d"],
      ],
    });
    const d = (x: string, y: string) => Math.hypot(...pos[x]!.map((v, i) => v - pos[y]![i]!));
    expect(Object.values(pos).flat().every(Number.isFinite)).toBe(true);
    expect(d("a", "b")).toBeLessThan(d("a", "c"));
    const radii = Object.values(pos).map((p) => Math.hypot(...p));
    expect(Math.min(...radii)).toBeLessThanOrEqual(LAYOUT_RADIUS + 1e-6);
  });
});
