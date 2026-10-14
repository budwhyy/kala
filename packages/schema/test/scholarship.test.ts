// §8 gate 7: every source cited by content is listed in docs/SOURCES.md, and every edition the
// docs list as a source slug exists in content/sources.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent } from "../src/load";

const root = resolve(import.meta.dirname, "../../..");
const sourcesDoc = readFileSync(resolve(root, "docs/SOURCES.md"), "utf8");

describe("§8 gate 7: scholarship log", async () => {
  const { dataset } = await loadContent(resolve(root, "content"));
  const cited = new Set<string>();
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.source === "string" && typeof o.locator === "string") cited.add(o.source);
      Object.values(o).forEach(walk);
    }
  };
  walk(dataset);

  it.each([...cited].sort())("cited source %s is listed in SOURCES.md", (slug) => {
    expect(sourcesDoc).toContain(`\`${slug}\``);
  });

  it("lists no source slug that does not exist", () => {
    const slugs = new Set(dataset.sources.map((s) => s.slug));
    const listed = [...sourcesDoc.matchAll(/^\| `([a-z0-9-]+)`/gm)].map((m) => m[1]!);
    expect(listed.filter((s) => !slugs.has(s))).toEqual([]);
  });
});
