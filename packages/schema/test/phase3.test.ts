// Phase 3: battlefields (sides, commanders, the fallen) and routes with travellers.
import { describe, expect, it } from "vitest";
import { Battlefield, Route, validateDataset } from "../src";
import { baseRecords, dataset, raw } from "./fixtures";

const ref = raw.ref;
const en = (text: string) => [{ text, lang: "en", script: "Latn" }];
const side = (id: string, extra: Record<string, unknown> = {}) => ({
  id,
  names: en(id),
  references: ref,
  ...extra,
});
const field = (extra: Record<string, unknown> = {}) => ({
  slug: "fixture-field",
  names: en("Fixture Field"),
  place: "fixture-town",
  text: "fixture-text",
  variant: "fixture-variant-a",
  literary: true,
  sides: [side("east"), side("west")],
  days: [{ day: 1, references: ref }],
  summary_beginner: "x",
  references: ref,
  ...extra,
});
const records = (bf: unknown) => ({
  ...baseRecords(),
  places: [raw.terrestrialPlace()],
  battlefields: [bf],
});

describe("Battlefield", () => {
  it("is always literary and needs at least two sides", () => {
    expect(Battlefield.safeParse(field()).success).toBe(true);
    expect(Battlefield.safeParse(field({ literary: false })).success).toBe(false);
    expect(Battlefield.safeParse(field({ sides: [side("east")] })).success).toBe(false);
  });
  it("rejects unknown sides and repeated days", () => {
    const badSide = field({
      days: [
        {
          day: 1,
          commanders: [{ side: "north", entity: "fixture-parent", references: ref }],
          references: ref,
        },
      ],
    });
    expect(Battlefield.safeParse(badSide).success).toBe(false);
    const twice = field({
      days: [
        { day: 1, references: ref },
        { day: 1, references: ref },
      ],
    });
    expect(Battlefield.safeParse(twice).success).toBe(false);
  });
  it("checks people and kingdoms exist, and no one falls twice", () => {
    expect(validateDataset(dataset(records(field())))).toEqual([]);
    const ghost = field({
      days: [{ day: 1, fallen: [{ entity: "nobody", references: ref }], references: ref }],
    });
    expect(validateDataset(dataset(records(ghost))).map((i) => i.message)).toContain(
      "days.people → unknown entities 'nobody'",
    );
    const fall = (day: number) => ({
      day,
      fallen: [{ entity: "fixture-child", references: ref }],
      references: ref,
    });
    const twice = field({ days: [fall(1), fall(3)] });
    expect(validateDataset(dataset(records(twice))).map((i) => i.message)).toContain(
      "'fixture-child' falls on day 1 and again on day 3",
    );
  });
});

describe("Route travellers", () => {
  const route = (travellers: string[]) => ({
    slug: "fixture-route",
    names: en("Fixture route"),
    text: "fixture-text",
    variant: "fixture-variant-a",
    literary_reconstruction: true,
    travellers,
    stops: [
      { order: 1, place: "fixture-town", references: ref },
      { order: 2, place: "fixture-town", references: ref },
    ],
    summary_beginner: "x",
  });
  it("is always a literary reconstruction and travellers must exist", () => {
    expect(Route.safeParse({ ...route([]), literary_reconstruction: false }).success).toBe(false);
    const ok = {
      ...baseRecords(),
      places: [raw.terrestrialPlace()],
      routes: [route(["fixture-parent"])],
    };
    expect(validateDataset(dataset(ok))).toEqual([]);
    const bad = { ...baseRecords(), places: [raw.terrestrialPlace()], routes: [route(["nobody"])] };
    expect(validateDataset(dataset(bad)).map((i) => i.message)).toContain(
      "travellers → unknown entities 'nobody'",
    );
  });
});
