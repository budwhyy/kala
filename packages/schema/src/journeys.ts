import { z } from "zod";
import { Names, NonEmpty, References, Slug, Summary } from "./common";
import { YugaName } from "./time";

/**
 * A pilgrimage network: Char Dham, the Jyotirlingas, the Shakti Peethas, the seven sacred cities,
 * Buddhist or Jain circuits. Membership lives on each Place (`pilgrimage_networks`), tagged with the
 * list variant it comes from, because lists differ between texts and traditions.
 */
export const PilgrimageNetwork = z.strictObject({
  slug: Slug,
  names: Names,
  kind: z.enum([
    "char_dham",
    "jyotirlinga",
    "shakti_peetha",
    "sacred_cities",
    "river_tirtha",
    "himalayan",
    "buddhist",
    "jain",
    "other",
  ]),
  /** The tradition the network belongs to. Networks of different traditions stay separate. */
  traditions: z.array(Slug).min(1),
  /** The named lists (variants of kind `list`) that define membership, when they differ. */
  variants: z.array(Slug).default([]),
  summary_beginner: Summary,
  summary_scholar: Summary.optional(),
  references: References,
});
export type PilgrimageNetwork = z.infer<typeof PilgrimageNetwork>;

/** Collections a journey step may link to. */
export const JourneyLinkCollection = z.enum([
  "entities",
  "places",
  "kingdoms",
  "dynasties",
  "texts",
  "variants",
  "concepts",
  "networks",
  "cosmic",
]);

/**
 * A guided path of steps through the knowledge base (brief §9 "Yuga introduction journey").
 * All text lives here, in content, never in components. Every step cites its sources.
 */
export const Journey = z.strictObject({
  slug: Slug,
  names: Names,
  summary_beginner: Summary,
  steps: z
    .array(
      z.strictObject({
        id: Slug,
        title: NonEmpty,
        /** Plain-English explanation, in the author's words. */
        body: NonEmpty,
        /** Optional second layer for readers who want more depth. */
        detail: NonEmpty.optional(),
        references: References,
        /** Cosmic cycle model this step draws on, if it shows the wheel. */
        cosmic_model: Slug.optional(),
        /** Yuga to highlight on the wheel. */
        focus_yuga: YugaName.optional(),
        links: z
          .array(
            z.strictObject({
              collection: JourneyLinkCollection,
              slug: Slug,
              note: NonEmpty.optional(),
            }),
          )
          .default([]),
      }),
    )
    .min(2),
});
export type Journey = z.infer<typeof Journey>;
