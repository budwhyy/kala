CREATE TABLE "battlefields" (
	"slug" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"slug" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cosmic_models" (
	"slug" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dynasties" (
	"slug" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "legendary_dynasty_undated" CHECK ("dynasties"."kind" <> 'legendary' OR jsonb_typeof("dynasties"."data" -> 'historical_time') IS DISTINCT FROM 'object')
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"slug" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"kinds" text[] NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "entity_has_references" CHECK (COALESCE(jsonb_array_length("entities"."data" -> 'references'), 0) >= 1)
);
--> statement-breakpoint
CREATE TABLE "events" (
	"slug" text PRIMARY KEY NOT NULL,
	"variant_slug" text,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kingdoms" (
	"slug" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"extent" geometry(Geometry, 4326),
	"data" jsonb NOT NULL,
	CONSTRAINT "legendary_kingdom_undated" CHECK ("kingdoms"."kind" <> 'epic_legendary' OR jsonb_typeof("kingdoms"."data" -> 'historical_time') IS DISTINCT FROM 'object')
);
--> statement-breakpoint
CREATE TABLE "links" (
	"from_type" text NOT NULL,
	"from_slug" text NOT NULL,
	"to_type" text NOT NULL,
	"to_slug" text NOT NULL,
	"role" text NOT NULL,
	CONSTRAINT "links_from_type_from_slug_to_type_to_slug_role_pk" PRIMARY KEY("from_type","from_slug","to_type","to_slug","role")
);
--> statement-breakpoint
CREATE TABLE "names" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_type" text NOT NULL,
	"owner_slug" text NOT NULL,
	"text" text NOT NULL,
	"lang" text NOT NULL,
	"script" text NOT NULL,
	"iast" text,
	"rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"slug" text PRIMARY KEY NOT NULL,
	"realm" text NOT NULL,
	"kind" text NOT NULL,
	"confidence" text NOT NULL,
	"geom" geometry(Geometry, 4326),
	"data" jsonb NOT NULL,
	CONSTRAINT "cosmological_place_has_no_geometry" CHECK ("places"."realm" <> 'cosmological' OR "places"."geom" IS NULL),
	CONSTRAINT "mythical_place_has_no_geometry" CHECK ("places"."confidence" <> 'mythical' OR "places"."geom" IS NULL),
	CONSTRAINT "place_confidence_class" CHECK ("places"."confidence" IN ('verified', 'traditional', 'debated', 'mythical'))
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"from_slug" text NOT NULL,
	"to_slug" text NOT NULL,
	"type" text NOT NULL,
	"variant_slug" text,
	"data" jsonb NOT NULL,
	CONSTRAINT "relationship_has_references" CHECK (COALESCE(jsonb_array_length("relationships"."data" -> 'references'), 0) >= 1),
	CONSTRAINT "relationship_not_self" CHECK ("relationships"."from_slug" <> "relationships"."to_slug")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"slug" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"kind" text NOT NULL,
	"licence" text NOT NULL,
	"text_slug" text,
	"data" jsonb NOT NULL,
	CONSTRAINT "translations_are_open" CHECK ("sources"."kind" <> 'translation' OR "sources"."licence" IN ('public_domain', 'open_licence'))
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"slug" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traditions" (
	"slug" text PRIMARY KEY NOT NULL,
	"family" text NOT NULL,
	"parent_slug" text,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"slug" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"tradition_slug" text NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_variant_slug_variants_slug_fk" FOREIGN KEY ("variant_slug") REFERENCES "public"."variants"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_from_slug_entities_slug_fk" FOREIGN KEY ("from_slug") REFERENCES "public"."entities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_to_slug_entities_slug_fk" FOREIGN KEY ("to_slug") REFERENCES "public"."entities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_variant_slug_variants_slug_fk" FOREIGN KEY ("variant_slug") REFERENCES "public"."variants"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_tradition_slug_traditions_slug_fk" FOREIGN KEY ("tradition_slug") REFERENCES "public"."traditions"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kingdoms_extent_idx" ON "kingdoms" USING gist ("extent");--> statement-breakpoint
CREATE INDEX "links_to_idx" ON "links" USING btree ("to_type","to_slug");--> statement-breakpoint
CREATE INDEX "names_owner_idx" ON "names" USING btree ("owner_type","owner_slug");--> statement-breakpoint
CREATE INDEX "names_text_trgm_idx" ON "names" USING gin ("text" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "names_iast_trgm_idx" ON "names" USING gin ("iast" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "places_geom_idx" ON "places" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "relationships_from_idx" ON "relationships" USING btree ("from_slug");--> statement-breakpoint
CREATE INDEX "relationships_to_idx" ON "relationships" USING btree ("to_slug");