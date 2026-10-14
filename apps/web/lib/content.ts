// Loads and validates content/ once per server process (at build time for static pages).
// Fails the build if content is invalid, so a bad record can never reach the site.
import "server-only";
import { loadContent } from "@kala/schema/load";
import { join } from "node:path";
import { cache } from "react";
import { buildKala } from "./graph/kala";
import { buildSearchIndex } from "./search/search";

const CONTENT_DIR = join(process.cwd(), "..", "..", "content");

let pending: ReturnType<typeof load> | undefined;

async function load() {
  const { dataset, issues } = await loadContent(CONTENT_DIR);
  if (issues.length > 0) {
    const list = issues.map((i) => `  ${i.file}: ${i.message}`).join("\n");
    throw new Error(`content/ has ${issues.length} issue(s):\n${list}`);
  }
  const kala = buildKala(dataset);
  return { kala, searchIndex: buildSearchIndex(kala) };
}

export const getContent = cache(() => (pending ??= load()));

export async function getKala() {
  return (await getContent()).kala;
}
