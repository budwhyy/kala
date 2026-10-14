// Every YAML example in docs/CONTENT_GUIDE.md that starts with "# collection: <name>" must pass that
// collection's schema, so the guide cannot drift from the real rules.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { COLLECTIONS, type CollectionName } from "../src";

const guide = readFileSync(
  resolve(import.meta.dirname, "../../../docs/CONTENT_GUIDE.md"),
  "utf8",
).replace(/\r\n/g, "\n");

const examples = [...guide.matchAll(/^( *)```yaml\n([\s\S]*?)^\1```/gm)].flatMap((m) => {
  const indent = m[1]!.length;
  const body = m[2]!
    .split("\n")
    .map((line) => line.slice(indent))
    .join("\n");
  const collection = /^# collection: (\w+)/.exec(body)?.[1];
  return collection ? [{ collection: collection as CollectionName, body }] : [];
});

describe("CONTENT_GUIDE.md examples", () => {
  it("has examples to check", () => {
    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it.each(examples.map((e, i) => [`${i + 1}: ${e.collection}`, e] as const))(
    "example %s is valid",
    (_label, { collection, body }) => {
      const { schema } = COLLECTIONS[collection];
      const parsed: unknown = parse(body);
      for (const record of Array.isArray(parsed) ? parsed : [parsed]) {
        const result = schema.safeParse(record);
        expect(result.success ? [] : result.error.issues).toEqual([]);
      }
    },
  );
});
