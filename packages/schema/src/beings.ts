import { z } from "zod";
import { Association, Name, Names, NonEmpty, References, Slug, Summary } from "./common";
import { CosmicTime, HistoricalTime } from "./time";

export const EntityKind = z.enum([
  "deity",
  "deva",
  "asura",
  "daitya",
  "danava",
  "naga",
  "suparna",
  "rishi",
  "prajapati",
  "manu",
  "human",
  "king",
  "gandharva",
  "apsara",
  "yaksha",
  "rakshasa",
  "vanara",
  "principle",
  "other",
]);
export type EntityKind = z.infer<typeof EntityKind>;

/** A character, deity, sage or other being. */
export const Entity = z.strictObject({
  slug: Slug,
  names: Names,
  epithets: z.array(Name).default([]),
  kinds: z.array(EntityKind).min(1),
  traditions: z.array(Slug).min(1),
  dynasties: z.array(Association).default([]),
  summary_beginner: Summary,
  summary_scholar: Summary.optional(),
  cosmic_time: z.array(CosmicTime).default([]),
  /** Only for historically attested people. Never for mythological figures (principle 4). */
  historical_time: z.array(HistoricalTime).default([]),
  references: References,
});
export type Entity = z.infer<typeof Entity>;

/**
 * Relationship types. Directed types read "from <type> to":
 *   parent: from is a parent of to · teacher: from taught to · curse: from cursed to
 *   avatar_of: from is an avatar of to · vahana_of: from is the mount of to
 *   member_of: from is one of the group to (e.g. a named Vasu → vasus), per variant when lists differ
 * Inverses (child, disciple) are derived, never stored.
 */
export const RelationshipType = z.enum([
  "parent",
  "partner",
  "sibling",
  "teacher",
  "ally",
  "enemy",
  "curse",
  "blessing",
  "avatar_of",
  "manifestation_of",
  "aspect_of",
  "identified_with",
  "vahana_of",
  "descendant_of",
  "member_of",
]);
export type RelationshipType = z.infer<typeof RelationshipType>;

export const SYMMETRIC_TYPES: ReadonlySet<RelationshipType> = new Set([
  "partner",
  "sibling",
  "ally",
  "enemy",
  "identified_with",
]);

export const ParentRole = z.enum(["father", "mother"]);
/** How parenthood is described in the source. Different modes never conflict with each other. */
export const ParentMode = z.enum([
  "biological",
  "mind_born",
  "divine",
  "legal",
  "adoptive",
  "foster",
  "other",
]);

export const Relationship = z
  .strictObject({
    /** Stable id, unique across all relationships. */
    id: Slug,
    from: Slug,
    to: Slug,
    type: RelationshipType,
    /** Required for type parent. */
    role: ParentRole.optional(),
    /** Required for type parent. */
    mode: ParentMode.optional(),
    /** Generations between from and to, for descendant_of, when the source states it. */
    generations: z.int().min(1).optional(),
    /**
     * The account this claim belongs to. Omit only when the claim is not disputed in the sources we hold.
     * Conflicting claims must each carry a different variant.
     */
    variant: Slug.optional(),
    explanation: Summary,
    references: References,
  })
  .superRefine((r, ctx) => {
    if (r.from === r.to) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "a relationship cannot point to itself",
      });
    }
    if (r.type === "parent") {
      if (!r.role)
        ctx.addIssue({
          code: "custom",
          path: ["role"],
          message: "parent relationships need a role",
        });
      if (!r.mode)
        ctx.addIssue({
          code: "custom",
          path: ["mode"],
          message: "parent relationships need a mode",
        });
    } else if (r.role || r.mode) {
      ctx.addIssue({
        code: "custom",
        path: ["role"],
        message: "role/mode only apply to parent relationships",
      });
    }
    if (r.generations !== undefined && r.type !== "descendant_of") {
      ctx.addIssue({
        code: "custom",
        path: ["generations"],
        message: "generations only applies to descendant_of",
      });
    }
  });
export type Relationship = z.infer<typeof Relationship>;

/** A narrative event. Events have cosmic positions and narrative order, never historical dates. */
export const Event = z.strictObject({
  slug: Slug,
  names: Names,
  participants: z.array(z.strictObject({ entity: Slug, role: NonEmpty.optional() })).min(1),
  places: z.array(Slug).default([]),
  cosmic_time: CosmicTime.optional(),
  narrative_order: z
    .strictObject({
      text: Slug,
      /** Ordinal position within the text's narrative. */
      position: z.int().min(0),
      /** Section id from the text's structure. */
      section: Slug.optional(),
    })
    .optional(),
  variant: Slug.optional(),
  traditions: z.array(Slug).default([]),
  summary_beginner: Summary,
  summary_scholar: Summary.optional(),
  references: References,
});
export type Event = z.infer<typeof Event>;

export const Dynasty = z
  .strictObject({
    slug: Slug,
    names: Names,
    kind: z.enum(["legendary", "historical"]),
    lineage_type: z.enum(["suryavansha", "chandravansha", "yadava", "kuru", "other"]),
    founders: z.array(Slug).default([]),
    kingdoms: z.array(Association).default([]),
    variant: Slug.optional(),
    traditions: z.array(Slug).min(1),
    historical_time: HistoricalTime.optional(),
    summary_beginner: Summary,
    summary_scholar: Summary.optional(),
    references: References,
  })
  .superRefine((d, ctx) => {
    if (d.kind === "legendary" && d.historical_time) {
      ctx.addIssue({
        code: "custom",
        path: ["historical_time"],
        message: "legendary dynasties cannot carry historical dates (principle 4)",
      });
    }
  });
export type Dynasty = z.infer<typeof Dynasty>;

/** A philosophical concept, explained per school. */
export const Concept = z.strictObject({
  slug: Slug,
  names: Names,
  summary_beginner: Summary,
  interpretations: z
    .array(
      z.strictObject({
        tradition: Slug,
        explanation: Summary,
        references: References,
      }),
    )
    .min(1),
  related: z.array(Slug).default([]),
});
export type Concept = z.infer<typeof Concept>;
