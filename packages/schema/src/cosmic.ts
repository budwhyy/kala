import { z } from "zod";
import { Names, NonEmpty, References, Slug, Summary } from "./common";
import { YugaName } from "./time";

/**
 * One tradition's account of the cosmic cycle (yugas → mahayuga → manvantara → kalpa).
 * Figures vary between texts, so each model is tied to a variant and cited. lib/time does the
 * arithmetic from these numbers; nothing is hardcoded in code.
 */
export const CosmicCycleModel = z
  .strictObject({
    slug: Slug,
    names: Names,
    variant: Slug,
    summary_beginner: Summary,
    /** Human years per divine year, when the text states the conversion. */
    human_years_per_divine_year: z.int().min(1).optional(),
    /** Yugas in cycle order (satya → kali), lengths in divine years. */
    yugas: z
      .array(
        z.strictObject({
          yuga: YugaName,
          divine_years: z.int().min(1),
          /** Twilight periods, when the text gives them separately (included in divine_years). */
          dawn_divine_years: z.int().min(0).optional(),
          dusk_divine_years: z.int().min(0).optional(),
          references: References,
        }),
      )
      .length(4),
    mahayugas_per_manvantara: z.int().min(1),
    manvantaras_per_kalpa: z.int().min(1),
    /** Mahayugas per kalpa, if the text states it directly (it may not equal the product above). */
    mahayugas_per_kalpa: z.int().min(1).optional(),
    /** Sandhi periods between manvantaras, if the text describes them. */
    sandhi_note: NonEmpty.optional(),
    manvantaras: z
      .array(
        z.strictObject({
          ordinal: z.int().min(1),
          names: Names,
          manu: Slug.optional(),
          references: References,
        }),
      )
      .default([]),
    pralaya: z
      .array(
        z.strictObject({
          kind: NonEmpty,
          names: Names,
          explanation: Summary,
          references: References,
        }),
      )
      .default([]),
    references: References,
  })
  .superRefine((m, ctx) => {
    const order = ["satya", "treta", "dvapara", "kali"];
    if (m.yugas.some((y, i) => y.yuga !== order[i])) {
      ctx.addIssue({
        code: "custom",
        path: ["yugas"],
        message: "yugas must be listed in order satya, treta, dvapara, kali",
      });
    }
    for (const [i, y] of m.yugas.entries()) {
      if ((y.dawn_divine_years ?? 0) + (y.dusk_divine_years ?? 0) > y.divine_years) {
        ctx.addIssue({
          code: "custom",
          path: ["yugas", i],
          message: "twilights cannot exceed the yuga length",
        });
      }
    }
    const ordinals = m.manvantaras.map((x) => x.ordinal);
    if (new Set(ordinals).size !== ordinals.length) {
      ctx.addIssue({
        code: "custom",
        path: ["manvantaras"],
        message: "manvantara ordinals must be unique",
      });
    }
    if (ordinals.some((o) => o > m.manvantaras_per_kalpa)) {
      ctx.addIssue({
        code: "custom",
        path: ["manvantaras"],
        message: "manvantara ordinal exceeds manvantaras_per_kalpa",
      });
    }
  });
export type CosmicCycleModel = z.infer<typeof CosmicCycleModel>;
