import { z } from "zod";

/** Lowercase kebab-case identifier, stable across releases (used in URLs). */
export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case (a-z, 0-9, -)");
export type Slug = z.infer<typeof Slug>;

const NonEmpty = z.string().trim().min(1);

/** A name in one language and script. IAST is required whenever the name is Sanskrit. */
export const Name = z
  .strictObject({
    text: NonEmpty,
    /** ISO 639 code: en, hi, sa (Sanskrit), pi (Pali), pra (Prakrit), ta, … */
    lang: z.string().regex(/^[a-z]{2,3}$/, "lang must be an ISO 639 code"),
    /** ISO 15924 code: Latn, Deva, Taml, … */
    script: z.string().regex(/^[A-Z][a-z]{3}$/, "script must be an ISO 15924 code"),
    /** IAST transliteration (for Sanskrit, Pali and Prakrit names). */
    iast: NonEmpty.optional(),
    /** Literal meaning / gloss, in English. */
    meaning: NonEmpty.optional(),
  })
  .superRefine((n, ctx) => {
    if (["sa", "pi", "pra"].includes(n.lang) && !n.iast) {
      ctx.addIssue({
        code: "custom",
        path: ["iast"],
        message: "Indic-classical names need an IAST transliteration",
      });
    }
  });
export type Name = z.infer<typeof Name>;

/** Names list: at least one name, and at least one English display name. */
export const Names = z
  .array(Name)
  .min(1)
  .superRefine((names, ctx) => {
    if (!names.some((n) => n.lang === "en")) {
      ctx.addIssue({
        code: "custom",
        message: "names must include an English (lang: en) display name",
      });
    }
  });

/** A pointer into a Source: which edition, and where in it. Attached to every claim. */
export const Reference = z.strictObject({
  source: Slug,
  /** Book / canto / chapter / verse, or page for secondary scholarship. Required: no vague citations. */
  locator: NonEmpty,
  note: NonEmpty.optional(),
});
export type Reference = z.infer<typeof Reference>;

export const References = z.array(Reference).min(1, "at least one reference is required");

/** Confidence of a scholarly judgement (dates, extents, identifications). */
export const Confidence = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof Confidence>;

/**
 * A sourced link from one record to another record (e.g. place → kingdom).
 * Every arrow in the navigation graph carries a why and a source (principle 5).
 */
export const Association = z.strictObject({
  to: Slug,
  note: NonEmpty,
  references: References,
});
export type Association = z.infer<typeof Association>;

export const Summary = NonEmpty;
export { NonEmpty };
