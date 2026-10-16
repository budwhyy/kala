// Phase 4: periods, transmissions, evidence sites of historical polities.
import { describe, expect, it } from "vitest";
import { Period, Transmission, validateDataset } from "../src";
import { baseRecords, dataset, raw } from "./fixtures";

const ref = raw.ref;
const en = (text: string) => [{ text, lang: "en", script: "Latn" }];

describe("Period", () => {
  it("needs historical time (never a cosmic age)", () => {
    const p = {
      slug: "p",
      names: en("P"),
      kind: "political",
      summary_beginner: "x",
      references: ref,
    };
    expect(Period.safeParse(p).success).toBe(false);
    expect(Period.safeParse({ ...p, historical_time: raw.historicalTime() }).success).toBe(true);
  });
});

describe("Transmission", () => {
  const t = (extra: Record<string, unknown> = {}) => ({
    slug: "t",
    names: en("T"),
    type: "reinterpretation",
    from_text: "fixture-text",
    to_text: "fixture-text",
    summary_beginner: "x",
    references: ref,
    ...extra,
  });
  it("needs both ends and a known type", () => {
    expect(Transmission.safeParse(t()).success).toBe(true);
    expect(Transmission.safeParse(t({ from_text: undefined })).success).toBe(false);
    expect(Transmission.safeParse(t({ type: "obvious_copy" })).success).toBe(false);
  });
  it("resolves its texts, traditions and places", () => {
    const bad = { ...baseRecords(), transmissions: [t({ to_place: "atlantis" })] };
    expect(validateDataset(dataset(bad)).map((i) => i.message)).toContain(
      "to_place → unknown places 'atlantis'",
    );
  });
});

describe("evidence sites", () => {
  const site = (to: string) => [{ to, note: "x", references: ref }];
  it("are only for historical polities and must be mapped terrestrial places", () => {
    const ok = {
      ...baseRecords(),
      places: [raw.terrestrialPlace()],
      kingdoms: [
        raw.kingdom("fixture-polity", "historical_empire", {
          evidence_sites: site("fixture-town"),
        }),
      ],
    };
    expect(validateDataset(dataset(ok))).toEqual([]);
    const legendary = {
      ...baseRecords(),
      places: [raw.terrestrialPlace()],
      kingdoms: [
        raw.kingdom("fixture-legend", "epic_legendary", { evidence_sites: site("fixture-town") }),
      ],
    };
    expect(
      validateDataset(dataset(legendary)).some((i) =>
        i.message.includes("legendary kingdom has no attested sites"),
      ),
    ).toBe(true);
    const cosmic = {
      ...baseRecords(),
      places: [raw.cosmologicalPlace()],
      kingdoms: [
        raw.kingdom("fixture-polity", "historical_empire", {
          evidence_sites: site("fixture-heaven"),
        }),
      ],
    };
    expect(
      validateDataset(dataset(cosmic)).some((i) =>
        i.message.includes("must be a terrestrial place"),
      ),
    ).toBe(true);
  });
});
