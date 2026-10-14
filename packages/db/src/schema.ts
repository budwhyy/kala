// Postgres + PostGIS schema. YAML in content/ is the source of truth; these tables are a
// derived, queryable copy rebuilt by the seed runner. Each table keeps the full validated record
// in `data` (jsonb) and lifts out the columns needed for joins, filters, spatial and text search.
// The §4.4 rules that can be expressed in SQL are repeated here as CHECK constraints so the
// database refuses bad rows even if something bypasses the Zod layer.
import type { Geometry } from "@kala/schema";
import { sql } from "drizzle-orm";
import {
  check,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

/** PostGIS geometry in WGS 84. Written from GeoJSON; read back with ST_AsGeoJSON. */
export const geometry = customType<{ data: Geometry; driverData: string }>({
  dataType() {
    return "geometry(Geometry, 4326)";
  },
  toDriver(value) {
    return sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(value)}), 4326)`;
  },
});

const slug = () => text("slug").primaryKey();
const data = () => jsonb("data").notNull();
const hasReferences = (table: { data: unknown }) =>
  sql`COALESCE(jsonb_array_length(${table.data} -> 'references'), 0) >= 1`;

export const sources = pgTable(
  "sources",
  {
    slug: slug(),
    title: text("title").notNull(),
    kind: text("kind").notNull(),
    licence: text("licence").notNull(),
    textSlug: text("text_slug"),
    data: data(),
  },
  (t) => [
    check(
      "translations_are_open",
      sql`${t.kind} <> 'translation' OR ${t.licence} IN ('public_domain', 'open_licence')`,
    ),
  ],
);

export const texts = pgTable("texts", { slug: slug(), data: data() });

export const traditions = pgTable("traditions", {
  slug: slug(),
  family: text("family").notNull(),
  parentSlug: text("parent_slug"),
  data: data(),
});

export const variants = pgTable("variants", {
  slug: slug(),
  kind: text("kind").notNull(),
  traditionSlug: text("tradition_slug")
    .notNull()
    .references(() => traditions.slug),
  data: data(),
});

export const entities = pgTable(
  "entities",
  {
    slug: slug(),
    displayName: text("display_name").notNull(),
    kinds: text("kinds").array().notNull(),
    data: data(),
  },
  (t) => [check("entity_has_references", hasReferences(t))],
);

export const relationships = pgTable(
  "relationships",
  {
    id: text("id").primaryKey(),
    fromSlug: text("from_slug")
      .notNull()
      .references(() => entities.slug),
    toSlug: text("to_slug")
      .notNull()
      .references(() => entities.slug),
    type: text("type").notNull(),
    variantSlug: text("variant_slug").references(() => variants.slug),
    data: data(),
  },
  (t) => [
    index("relationships_from_idx").on(t.fromSlug),
    index("relationships_to_idx").on(t.toSlug),
    check("relationship_has_references", hasReferences(t)),
    check("relationship_not_self", sql`${t.fromSlug} <> ${t.toSlug}`),
  ],
);

export const events = pgTable("events", {
  slug: slug(),
  variantSlug: text("variant_slug").references(() => variants.slug),
  data: data(),
});

export const dynasties = pgTable(
  "dynasties",
  { slug: slug(), kind: text("kind").notNull(), data: data() },
  (t) => [
    check(
      "legendary_dynasty_undated",
      sql`${t.kind} <> 'legendary' OR jsonb_typeof(${t.data} -> 'historical_time') IS DISTINCT FROM 'object'`,
    ),
  ],
);

export const places = pgTable(
  "places",
  {
    slug: slug(),
    realm: text("realm").notNull(),
    kind: text("kind").notNull(),
    confidence: text("confidence").notNull(),
    geom: geometry("geom"),
    data: data(),
  },
  (t) => [
    index("places_geom_idx").using("gist", t.geom),
    check(
      "cosmological_place_has_no_geometry",
      sql`${t.realm} <> 'cosmological' OR ${t.geom} IS NULL`,
    ),
    check(
      "mythical_place_has_no_geometry",
      sql`${t.confidence} <> 'mythical' OR ${t.geom} IS NULL`,
    ),
    check(
      "place_confidence_class",
      sql`${t.confidence} IN ('verified', 'traditional', 'debated', 'mythical')`,
    ),
  ],
);

export const kingdoms = pgTable(
  "kingdoms",
  {
    slug: slug(),
    kind: text("kind").notNull(),
    extent: geometry("extent"),
    data: data(),
  },
  (t) => [
    index("kingdoms_extent_idx").using("gist", t.extent),
    check(
      "legendary_kingdom_undated",
      sql`${t.kind} <> 'epic_legendary' OR jsonb_typeof(${t.data} -> 'historical_time') IS DISTINCT FROM 'object'`,
    ),
  ],
);

export const concepts = pgTable("concepts", { slug: slug(), data: data() });
export const routes = pgTable("routes", { slug: slug(), data: data() });
export const battlefields = pgTable("battlefields", { slug: slug(), data: data() });
export const cosmicModels = pgTable("cosmic_models", { slug: slug(), data: data() });

/**
 * Every name of every record, for multilingual search (English, Hindi, Devanagari, IAST).
 * Trigram indexes give fuzzy matching ("kasyapa" finds "Kaśyapa").
 */
export const names = pgTable(
  "names",
  {
    id: serial("id").primaryKey(),
    ownerType: text("owner_type").notNull(),
    ownerSlug: text("owner_slug").notNull(),
    text: text("text").notNull(),
    lang: text("lang").notNull(),
    script: text("script").notNull(),
    iast: text("iast"),
    /** 0 = primary display name. */
    rank: integer("rank").notNull(),
  },
  (t) => [
    index("names_owner_idx").on(t.ownerType, t.ownerSlug),
    index("names_text_trgm_idx").using("gin", sql`${t.text} gin_trgm_ops`),
    index("names_iast_trgm_idx").using("gin", sql`${t.iast} gin_trgm_ops`),
  ],
);

/**
 * The navigation graph (Place ↔ Kingdom ↔ Dynasty ↔ Character ↔ Event ↔ Text ↔ Tradition),
 * flattened from every record's links. Stored once per direction as authored; query both ways.
 */
export const links = pgTable(
  "links",
  {
    fromType: text("from_type").notNull(),
    fromSlug: text("from_slug").notNull(),
    toType: text("to_type").notNull(),
    toSlug: text("to_slug").notNull(),
    /** Field the link came from, e.g. "capitals", "participants". */
    role: text("role").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.fromType, t.fromSlug, t.toType, t.toSlug, t.role] }),
    index("links_to_idx").on(t.toType, t.toSlug),
  ],
);
