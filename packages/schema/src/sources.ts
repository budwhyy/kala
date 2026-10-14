import { z } from "zod";
import { Names, NonEmpty, References, Slug, Summary } from "./common";
import { HistoricalTime } from "./time";

/**
 * A Text is a work (the Mahabharata, the Vishnu Purana).
 * A Source is a specific edition or translation of a work, or a piece of scholarship.
 * References always point at a Source, so every claim names the exact edition used.
 */

export const TextSection: z.ZodType<TextSection> = z.lazy(() =>
  z.strictObject({
    id: Slug,
    label: NonEmpty,
    sections: z.array(TextSection).optional(),
  }),
);
export type TextSection = { id: string; label: string; sections?: TextSection[] | undefined };

export const Text = z.strictObject({
  slug: Slug,
  names: Names,
  genre: z.enum([
    "veda",
    "brahmana",
    "aranyaka",
    "upanishad",
    "itihasa",
    "purana",
    "agama",
    "tantra",
    "sutra",
    "darshana",
    "kavya",
    "buddhist_canon",
    "jain_canon",
    "other",
  ]),
  original_language: z.string().regex(/^[a-z]{2,3}$/),
  traditions: z.array(Slug).min(1),
  /** Academic composition window, with confidence and references to the scholarship. */
  composition: HistoricalTime.optional(),
  /** Structural divisions (kandas, parvas, cantos) used by the Epic mode. */
  sections: z.array(TextSection).default([]),
  summary_beginner: Summary,
  summary_scholar: Summary.optional(),
});
export type Text = z.infer<typeof Text>;

/**
 * Licence of the edition we rely on.
 * - public_domain / open_licence: may be quoted.
 * - cited_only: modern scholarship or critical editions cited by locator, never reproduced.
 */
export const Licence = z.enum(["public_domain", "open_licence", "cited_only"]);

export const Source = z
  .strictObject({
    slug: Slug,
    title: NonEmpty,
    /** The work this edition is of. Absent for secondary scholarship about many works. */
    text: Slug.optional(),
    kind: z.enum([
      "translation",
      "original_edition",
      "critical_edition",
      "secondary_scholarship",
      "reference_work",
    ]),
    /** Author, translator or editor as printed. */
    creators: z.array(NonEmpty).min(1),
    /** Language of this edition (ISO 639). */
    language: z.string().regex(/^[a-z]{2,3}$/),
    published: z.strictObject({
      year: z.int(),
      /** Some multi-volume editions span years. */
      end_year: z.int().optional(),
      publisher: NonEmpty.optional(),
      place: NonEmpty.optional(),
    }),
    licence: Licence,
    /** How the licence status was verified (e.g. "published 1883–1896; author d. 1908; PD worldwide"). */
    licence_note: NonEmpty,
    url: z.url().optional(),
    traditions: z.array(Slug).default([]),
  })
  .superRefine((s, ctx) => {
    if (s.kind === "translation" && s.licence === "cited_only") {
      ctx.addIssue({
        code: "custom",
        path: ["licence"],
        message:
          "translations relied on for content must be public-domain or openly licensed (principle 12)",
      });
    }
  });
export type Source = z.infer<typeof Source>;

/**
 * A tradition, school or regional/cross-cultural lineage.
 * `family` keeps Hindu, Buddhist, Jain and Indigenous traditions distinct (principle 11).
 */
export const TraditionFamily = z.enum([
  "vedic",
  "hindu",
  "buddhist",
  "jain",
  "indigenous",
  "cross_cultural",
]);

export const Tradition = z
  .strictObject({
    slug: Slug,
    names: Names,
    family: TraditionFamily,
    parent: Slug.optional(),
    region: NonEmpty.optional(),
    summary_beginner: Summary,
    /** Required for indigenous traditions: who documented this and how. */
    sourcing_note: NonEmpty.optional(),
    references: References,
  })
  .superRefine((t, ctx) => {
    if (t.family === "indigenous" && !t.sourcing_note) {
      ctx.addIssue({
        code: "custom",
        path: ["sourcing_note"],
        message: "indigenous traditions need a sourcing note",
      });
    }
  });
export type Tradition = z.infer<typeof Tradition>;

/**
 * A named account: one text's or one tradition's version of a story, genealogy or list.
 * Conflicting claims are allowed only when they belong to different variants.
 */
export const Variant = z.strictObject({
  slug: Slug,
  names: Names,
  kind: z.enum(["account", "genealogy", "list", "creation_pathway", "cosmic_model"]),
  tradition: Slug,
  text: Slug.optional(),
  description: Summary,
  references: References,
});
export type Variant = z.infer<typeof Variant>;
