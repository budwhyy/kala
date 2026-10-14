import { resolve } from "node:path";
import { loadContent } from "@kala/schema/load";
import { describe, expect, it } from "vitest";
import { summarizeCycle } from "./cycle";

describe("summarizeCycle", async () => {
  const { dataset } = await loadContent(resolve(import.meta.dirname, "../../../../content"));

  it("splits each mahayuga by the stated yuga lengths", () => {
    for (const m of dataset.cosmic) {
      const s = summarizeCycle(m);
      expect(s.yugas.map((y) => y.yuga)).toEqual(["satya", "treta", "dvapara", "kali"]);
      expect(s.yugas.reduce((t, y) => t + y.share, 0)).toBeCloseTo(1);
      expect(s.mahayugaDivineYears).toBe(m.yugas.reduce((t, y) => t + y.divine_years, 0));
    }
  });

  it("never invents a figure the text does not state", () => {
    const manu = dataset.cosmic.find((m) => m.manvantaras_per_kalpa === undefined);
    if (manu) {
      const s = summarizeCycle(manu);
      expect(s.manvantarasPerKalpa).toBeNull();
      expect(s.mahayugasPerKalpaComputed).toBeNull();
    }
    for (const m of dataset.cosmic) {
      expect(summarizeCycle(m).humanYearsPerDivineYear).toBe(m.human_years_per_divine_year ?? null);
    }
  });
});
