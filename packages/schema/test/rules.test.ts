// §4.4 rules, one block per rule, plus the related guards from §2 and §10.
import { describe, expect, it } from "vitest";
import {
  Dynasty,
  Entity,
  Kingdom,
  Name,
  Place,
  Relationship,
  Source,
  validateDataset,
  type Dataset,
} from "../src";
import { baseRecords, dataset, raw } from "./fixtures";

const messages = (ds: Dataset) => validateDataset(ds).map((i) => i.message);
const accepts = (schema: { safeParse: (v: unknown) => { success: boolean } }, v: unknown) =>
  schema.safeParse(v).success;

describe("§4.4 a Relationship without a Reference fails", () => {
  it("rejects an empty references list", () => {
    expect(accepts(Relationship, raw.parent("rel-x", "a", "b", { references: [] }))).toBe(false);
  });
  it("rejects missing references", () => {
    const { references: _omit, ...r } = raw.parent("rel-x", "a", "b");
    expect(accepts(Relationship, r)).toBe(false);
  });
  it("rejects a reference without a locator", () => {
    const r = raw.parent("rel-x", "a", "b", {
      references: [{ source: "fixture-source", locator: "" }],
    });
    expect(accepts(Relationship, r)).toBe(false);
  });
  it("rejects a reference to an unknown source", () => {
    const records = baseRecords();
    records.relationships = [
      raw.parent("rel-1", "fixture-parent", "fixture-child", {
        references: [{ source: "no-such-source", locator: "1" }],
      }),
    ];
    expect(messages(dataset(records))).toContain("reference → unknown sources 'no-such-source'");
  });
  it("accepts a sourced relationship", () => {
    expect(validateDataset(dataset(baseRecords()))).toEqual([]);
  });
});

describe("§4.4 a cosmological Place with geometry fails", () => {
  it("rejects a cosmological place with coordinates", () => {
    const p = raw.cosmologicalPlace({ geometry: { type: "Point", coordinates: [80, 30] } });
    expect(accepts(Place, p)).toBe(false);
  });
  it("accepts a cosmological place without coordinates", () => {
    expect(accepts(Place, raw.cosmologicalPlace())).toBe(true);
  });
  it("rejects coordinates hidden in an alternative identification", () => {
    const p = raw.cosmologicalPlace({
      alternative_identifications: [
        {
          label: "x",
          confidence: "debated",
          geometry: { type: "Point", coordinates: [80, 30] },
          argument: "x",
          references: raw.ref,
        },
      ],
    });
    expect(accepts(Place, p)).toBe(false);
  });
  it("rejects a cosmological place with a modern location or a non-mythical confidence", () => {
    expect(accepts(Place, raw.cosmologicalPlace({ modern_admin: { country: "X" } }))).toBe(false);
    expect(accepts(Place, raw.cosmologicalPlace({ confidence: "traditional" }))).toBe(false);
  });
});

describe("§4.4 an epic_legendary Kingdom with HistoricalTime fails", () => {
  it("rejects historical dates on a legendary kingdom", () => {
    const k = raw.kingdom("fixture-legend", "epic_legendary", {
      historical_time: raw.historicalTime(),
    });
    expect(accepts(Kingdom, k)).toBe(false);
  });
  it("rejects attested rulers on a legendary kingdom", () => {
    const k = raw.kingdom("fixture-legend", "epic_legendary", {
      rulers: [
        { name: { text: "X", lang: "en", script: "Latn" }, attested: true, references: raw.ref },
      ],
    });
    expect(accepts(Kingdom, k)).toBe(false);
  });
  it("requires historical dates on historical polities and forbids cosmic time there", () => {
    const { historical_time: _omit, ...undated } = raw.kingdom(
      "fixture-polity",
      "historical_mahajanapada",
    ) as Record<string, unknown>;
    expect(accepts(Kingdom, undated)).toBe(false);
    const cosmic = raw.kingdom("fixture-polity", "historical_mahajanapada", {
      cosmic_time: [{ variant: "fixture-variant-a", yuga: "kali", references: raw.ref }],
    });
    expect(accepts(Kingdom, cosmic)).toBe(false);
  });
  it("rejects historical dates on a legendary dynasty", () => {
    const d = {
      slug: "fixture-line",
      names: [{ text: "Line", lang: "en", script: "Latn" }],
      kind: "legendary",
      lineage_type: "other",
      traditions: ["fixture-tradition"],
      historical_time: raw.historicalTime(),
      summary_beginner: "x",
      references: raw.ref,
    };
    expect(accepts(Dynasty, d)).toBe(false);
  });
});

describe("§4.4 every Entity has ≥1 relationship and ≥1 source", () => {
  it("rejects an entity without references", () => {
    expect(accepts(Entity, raw.entity("x", { references: [] }))).toBe(false);
  });
  it("flags an entity with no relationships", () => {
    const records = baseRecords();
    records.entities.push(raw.entity("fixture-loner"));
    expect(messages(dataset(records))).toContain("entity has no relationships");
  });
});

describe("§4.4 conflicting relationships only across different variants", () => {
  const withSecondFather = (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const records = baseRecords();
    records.entities.push(raw.entity("fixture-other-parent"));
    records.relationships = [
      raw.parent("rel-1", "fixture-parent", "fixture-child", a),
      raw.parent("rel-2", "fixture-other-parent", "fixture-child", b),
    ];
    return validateDataset(dataset(records));
  };

  it("rejects two fathers with no variants", () => {
    expect(withSecondFather({}, {}).length).toBeGreaterThan(0);
  });
  it("rejects two fathers in the same variant", () => {
    const v = { variant: "fixture-variant-a" };
    expect(withSecondFather(v, v).some((i) => i.message.includes("conflicts with 'rel-1'"))).toBe(
      true,
    );
  });
  it("rejects a variant-less father alongside a variant father", () => {
    expect(withSecondFather({}, { variant: "fixture-variant-b" }).length).toBeGreaterThan(0);
  });
  it("accepts two fathers in different variants", () => {
    expect(
      withSecondFather({ variant: "fixture-variant-a" }, { variant: "fixture-variant-b" }),
    ).toEqual([]);
  });
  it("accepts a biological and a divine father (different modes do not conflict)", () => {
    expect(withSecondFather({}, { mode: "divine" })).toEqual([]);
  });
  it("rejects a symmetric edge stated in both directions", () => {
    const records = baseRecords();
    const sib = (id: string, from: string, to: string) => ({
      id,
      from,
      to,
      type: "sibling",
      explanation: "x",
      references: raw.ref,
    });
    records.relationships.push(
      sib("s-1", "fixture-parent", "fixture-child"),
      sib("s-2", "fixture-child", "fixture-parent"),
    );
    expect(messages(dataset(records))).toContain("duplicates relationship 's-1'");
  });
});

describe("geography guards (principle 9, §8 geo gate)", () => {
  it("rejects a terrestrial place without modern admin or evidence", () => {
    expect(accepts(Place, raw.terrestrialPlace({ modern_admin: undefined }))).toBe(false);
    expect(accepts(Place, raw.terrestrialPlace({ evidence: [] }))).toBe(false);
  });
  it("rejects 'verified' backed only by tradition", () => {
    const p = raw.terrestrialPlace({
      evidence: [{ type: "traditional", summary: "Local tradition.", references: raw.ref }],
    });
    expect(accepts(Place, p)).toBe(false);
  });
  it("rejects a terrestrial place marked mythical", () => {
    expect(accepts(Place, raw.terrestrialPlace({ confidence: "mythical", geometry: null }))).toBe(
      false,
    );
  });
  it("requires alternatives for a debated place", () => {
    expect(accepts(Place, raw.terrestrialPlace({ confidence: "debated" }))).toBe(false);
  });
  it("rejects out-of-range and unclosed geometries", () => {
    const far = { type: "Point", coordinates: [200, 27] };
    expect(accepts(Place, raw.terrestrialPlace({ geometry: far }))).toBe(false);
    const open = {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ],
    };
    expect(accepts(Place, raw.terrestrialPlace({ geometry: open }))).toBe(false);
  });
  it("links legendary and historical kingdoms of the same name, never two of the same category", () => {
    const records = {
      ...baseRecords(),
      kingdoms: [
        raw.kingdom("fixture-legend", "epic_legendary", { same_name_as: ["fixture-polity"] }),
        raw.kingdom("fixture-polity", "historical_mahajanapada", {
          same_name_as: ["fixture-legend"],
        }),
        raw.kingdom("fixture-empire", "historical_empire", { same_name_as: ["fixture-polity"] }),
      ],
    };
    expect(validateDataset(dataset(records)).map((i) => i.id)).toEqual(["fixture-empire"]);
  });
  it("requires a cosmological counterpart to sit in the other realm", () => {
    const counterpart = (to: string) => [
      { to, relation: "cosmological_counterpart", note: "x", references: raw.ref },
    ];
    const ok = {
      ...baseRecords(),
      places: [
        raw.terrestrialPlace({ related_places: counterpart("fixture-heaven") }),
        raw.cosmologicalPlace(),
      ],
    };
    expect(validateDataset(dataset(ok))).toEqual([]);
    const bad = {
      ...baseRecords(),
      places: [
        raw.terrestrialPlace({ related_places: counterpart("fixture-town-2") }),
        raw.terrestrialPlace({ slug: "fixture-town-2" }),
      ],
    };
    expect(messages(dataset(bad))).toContain(
      "cosmological_counterpart 'fixture-town-2' must be in the other realm",
    );
  });
});

describe("other guards", () => {
  it("rejects unknown fields (typos do not pass silently)", () => {
    expect(accepts(Entity, raw.entity("x", { fatehr: "y" }))).toBe(false);
  });
  it("requires an English display name, and IAST for Sanskrit names", () => {
    const sanskritOnly = [{ text: "कश्यप", lang: "sa", script: "Deva", iast: "Kaśyapa" }];
    expect(accepts(Entity, raw.entity("x", { names: sanskritOnly }))).toBe(false);
    expect(accepts(Name, { text: "कश्यप", lang: "sa", script: "Deva" })).toBe(false);
  });
  it("rejects a copyrighted translation as a content source (principle 12)", () => {
    expect(accepts(Source, { ...raw.source(), licence: "cited_only" })).toBe(false);
    const scholarship = { ...raw.source(), kind: "secondary_scholarship", licence: "cited_only" };
    expect(accepts(Source, scholarship)).toBe(true);
  });
  it("rejects year 0 and reversed ranges in historical time", () => {
    const k = (t: Record<string, unknown>) =>
      raw.kingdom("fixture-polity", "historical_regional", {
        historical_time: { ...raw.historicalTime(), ...t },
      });
    expect(accepts(Kingdom, k({ start: 0 }))).toBe(false);
    expect(accepts(Kingdom, k({ start: 100, end: 50 }))).toBe(false);
  });
  it("keeps tradition families distinct (principle 11)", () => {
    const records = {
      ...baseRecords(),
      traditions: [
        raw.tradition(),
        raw.tradition("fixture-school", "buddhist", "fixture-tradition"),
      ],
    };
    expect(messages(dataset(records)).some((m) => m.includes("traditions stay distinct"))).toBe(
      true,
    );
  });
  it("requires every cosmic time to name an existing variant", () => {
    const records = baseRecords();
    records.entities[0] = raw.entity("fixture-parent", {
      cosmic_time: [{ variant: "no-such-variant", yuga: "treta", references: raw.ref }],
    });
    expect(messages(dataset(records))).toContain(
      "cosmic_time.variant → unknown variants 'no-such-variant'",
    );
  });
  it("rejects self-references, and role/mode on non-parent types", () => {
    expect(accepts(Relationship, raw.parent("r", "a", "a"))).toBe(false);
    expect(accepts(Relationship, { ...raw.parent("r", "a", "b"), type: "ally" })).toBe(false);
  });
});
