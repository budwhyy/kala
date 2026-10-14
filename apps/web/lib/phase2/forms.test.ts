import { describe, expect, it } from "vitest";
import type { Relationship } from "@kala/schema";
import { compareLists, formGroups, orderedLists } from "./forms";

const rel = (id: string, from: string, over: Partial<Relationship> = {}): Relationship =>
  ({
    id,
    from,
    to: "vishnu",
    type: "avatar_of",
    explanation: "x",
    references: [{ source: "s", locator: "1" }],
    ...over,
  }) as Relationship;

const rels = [
  rel("a1", "matsya", { variant: "list-a", position: 1 }),
  rel("a2", "kurma", { variant: "list-a", position: 2 }),
  rel("a3", "buddha", { variant: "list-a", position: 3 }),
  rel("b1", "matsya", { variant: "list-b", position: 1 }),
  rel("b2", "kurma", { variant: "list-b", position: 2 }),
  rel("b3", "balarama", { variant: "list-b", position: 3 }),
  rel("loose", "rama", {}),
  rel("asp", "durga", { type: "aspect_of", to: "devi" }),
];

describe("orderedLists", () => {
  it("groups by variant and orders by position; ignores loose relationships", () => {
    const lists = orderedLists(rels);
    expect(lists.map((l) => l.variant)).toEqual(["list-a", "list-b"]);
    expect(lists[0]!.entries.map((e) => e.slug)).toEqual(["matsya", "kurma", "buddha"]);
  });
});

describe("compareLists", () => {
  it("shows which figures appear in every list and where the lists differ", () => {
    const rows = compareLists(orderedLists(rels));
    expect(rows.map((r) => [r.slug, r.inAll])).toEqual([
      ["matsya", true],
      ["kurma", true],
      ["balarama", false],
      ["buddha", false],
    ]);
    expect(rows.find((r) => r.slug === "buddha")!.positions).toEqual({ "list-a": 3 });
  });
});

describe("formGroups", () => {
  it("collects forms that are not list entries, by principal", () => {
    const groups = formGroups(rels);
    expect(groups.map((g) => [g.principal, g.forms.map((f) => f.from)])).toEqual([
      ["devi", ["durga"]],
      ["vishnu", ["rama"]],
    ]);
  });
});
