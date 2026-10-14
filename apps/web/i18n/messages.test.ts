// Hindi and English message files must stay in step: same keys, no empty strings, same {placeholders}.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Tree = { [k: string]: string | Tree };
const load = (locale: string, file: string): Tree =>
  JSON.parse(
    readFileSync(resolve(import.meta.dirname, `../messages/${locale}/${file}.json`), "utf8"),
  );

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else Object.assign(out, flatten(v, key));
  }
  return out;
}
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]!).sort();

for (const file of ["core", "phase2"]) {
  describe(`messages/${file}.json`, () => {
    const en = flatten(load("en", file));
    const hi = flatten(load("hi", file));

    it("has the same keys in English and Hindi", () => {
      expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
    });
    it("has no empty strings", () => {
      for (const [k, v] of [...Object.entries(en), ...Object.entries(hi)])
        expect(v.trim(), k).not.toBe("");
    });
    it("uses the same placeholders in both languages", () => {
      for (const k of Object.keys(en))
        expect(placeholders(hi[k] ?? ""), k).toEqual(placeholders(en[k]!));
    });
    it("Hindi values are actually translated (contain Devanagari) unless they are names or symbols", () => {
      const untranslated = Object.entries(hi).filter(
        ([k, v]) =>
          !/[ऀ-ॿ]/.test(v) && v === en[k] && /[a-z]{4,}/i.test(v) && !/^(KĀLA|IAST)$/.test(v),
      );
      expect(untranslated.map(([k]) => k)).toEqual([]);
    });
  });
}
