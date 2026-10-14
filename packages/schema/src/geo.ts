import { z } from "zod";
import {
  Association,
  Confidence,
  Name,
  Names,
  NonEmpty,
  References,
  Slug,
  Summary,
} from "./common";
import { CosmicTime, HistoricalTime } from "./time";

// ---------------------------------------------------------------- GeoJSON (WGS 84, [lon, lat])

const Position = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
const LinearRing = z
  .array(Position)
  .min(4)
  .refine((ring) => {
    const a = ring[0];
    const b = ring[ring.length - 1];
    return a !== undefined && b !== undefined && a[0] === b[0] && a[1] === b[1];
  }, "polygon rings must be closed (first position = last position)");

const Point = z.strictObject({ type: z.literal("Point"), coordinates: Position });
const MultiPoint = z.strictObject({
  type: z.literal("MultiPoint"),
  coordinates: z.array(Position).min(1),
});
const LineString = z.strictObject({
  type: z.literal("LineString"),
  coordinates: z.array(Position).min(2),
});
const MultiLineString = z.strictObject({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(Position).min(2)).min(1),
});
const Polygon = z.strictObject({
  type: z.literal("Polygon"),
  coordinates: z.array(LinearRing).min(1),
});
const MultiPolygon = z.strictObject({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(LinearRing).min(1)).min(1),
});

export const Geometry = z.discriminatedUnion("type", [
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
]);
export type Geometry = z.infer<typeof Geometry>;

export const AreaGeometry = z.discriminatedUnion("type", [Polygon, MultiPolygon]);
export type AreaGeometry = z.infer<typeof AreaGeometry>;

// ---------------------------------------------------------------- Place

/**
 * The four geographic confidence classes (principle 9):
 * - verified:    identification supported by archaeological or historical evidence
 * - traditional: identification held by living tradition, not independently verified
 * - debated:     competing identifications; see alternative_identifications
 * - mythical:    cosmological or otherwise non-terrestrial; never has coordinates
 * A verified town never verifies the epic events set there.
 */
export const PlaceConfidence = z.enum(["verified", "traditional", "debated", "mythical"]);
export type PlaceConfidence = z.infer<typeof PlaceConfidence>;

export const ModernAdmin = z.strictObject({
  /** Current country, for orientation only. Never implies the ancient place belonged to it. */
  country: NonEmpty,
  region: NonEmpty.optional(),
  district: NonEmpty.optional(),
  nearest_city: NonEmpty.optional(),
});

export const Evidence = z.strictObject({
  type: z.enum(["archaeological", "historical", "textual", "traditional"]),
  summary: Summary,
  references: References,
});

export const AlternativeIdentification = z.strictObject({
  label: NonEmpty,
  confidence: z.enum(["traditional", "debated"]),
  geometry: Geometry.optional(),
  modern_admin: ModernAdmin.optional(),
  argument: Summary,
  references: References,
});

export const Place = z
  .strictObject({
    slug: Slug,
    names: Names,
    realm: z.enum(["terrestrial", "cosmological"]),
    kind: z.enum([
      "city",
      "region",
      "mountain",
      "river",
      "forest",
      "tirtha",
      "site",
      "island",
      "realm",
      "other",
    ]),
    confidence: PlaceConfidence,
    /** GeoJSON, WGS 84. Must be null for cosmological or mythical places. */
    geometry: Geometry.nullable().default(null),
    modern_admin: ModernAdmin.optional(),
    alternative_identifications: z.array(AlternativeIdentification).default([]),
    evidence: z.array(Evidence).default([]),
    kingdoms: z.array(Association).default([]),
    entities: z.array(Association).default([]),
    /** Links to other places, e.g. terrestrial Mount Kailash ↔ cosmological Kailasa. */
    related_places: z
      .array(
        z.strictObject({
          to: Slug,
          relation: z.enum(["cosmological_counterpart", "part_of", "identified_with", "near"]),
          note: NonEmpty,
          references: References,
        }),
      )
      .default([]),
    traditions: z.array(Slug).default([]),
    cosmic_time: z.array(CosmicTime).default([]),
    historical_time: z.array(HistoricalTime).default([]),
    pilgrimage_networks: z
      .array(z.strictObject({ network: Slug, variant: Slug.optional(), references: References }))
      .default([]),
    summary_beginner: Summary,
    summary_scholar: Summary.optional(),
    references: References,
  })
  .superRefine((p, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (p.realm === "cosmological") {
      if (p.geometry !== null) issue("geometry", "cosmological places must not have coordinates");
      if (p.confidence !== "mythical")
        issue("confidence", "cosmological places have confidence 'mythical'");
      if (p.modern_admin) issue("modern_admin", "cosmological places have no modern location");
      if (p.historical_time.length > 0)
        issue("historical_time", "cosmological places have no historical dates");
      if (p.alternative_identifications.some((a) => a.geometry))
        issue("alternative_identifications", "cosmological places must not have coordinates");
    } else {
      if (p.confidence === "mythical")
        issue(
          "confidence",
          "terrestrial places use verified, traditional or debated; use realm 'cosmological'",
        );
      if (!p.modern_admin)
        issue("modern_admin", "terrestrial places need a modern location for orientation");
      if (p.evidence.length === 0)
        issue("evidence", "terrestrial places need at least one evidence item");
      if ((p.confidence === "verified" || p.confidence === "traditional") && p.geometry === null)
        issue("geometry", "verified and traditional places need a geometry");
      if (p.confidence === "debated" && p.alternative_identifications.length === 0)
        issue(
          "alternative_identifications",
          "debated places must list the competing identifications",
        );
    }
    if (
      p.confidence === "verified" &&
      !p.evidence.some((e) => e.type === "archaeological" || e.type === "historical")
    ) {
      issue(
        "evidence",
        "'verified' requires archaeological or historical evidence, not only textual/traditional",
      );
    }
  });
export type Place = z.infer<typeof Place>;

// ---------------------------------------------------------------- Kingdom

export const KingdomKind = z.enum([
  "epic_legendary",
  "historical_mahajanapada",
  "historical_empire",
  "historical_regional",
]);
export type KingdomKind = z.infer<typeof KingdomKind>;

export const Kingdom = z
  .strictObject({
    slug: Slug,
    names: Names,
    /** A legendary kingdom and a historical polity of the same name are separate records. */
    kind: KingdomKind,
    same_name_as: z.array(Slug).default([]),
    /** Approximate extent, rendered as a soft shaded region — never a crisp border. */
    extent: z
      .strictObject({
        geometry: AreaGeometry,
        confidence: Confidence,
        note: NonEmpty,
        references: References,
      })
      .optional(),
    capitals: z.array(Association).default([]),
    rulers: z
      .array(
        z
          .strictObject({
            entity: Slug.optional(),
            name: Name.optional(),
            /** true only when attested in historical evidence (inscriptions, datable records). */
            attested: z.boolean(),
            note: NonEmpty.optional(),
            references: References,
          })
          .refine((r) => r.entity || r.name, "a ruler needs an entity or a name"),
      )
      .default([]),
    neighbours: z.array(Slug).default([]),
    dynasties: z.array(Association).default([]),
    relations: z
      .array(
        z.strictObject({
          kingdom: Slug,
          type: z.enum(["war", "alliance", "marriage", "trade", "succession", "vassalage"]),
          note: NonEmpty,
          variant: Slug.optional(),
          references: References,
        }),
      )
      .default([]),
    traditions: z.array(Slug).default([]),
    historical_time: HistoricalTime.optional(),
    cosmic_time: z.array(CosmicTime).default([]),
    summary_beginner: Summary,
    summary_scholar: Summary.optional(),
    references: References,
  })
  .superRefine((k, ctx) => {
    const issue = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });
    if (k.kind === "epic_legendary") {
      if (k.historical_time)
        issue("historical_time", "epic/legendary kingdoms cannot carry historical dates");
      if (k.rulers.some((r) => r.attested))
        issue("rulers", "rulers of an epic/legendary kingdom cannot be attested");
    } else {
      if (!k.historical_time)
        issue("historical_time", "historical polities need a historical time range");
      if (k.cosmic_time.length > 0)
        issue(
          "cosmic_time",
          "historical polities carry no cosmic time; link the legendary record via same_name_as",
        );
    }
  });
export type Kingdom = z.infer<typeof Kingdom>;

// ---------------------------------------------------------------- Route and Battlefield (literary)

/** An epic journey. Always a literary reconstruction, never a verified itinerary. */
export const Route = z
  .strictObject({
    slug: Slug,
    names: Names,
    text: Slug,
    variant: Slug,
    literary_reconstruction: z.literal(true),
    stops: z
      .array(
        z.strictObject({
          order: z.int().min(0),
          place: Slug,
          event: Slug.optional(),
          note: NonEmpty.optional(),
          references: References,
        }),
      )
      .min(2),
    summary_beginner: Summary,
  })
  .refine((r) => new Set(r.stops.map((s) => s.order)).size === r.stops.length, {
    message: "stop order values must be unique",
    path: ["stops"],
  });
export type Route = z.infer<typeof Route>;

/** A narrative battlefield (Kurukshetra). Formations and encounters are literary, not archaeological. */
export const Battlefield = z.strictObject({
  slug: Slug,
  names: Names,
  place: Slug,
  text: Slug,
  variant: Slug,
  literary: z.literal(true),
  days: z
    .array(
      z.strictObject({
        day: z.int().min(1),
        formations: z
          .array(
            z.strictObject({
              side: NonEmpty,
              name: Name,
              note: NonEmpty.optional(),
              references: References,
            }),
          )
          .default([]),
        encounters: z
          .array(
            z.strictObject({
              participants: z.array(Slug).min(1),
              summary: Summary,
              references: References,
            }),
          )
          .default([]),
        references: References,
      }),
    )
    .min(1),
  summary_beginner: Summary,
});
export type Battlefield = z.infer<typeof Battlefield>;
