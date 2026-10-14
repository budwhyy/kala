import { z } from "zod";
import { Confidence, NonEmpty, References, Slug } from "./common";

/**
 * KĀLA keeps two temporal systems that are never joined on one axis (principle 4):
 *
 * - CosmicTime: ordinal position inside a tradition's cycle model. Not years.
 * - HistoricalTime: academic dating for historically attested things only.
 */

export const YugaName = z.enum(["satya", "treta", "dvapara", "kali"]);
export type YugaName = z.infer<typeof YugaName>;

/** Where in the cycle, relative to creation and dissolution. */
export const CosmicPhase = z.enum(["before_creation", "creation", "within_cycle", "pralaya"]);

export const CosmicTime = z
  .strictObject({
    /** Which account places it here. Required: cosmic positions are always "according to …". */
    variant: Slug,
    phase: CosmicPhase.default("within_cycle"),
    /** Named kalpa, as a slug (e.g. a named kalpa in a Puranic list). */
    kalpa: Slug.optional(),
    /** Ordinal within the kalpa (1–14 in the common Puranic model). */
    manvantara: z.int().min(1).optional(),
    /** Ordinal within the manvantara (1–71 in the common Puranic model). */
    mahayuga: z.int().min(1).optional(),
    yuga: YugaName.optional(),
    /** Ordinal ordering within the smallest unit given. Not a year. */
    sub_position: z.int().min(0).optional(),
    note: NonEmpty.optional(),
    references: References,
  })
  .superRefine((t, ctx) => {
    const positioned =
      t.kalpa !== undefined ||
      t.manvantara !== undefined ||
      t.mahayuga !== undefined ||
      t.yuga !== undefined;
    if (t.phase === "within_cycle" && !positioned) {
      ctx.addIssue({
        code: "custom",
        message:
          "a within_cycle cosmic time needs at least one of kalpa, manvantara, mahayuga, yuga",
      });
    }
  });
export type CosmicTime = z.infer<typeof CosmicTime>;

/**
 * Signed historical year: negative = BCE, positive = CE. There is no year 0.
 */
export const HistoricalYear = z
  .int()
  .refine((y) => y !== 0, "there is no year 0 (use -1 for 1 BCE, 1 for 1 CE)");

export const HistoricalTime = z
  .strictObject({
    start: HistoricalYear,
    end: HistoricalYear,
    precision: z.enum(["year", "decade", "century", "period"]),
    confidence: Confidence,
    note: NonEmpty.optional(),
    references: References,
  })
  .refine((t) => t.start <= t.end, { message: "start must not be after end", path: ["end"] });
export type HistoricalTime = z.infer<typeof HistoricalTime>;
