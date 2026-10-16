// §8 gate 2: the trace returns a sourced path for known pairs.
import { resolve } from "node:path";
import { loadContent } from "@kala/schema/load";
import { describe, expect, it } from "vitest";
import { tracePaths } from "./trace";

const { dataset } = await loadContent(resolve(import.meta.dirname, "../../../../content"));
const rels = dataset.relationships;

describe("tracePaths on Phase 1 content", () => {
  // Phase 1 pairs, then the epic pairs added in Phase 3 (resolves OQ-019).
  it.each([
    ["kashyapa", "garuda", 1],
    ["rama", "vaivasvata-manu", 2],
    ["garuda", "vishnu", 1],
    ["brahma", "kashyapa", 2],
    ["daksha", "garuda", 3],
    ["hiranyakashipu", "indra", 2],
    ["vasuki", "garuda", 2],
    ["marichi", "surya", 2],
    ["surya", "ikshvaku", 2],
    ["yadu", "puru", 2],
    ["shiva", "parvati", 1],
    ["vishnu", "lakshmi", 1],
    // Epic pairs (Phase 3), including the brief §8 examples Krishna ↔ Arjuna and Shakuni ↔ Duryodhana.
    ["krishna", "arjuna", 4],
    ["shakuni", "duryodhana", 2],
    ["bhishma", "arjuna", 4],
    ["karna", "arjuna", 2],
    ["rama", "hanuman", 2],
    ["ravana", "vibhishana", 2],
    ["dasharatha", "ikshvaku", 40],
  ])("%s ↔ %s", (a, b, maxLength) => {
    const paths = tracePaths(rels, a, b);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path.length).toBeLessThanOrEqual(maxLength);
      expect(path[0]!.from).toBe(a);
      expect(path.at(-1)!.to).toBe(b);
      for (const step of path) {
        expect(step.relationship.references.length).toBeGreaterThan(0);
        expect(step.relationship.explanation.length).toBeGreaterThan(0);
      }
    }
  });

  it("is symmetric in length", () => {
    expect(tracePaths(rels, "garuda", "kashyapa")[0]!.length).toBe(
      tracePaths(rels, "kashyapa", "garuda")[0]!.length,
    );
  });

  it("drops claims from excluded variants and finds no path through them", () => {
    const hiranyaksha = tracePaths(rels, "hiranyaksha", "kashyapa");
    const variants = new Set(
      hiranyaksha.flatMap((p) => p.map((s) => s.relationship.variant).filter(Boolean)),
    );
    expect(variants.size).toBeGreaterThan(0);
    expect(
      tracePaths(rels, "hiranyaksha", "kashyapa", { excludeVariants: variants as Set<string> }),
    ).toEqual([]);
  });
});
