// Applies the real migrations to an in-process Postgres (PGlite) with PostGIS and pg_trgm,
// seeds a synthetic dataset, and checks that the database itself refuses rows that break §4.4.
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { postgis } from "@electric-sql/pglite-postgis";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { baseRecords, dataset, raw } from "../../schema/test/fixtures";
import { seed, tables as t, type KalaDb } from "../src";

let client: PGlite;
let db: ReturnType<typeof drizzle<typeof t>>;

const fixture = () =>
  dataset({
    ...baseRecords(),
    places: [
      raw.terrestrialPlace({
        names: [
          { text: "Fixture Town", lang: "en", script: "Latn" },
          { text: "फ़िक्स्चर", lang: "sa", script: "Deva", iast: "Phiksacara" },
        ],
      }),
      raw.cosmologicalPlace(),
    ],
    kingdoms: [
      raw.kingdom("fixture-legend", "epic_legendary", {
        same_name_as: ["fixture-polity"],
        capitals: [{ to: "fixture-town", note: "Fixture capital.", references: raw.ref }],
      }),
      raw.kingdom("fixture-polity", "historical_mahajanapada", {
        same_name_as: ["fixture-legend"],
      }),
    ],
  });

beforeAll(async () => {
  client = new PGlite({ extensions: { postgis, pg_trgm } });
  db = drizzle(client, { schema: t });
  await migrate(db, { migrationsFolder: resolve(import.meta.dirname, "../drizzle") });
}, 120_000);

afterAll(async () => {
  await client?.close();
});

/** Expect a raw SQL statement to be rejected by a named CHECK constraint. */
async function expectViolation(statement: string, constraint: string) {
  await expect(client.exec(statement)).rejects.toThrow(constraint);
}

describe("migrations", () => {
  it("enable PostGIS and pg_trgm", async () => {
    const { rows } = await client.query<{ v: string }>("SELECT postgis_version() AS v");
    expect(rows[0]?.v).toMatch(/^\d/);
    const ext = await client.query<{ extname: string }>("SELECT extname FROM pg_extension");
    expect(ext.rows.map((r) => r.extname)).toEqual(expect.arrayContaining(["postgis", "pg_trgm"]));
  });
});

describe("seed", () => {
  it("loads every collection, geometry, names and navigation links; is repeatable", async () => {
    await seed(db as unknown as KalaDb, fixture());
    await seed(db as unknown as KalaDb, fixture());

    const count = async (table: string) =>
      (await client.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${table}`)).rows[0]?.n;
    expect(await count("entities")).toBe(2);
    expect(await count("relationships")).toBe(1);
    expect(await count("places")).toBe(2);
    expect(await count("kingdoms")).toBe(2);

    const geo = await client.query<{ slug: string; g: string | null }>(
      "SELECT slug, ST_AsGeoJSON(geom) AS g FROM places ORDER BY slug",
    );
    expect(geo.rows).toEqual([
      { slug: "fixture-heaven", g: null },
      { slug: "fixture-town", g: JSON.stringify({ type: "Point", coordinates: [78, 27] }) },
    ]);

    const links = await db
      .select()
      .from(t.links)
      .where(sql`${t.links.role} = 'capitals'`);
    expect(links).toEqual([
      {
        fromType: "kingdoms",
        fromSlug: "fixture-legend",
        toType: "places",
        toSlug: "fixture-town",
        role: "capitals",
      },
    ]);
  });

  it("supports fuzzy search on names and IAST", async () => {
    const iast = await client.query<{ owner_slug: string }>(
      "SELECT owner_slug FROM names WHERE iast % 'phiksacra'",
    );
    expect(iast.rows.map((r) => r.owner_slug)).toEqual(["fixture-town"]);

    const ranked = await client.query<{ owner_slug: string }>(
      "SELECT owner_slug FROM names WHERE text % 'fixtur town' ORDER BY similarity(text, 'fixtur town') DESC LIMIT 1",
    );
    expect(ranked.rows[0]?.owner_slug).toBe("fixture-town");
  });
});

describe("database-level guards (defence in depth for §4.4)", () => {
  it("refuses geometry on a cosmological place", async () => {
    await expectViolation(
      `INSERT INTO places (slug, realm, kind, confidence, geom, data)
       VALUES ('x-realm', 'cosmological', 'realm', 'mythical', ST_SetSRID(ST_MakePoint(80, 30), 4326), '{}')`,
      "cosmological_place_has_no_geometry",
    );
  });
  it("refuses geometry on a mythical place", async () => {
    await expectViolation(
      `INSERT INTO places (slug, realm, kind, confidence, geom, data)
       VALUES ('x-myth', 'terrestrial', 'site', 'mythical', ST_SetSRID(ST_MakePoint(80, 30), 4326), '{}')`,
      "mythical_place_has_no_geometry",
    );
  });
  it("refuses relationships with empty or missing references", async () => {
    for (const data of [`'{"references": []}'`, `'{}'`]) {
      await expectViolation(
        `INSERT INTO relationships (id, from_slug, to_slug, type, data)
         VALUES ('x-rel', 'fixture-parent', 'fixture-child', 'ally', ${data})`,
        "relationship_has_references",
      );
    }
  });
  it("refuses historical dates on a legendary kingdom", async () => {
    await expectViolation(
      `INSERT INTO kingdoms (slug, kind, data)
       VALUES ('x-legend', 'epic_legendary', '{"historical_time": {"start": -500, "end": -400}}')`,
      "legendary_kingdom_undated",
    );
  });
  it("refuses a copyrighted translation", async () => {
    await expectViolation(
      `INSERT INTO sources (slug, title, kind, licence, data)
       VALUES ('x-src', 'X', 'translation', 'cited_only', '{}')`,
      "translations_are_open",
    );
  });
});
