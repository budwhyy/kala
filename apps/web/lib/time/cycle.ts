// Cosmic-cycle arithmetic from a CosmicCycleModel (content/cosmic). Every figure comes from the
// model, which cites its text; nothing is hardcoded here. Results are proportions and counts
// inside one tradition's model — never calendar years (principle 4).
import type { CosmicCycleModel, YugaName } from "@kala/schema";

export type YugaShare = {
  yuga: YugaName;
  divineYears: number;
  dawn?: number | undefined;
  dusk?: number | undefined;
  /** Fraction of one mahayuga, 0–1. */
  share: number;
  /** Start angle as a fraction of the mahayuga, 0–1. */
  start: number;
};

export type CycleSummary = {
  slug: string;
  yugas: YugaShare[];
  mahayugaDivineYears: number;
  mahayugasPerManvantara: number;
  /** Null when the text does not state it. */
  manvantarasPerKalpa: number | null;
  /** As stated in the text, if stated. */
  mahayugasPerKalpaStated: number | null;
  /** Product of the two stated counts, when both are stated. May differ from the stated total. */
  mahayugasPerKalpaComputed: number | null;
  /** Divine years → human years, only when the text states a conversion. */
  humanYearsPerDivineYear: number | null;
};

export function summarizeCycle(m: CosmicCycleModel): CycleSummary {
  const total = m.yugas.reduce((s, y) => s + y.divine_years, 0);
  let start = 0;
  const yugas = m.yugas.map((y) => {
    const share = y.divine_years / total;
    const out = {
      yuga: y.yuga,
      divineYears: y.divine_years,
      dawn: y.dawn_divine_years,
      dusk: y.dusk_divine_years,
      share,
      start,
    };
    start += share;
    return out;
  });
  const perKalpa = m.manvantaras_per_kalpa ?? null;
  return {
    slug: m.slug,
    yugas,
    mahayugaDivineYears: total,
    mahayugasPerManvantara: m.mahayugas_per_manvantara,
    manvantarasPerKalpa: perKalpa,
    mahayugasPerKalpaStated: m.mahayugas_per_kalpa ?? null,
    mahayugasPerKalpaComputed: perKalpa === null ? null : perKalpa * m.mahayugas_per_manvantara,
    humanYearsPerDivineYear: m.human_years_per_divine_year ?? null,
  };
}
