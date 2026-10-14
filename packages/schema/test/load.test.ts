import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { loadContent } from "../src/load";
import { raw } from "./fixtures";

describe("§8 gate 1: every seed file in content/ validates", () => {
  it("has no schema or cross-record issues", async () => {
    const { issues } = await loadContent(resolve(import.meta.dirname, "../../../content"));
    expect(issues).toEqual([]);
  });
});

describe("loadContent", () => {
  let root: string;
  afterEach(() => rm(root, { recursive: true, force: true }));

  async function write(collection: string, file: string, data: unknown) {
    await mkdir(join(root, collection), { recursive: true });
    await writeFile(
      join(root, collection, file),
      typeof data === "string" ? data : stringify(data),
    );
  }

  it("loads single records and lists, and reports file-level errors", async () => {
    root = await mkdtemp(join(tmpdir(), "kala-content-"));
    await write("sources", "fixture-source.yaml", raw.source());
    await write("texts", "fixture-text.yaml", raw.text());
    await write("traditions", "fixture-tradition.yaml", raw.tradition());
    await write("entities", "people.yaml", [
      raw.entity("fixture-parent"),
      raw.entity("fixture-child"),
    ]);
    await write("relationships", "rels.yaml", [
      raw.parent("rel-1", "fixture-parent", "fixture-child"),
    ]);

    const ok = await loadContent(root);
    expect(ok.issues).toEqual([]);
    expect(ok.dataset.entities.map((e) => e.slug)).toEqual(["fixture-parent", "fixture-child"]);

    await write("places", "broken.yaml", "slug: [unclosed");
    await write(
      "places",
      "cosmic.yaml",
      raw.cosmologicalPlace({ geometry: { type: "Point", coordinates: [1, 1] } }),
    );
    const bad = await loadContent(root);
    expect(bad.issues.map((i) => i.file)).toEqual(["places/broken.yaml", "places/cosmic.yaml"]);
    expect(bad.issues[1]?.message).toContain("cosmological places must not have coordinates");
  });
});
