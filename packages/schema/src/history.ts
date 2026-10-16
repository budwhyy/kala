import { z } from "zod";
import { Names, NonEmpty, References, Slug, Summary } from "./common";
import { Evidence } from "./geo";
import { HistoricalTime } from "./time";

/**
 * A historical period for the atlas (Harappan, Mauryan, Gupta…). Always historical time, dated by
 * evidence, never a cosmic age. Periods may nest.
 */
export const Period = z.strictObject({
  slug: Slug,
  names: Names,
  kind: z.enum(["archaeological_culture", "political", "textual"]),
  parent: Slug.optional(),
  historical_time: HistoricalTime,
  summary_beginner: Summary,
  summary_scholar: Summary.optional(),
  references: References,
});
export type Period = z.infer<typeof Period>;

/**
 * How a story, text or tradition reached another culture (brief §6.8). The type is explicit and
 * never upgraded: a resemblance is not a borrowing unless the sources say so.
 */
export const TransmissionType = z.enum([
  "direct",
  "shared_ancestry",
  "reinterpretation",
  "independent_similarity",
  "uncertain_hypothesis",
]);
export type TransmissionType = z.infer<typeof TransmissionType>;

export const Transmission = z
  .strictObject({
    slug: Slug,
    names: Names,
    type: TransmissionType,
    from_text: Slug.optional(),
    to_text: Slug.optional(),
    from_tradition: Slug.optional(),
    to_tradition: Slug.optional(),
    /** Places used to draw the link on the map (e.g. a site where the telling is attested). */
    from_place: Slug.optional(),
    to_place: Slug.optional(),
    historical_time: HistoricalTime.optional(),
    summary_beginner: Summary,
    summary_scholar: Summary.optional(),
    evidence: z.array(Evidence).default([]),
    references: References,
    note: NonEmpty.optional(),
  })
  .superRefine((t, ctx) => {
    if (!t.from_text && !t.from_tradition)
      ctx.addIssue({
        code: "custom",
        path: ["from_text"],
        message: "a transmission needs from_text or from_tradition",
      });
    if (!t.to_text && !t.to_tradition)
      ctx.addIssue({
        code: "custom",
        path: ["to_text"],
        message: "a transmission needs to_text or to_tradition",
      });
  });
export type Transmission = z.infer<typeof Transmission>;
