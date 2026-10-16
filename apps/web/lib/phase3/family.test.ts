import type { Relationship } from "@kala/schema";
import { describe, expect, it } from "vitest";
import { countNodes, familyForest } from "./family";

let n = 0;
const parent = (
  from: string,
  to: string,
  role: "father" | "mother",
  mode: string,
  variant?: string,
): Relationship =>
  ({
    id: `r${n++}`,
    from,
    to,
    type: "parent",
    role,
    mode,
    variant,
    explanation: "x",
    references: [{ source: "s", locator: "1" }],
  }) as Relationship;
const partner = (a: string, b: string): Relationship =>
  ({
    id: `r${n++}`,
    from: a,
    to: b,
    type: "partner",
    explanation: "x",
    references: [{ source: "s", locator: "1" }],
  }) as Relationship;

const rels = [
  parent("shantanu", "vichitravirya", "father", "biological"),
  parent("vichitravirya", "pandu", "father", "legal"),
  parent("vyasa", "pandu", "father", "biological"),
  parent("pandu", "arjuna", "father", "legal"),
  parent("indra", "arjuna", "father", "divine"),
  parent("kunti", "arjuna", "mother", "biological"),
  partner("pandu", "kunti"),
];

describe("familyForest", () => {
  const forest = familyForest(rels, ["arjuna"]);
  it("pulls in ancestors and hangs each child under the legal father", () => {
    expect(forest[0]!.slug).toBe("shantanu");
    const pandu = forest[0]!.children[0]!.children[0]!;
    expect(pandu.slug).toBe("pandu");
    expect(pandu.children.map((c) => c.slug)).toEqual(["arjuna"]);
  });
  it("keeps divine and biological fathers as annotations, not dropped", () => {
    const pandu = forest[0]!.children[0]!.children[0]!;
    expect(pandu.otherParents.map((p) => [p.slug, p.mode])).toEqual([["vyasa", "biological"]]);
    const arjuna = pandu.children[0]!;
    expect(arjuna.otherParents.map((p) => [p.slug, p.mode]).sort()).toEqual([
      ["indra", "divine"],
      ["kunti", "biological"],
    ]);
  });
  it("shows partners and co-parents, but not divine fathers as partners", () => {
    const pandu = forest[0]!.children[0]!.children[0]!;
    expect(pandu.partners).toEqual(["kunti"]);
  });
  it("never repeats a person", () => {
    expect(countNodes(forest)).toBe(new Set(["shantanu", "vichitravirya", "pandu", "arjuna"]).size);
  });
});
