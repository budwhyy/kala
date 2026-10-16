// Every locale's message files must stay in step with English: same keys, no empty strings, same {placeholders}.
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

// Each locale's own script, used to check values were actually translated.
const SCRIPT: Record<string, RegExp> = { hi: /[ऀ-ॿ]/, ta: /[஀-௿]/ };

for (const locale of ["hi", "ta"])
  for (const file of ["core", "phase2", "phase3", "phase4"]) {
    describe(`messages/${locale}/${file}.json`, () => {
      const en = flatten(load("en", file));
      const other = flatten(load(locale, file));

      it("has the same keys as English", () => {
        expect(Object.keys(other).sort()).toEqual(Object.keys(en).sort());
      });
      it("has no empty strings", () => {
        for (const [k, v] of [...Object.entries(en), ...Object.entries(other)])
          expect(v.trim(), k).not.toBe("");
      });
      it("uses the same placeholders as English", () => {
        for (const k of Object.keys(en))
          expect(placeholders(other[k] ?? ""), k).toEqual(placeholders(en[k]!));
      });
      it("values are actually translated unless they are names or symbols", () => {
        const untranslated = Object.entries(other).filter(
          ([k, v]) =>
            !SCRIPT[locale]!.test(v) &&
            v === en[k] &&
            /[a-z]{4,}/i.test(v) &&
            !/^(KĀLA|IAST)$/.test(v),
        );
        expect(untranslated.map(([k]) => k)).toEqual([]);
      });
    });
  }
