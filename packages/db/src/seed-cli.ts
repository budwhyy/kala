// Validate content/, apply migrations, and replace the database contents.
// Usage: DATABASE_URL=postgres://… pnpm --filter @kala/db db:seed
import { loadContent } from "@kala/schema/load";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import postgres from "postgres";
import * as t from "./schema";
import { seed, type KalaDb } from "./seed";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (see .env.example).");
  process.exit(1);
}

const { dataset, issues } = await loadContent(resolve(import.meta.dirname, "../../../content"));
if (issues.length > 0) {
  console.error(
    `Refusing to seed: content has ${issues.length} issue(s). Run pnpm validate:content.`,
  );
  process.exit(1);
}

const client = postgres(url, { max: 1 });
try {
  const db = drizzle(client, { schema: t });
  await migrate(db, { migrationsFolder: resolve(import.meta.dirname, "../drizzle") });
  await seed(db as unknown as KalaDb, dataset);
  console.log(`Seeded ${dataset.entities.length} entities, ${dataset.places.length} places.`);
} finally {
  await client.end();
}
