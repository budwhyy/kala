// Every enum value the schema allows has a label in both languages, so no new value silently shows
// up untranslated on the Hindi site.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EntityKind, PilgrimageNetwork, Place, RelationshipType, Tradition } from "@kala/schema";
import { describe, expect, it } from "vitest";

const msgs = (locale: string) =>
  JSON.parse(readFileSync(resolve(import.meta.dirname, `../messages/${locale}/core.json`), "utf8"));

describe.each(["en", "hi"])("enum labels (%s)", (locale) => {
  const m = msgs(locale);
  it("covers entity kinds, place kinds, tradition families and network kinds", () => {
    expect(EntityKind.options.filter((v) => !(v in m.enums.kind))).toEqual([]);
    expect(Place.shape.kind.options.filter((v: string) => !(v in m.enums.placeKind))).toEqual([]);
    expect(Tradition.shape.family.options.filter((v) => !(v in m.enums.family))).toEqual([]);
    expect(PilgrimageNetwork.shape.kind.options.filter((v) => !(v in m.enums.networkKind))).toEqual(
      [],
    );
  });
  it("covers every relationship type in both directions", () => {
    const missing = RelationshipType.options.filter((t) => !m.relations?.[t]);
    expect(missing).toEqual([]);
  });
});
