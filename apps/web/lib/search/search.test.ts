import { resolve } from "node:path";
import { loadContent } from "@kala/schema/load";
import { beforeAll, describe, expect, it } from "vitest";
import { buildKala, type Kala } from "../graph/kala";
import { buildSearchIndex, fold, search, type SearchItem } from "./search";

let kala: Kala;
let index: SearchItem[];

beforeAll(async () => {
  const { dataset, issues } = await loadContent(
    resolve(import.meta.dirname, "../../../../content"),
  );
  expect(issues).toEqual([]);
  kala = buildKala(dataset);
  index = buildSearchIndex(kala);
});

describe("fold", () => {
  it("strips diacritics and simplifies sh", () => {
    expect(fold("Kaśyapa")).toBe("kasyapa");
    expect(fold("Kashyapa")).toBe("kasyapa");
    expect(fold("Hastināpura")).toBe("hastinapura");
  });
});

describe("search finds records in English, IAST and Devanagari (§6.4)", () => {
  const first = (q: string) => search(index, q)[0]?.slug;
  it.each([
    ["Kashyapa", "kashyapa"],
    ["kasyapa", "kashyapa"],
    ["Kaśyapa", "kashyapa"],
    ["कश्यप", "kashyapa"],
    ["hastinapura", "hastinapura"],
  ])("%s → %s", (q, slug) => {
    expect(first(q)).toBe(slug);
  });
  it("finds Gandhara as a place and as kingdoms", () => {
    const types = new Set(search(index, "gandhara").map((r) => r.type));
    expect(types).toContain("places");
    expect(types).toContain("kingdoms");
  });
});

describe("graph index", () => {
  it("derives reverse relationships (Garuda's parents)", () => {
    const parents = kala
      .relationsOf("garuda")
      .filter((v) => v.relationship.type === "parent" && v.direction === "in")
      .map((v) => v.other)
      .sort();
    expect(parents).toEqual(["kashyapa", "vinata"]);
  });
  it("links Hastinapura → Kuru kingdom → Kuru dynasty in both directions", () => {
    expect(kala.neighbours("places", "hastinapura", "kingdoms")).toContain("kuru-kingdom-epic");
    expect(kala.neighbours("kingdoms", "kuru-kingdom-epic", "places")).toContain("hastinapura");
    expect(kala.neighbours("kingdoms", "kuru-kingdom-epic", "dynasties")).toContain("kuru-dynasty");
  });
});
