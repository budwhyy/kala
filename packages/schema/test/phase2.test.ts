// Phase 2 schema rules: ordered lists, pilgrimage networks, journeys.
import { describe, expect, it } from "vitest";
import { Journey, PilgrimageNetwork, Relationship, validateDataset } from "../src";
import { baseRecords, dataset, raw } from "./fixtures";

const ref = raw.ref;
const en = (text: string) => [{ text, lang: "en", script: "Latn" }];

const avatar = (id: string, from: string, extra: Record<string, unknown> = {}) => ({
  id,
  from,
  to: "fixture-parent",
  type: "avatar_of",
  variant: "fixture-variant-a",
  explanation: "x",
  references: ref,
  ...extra,
});

describe("position in ordered lists", () => {
  it("needs a variant and a list-like type", () => {
    expect(Relationship.safeParse(avatar("a", "x", { position: 1 })).success).toBe(true);
    expect(
      Relationship.safeParse(avatar("a", "x", { position: 1, variant: undefined })).success,
    ).toBe(false);
    expect(Relationship.safeParse(avatar("a", "x", { position: 1, type: "ally" })).success).toBe(
      false,
    );
  });
  it("rejects two figures at the same position of one list", () => {
    const records = baseRecords();
    records.entities.push(raw.entity("fixture-av-1"), raw.entity("fixture-av-2"));
    records.relationships.push(
      avatar("av-1", "fixture-av-1", { position: 1 }),
      avatar("av-2", "fixture-av-2", { position: 1 }),
    );
    const messages = validateDataset(dataset(records)).map((i) => i.message);
    expect(messages.some((m) => m.includes("position 1") && m.includes("already used"))).toBe(true);
  });
  it("allows the same position in different lists", () => {
    const records = baseRecords();
    records.entities.push(raw.entity("fixture-av-1"), raw.entity("fixture-av-2"));
    records.relationships.push(
      avatar("av-1", "fixture-av-1", { position: 1 }),
      avatar("av-2", "fixture-av-2", { position: 1, variant: "fixture-variant-b" }),
    );
    expect(validateDataset(dataset(records))).toEqual([]);
  });
});

describe("pilgrimage networks", () => {
  const network = (extra: Record<string, unknown> = {}) => ({
    slug: "fixture-network",
    names: en("Fixture Network"),
    kind: "other",
    traditions: ["fixture-tradition"],
    variants: ["fixture-variant-a"],
    summary_beginner: "x",
    references: ref,
    ...extra,
  });
  const member = (extra: Record<string, unknown> = {}) =>
    raw.terrestrialPlace({
      pilgrimage_networks: [
        { network: "fixture-network", variant: "fixture-variant-a", references: ref, ...extra },
      ],
    });

  const withLists = () => {
    const records = baseRecords();
    records.variants = [
      { ...raw.variant("fixture-variant-a"), kind: "list" },
      { ...raw.variant("fixture-variant-b"), kind: "list" },
    ];
    return records;
  };

  it("parses", () => expect(PilgrimageNetwork.safeParse(network()).success).toBe(true));
  it("requires the network to exist and the variant to be one of its lists", () => {
    const ok = { ...withLists(), networks: [network()], places: [member()] };
    expect(validateDataset(dataset(ok))).toEqual([]);

    const missing = { ...withLists(), places: [member()] };
    expect(validateDataset(dataset(missing)).map((i) => i.message)).toContain(
      "pilgrimage_networks.network → unknown networks 'fixture-network'",
    );

    const wrong = {
      ...withLists(),
      networks: [network()],
      places: [member({ variant: "fixture-variant-b" })],
    };
    expect(
      validateDataset(dataset(wrong)).some((i) => i.message.includes("is not one of network")),
    ).toBe(true);
  });
  it("lists must be list-kind variants", () => {
    const records = baseRecords();
    const bad = { ...records, networks: [network()] };
    expect(validateDataset(dataset(bad)).some((i) => i.message.includes("must be a list"))).toBe(
      true,
    );
  });
});

describe("journeys", () => {
  const journey = (steps: unknown[]) => ({
    slug: "fixture-journey",
    names: en("Fixture Journey"),
    summary_beginner: "x",
    steps,
  });
  const step = (id: string, extra: Record<string, unknown> = {}) => ({
    id,
    title: "Step",
    body: "Body",
    references: ref,
    ...extra,
  });

  it("needs at least two sourced steps", () => {
    expect(Journey.safeParse(journey([step("a")])).success).toBe(false);
    expect(Journey.safeParse(journey([step("a"), step("b", { references: [] })])).success).toBe(
      false,
    );
    expect(Journey.safeParse(journey([step("a"), step("b")])).success).toBe(true);
  });
  it("links must resolve and step ids must be unique", () => {
    const records = {
      ...baseRecords(),
      journeys: [
        journey([
          step("a", { links: [{ collection: "entities", slug: "fixture-parent" }] }),
          step("a", {
            links: [{ collection: "entities", slug: "nobody" }],
            cosmic_model: "no-model",
          }),
        ]),
      ],
    };
    const messages = validateDataset(dataset(records)).map((i) => i.message);
    expect(messages).toContain("duplicate step id 'a'");
    expect(messages).toContain("steps.a.links → unknown entities 'nobody'");
    expect(messages).toContain("steps.a.cosmic_model → unknown cosmic 'no-model'");
  });
});

describe("same_story_as (retellings)", () => {
  const event = (slug: string, same: string[]) => ({
    slug,
    names: en(slug),
    participants: [{ entity: "fixture-parent" }],
    same_story_as: same,
    summary_beginner: "x",
    references: ref,
  });
  it("must resolve and link back both ways", () => {
    const ok = { ...baseRecords(), events: [event("ev-a", ["ev-b"]), event("ev-b", ["ev-a"])] };
    expect(validateDataset(dataset(ok))).toEqual([]);

    const oneWay = { ...baseRecords(), events: [event("ev-a", ["ev-b"]), event("ev-b", [])] };
    expect(validateDataset(dataset(oneWay)).map((i) => i.message)).toContain(
      "same_story_as 'ev-b' must link back to 'ev-a'",
    );

    const missing = { ...baseRecords(), events: [event("ev-a", ["ev-z"])] };
    expect(validateDataset(dataset(missing)).map((i) => i.message)).toContain(
      "same_story_as → unknown events 'ev-z'",
    );
  });
});
