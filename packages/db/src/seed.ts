import type { Dataset } from "@kala/schema";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { toRows } from "./rows";
import * as t from "./schema";

export type KalaDb = PgDatabase<PgQueryResultHKT, typeof t>;

const CHUNK = 500;

/**
 * Replace the database contents with `ds` in one transaction.
 * Call only with a dataset that passed loadContent()/validateDataset().
 */
export async function seed(db: KalaDb, ds: Dataset): Promise<void> {
  const rows = toRows(ds);
  await db.transaction(async (tx) => {
    // Children before parents (foreign keys).
    for (const table of [
      t.links,
      t.names,
      t.relationships,
      t.events,
      t.variants,
      t.entities,
      t.traditions,
      t.sources,
      t.texts,
      t.dynasties,
      t.places,
      t.kingdoms,
      t.concepts,
      t.routes,
      t.battlefields,
      t.cosmicModels,
      t.networks,
      t.journeys,
    ]) {
      await tx.delete(table);
    }

    // Parents before children.
    const order: [keyof typeof rows, Parameters<typeof tx.insert>[0]][] = [
      ["sources", t.sources],
      ["texts", t.texts],
      ["traditions", t.traditions],
      ["variants", t.variants],
      ["entities", t.entities],
      ["relationships", t.relationships],
      ["events", t.events],
      ["dynasties", t.dynasties],
      ["places", t.places],
      ["kingdoms", t.kingdoms],
      ["concepts", t.concepts],
      ["routes", t.routes],
      ["battlefields", t.battlefields],
      ["cosmicModels", t.cosmicModels],
      ["networks", t.networks],
      ["journeys", t.journeys],
      ["names", t.names],
      ["links", t.links],
    ];
    for (const [key, table] of order) {
      const list = rows[key] as unknown[];
      for (let i = 0; i < list.length; i += CHUNK) {
        await tx.insert(table).values(list.slice(i, i + CHUNK) as never);
      }
    }
  });
}
