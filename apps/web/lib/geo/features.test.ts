// §8 gate 3 at the map layer: nothing cosmological reaches the map.
import { resolve } from "node:path";
import { loadContent } from "@kala/schema/load";
import { describe, expect, it } from "vitest";
import { buildKala } from "../graph/kala";
import { anchor, mapPlaces } from "./features";

describe("mapPlaces", async () => {
  const { dataset } = await loadContent(resolve(import.meta.dirname, "../../../../content"));
  const { onMap, cosmological } = mapPlaces(buildKala(dataset));

  it("never puts a cosmological realm on the map", () => {
    expect(cosmological.length).toBeGreaterThanOrEqual(6);
    for (const p of cosmological) {
      expect(p.point).toBeNull();
      expect(p.alternatives).toEqual([]);
    }
    expect(onMap.some((p) => p.confidence === "mythical")).toBe(false);
  });

  it("gives every verified and traditional place a marker", () => {
    for (const p of onMap.filter(
      (x) => x.confidence === "verified" || x.confidence === "traditional",
    )) {
      expect(p.point, p.slug).not.toBeNull();
    }
  });

  it("anchors any geometry type", () => {
    expect(anchor({ type: "Point", coordinates: [78, 27] })).toEqual([78, 27]);
    expect(
      anchor({
        type: "LineString",
        coordinates: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toEqual([1, 2]);
    expect(
      anchor({
        type: "Polygon",
        coordinates: [
          [
            [5, 6],
            [7, 8],
            [5, 6],
            [5, 6],
          ],
        ],
      }),
    ).toEqual([5, 6]);
  });
});
