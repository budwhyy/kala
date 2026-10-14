// Validate everything under content/. Exits non-zero on any issue.
// Usage: pnpm --filter @kala/schema validate:content [contentDir]
import { resolve } from "node:path";
import { COLLECTION_NAMES } from "./dataset";
import { loadContent } from "./load";

const root = resolve(process.argv[2] ?? resolve(import.meta.dirname, "../../../content"));
const { dataset, issues } = await loadContent(root);

const counts = COLLECTION_NAMES.map((c) => `${c}: ${dataset[c].length}`).join(", ");
console.log(`Loaded ${root}\n  ${counts}`);

if (issues.length > 0) {
  console.error(`\n${issues.length} issue(s):`);
  for (const i of issues) console.error(`  ${i.file}: ${i.message}`);
  process.exit(1);
}
console.log("Content is valid.");
