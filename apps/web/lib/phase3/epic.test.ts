import { describe, expect, it } from "vitest";
import { sectionOrder } from "./epic";

describe("sectionOrder", () => {
  it("flattens nested sections in reading order", () => {
    expect(
      sectionOrder([
        { id: "a", label: "A", sections: [{ id: "a1", label: "A1" }] },
        { id: "b", label: "B" },
      ]).map((s) => s.id),
    ).toEqual(["a", "a1", "b"]);
  });
});
