import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/whatsapp-landings";

describe("whatsapp landing helpers", () => {
  it("slugifies Turkish characters and trims separators", () => {
    expect(slugify("Berlin Türk Girişimciler 2026!!")).toBe("berlin-turk-girisimciler-2026");
  });

  it("limits slug length", () => {
    expect(slugify("a".repeat(100)).length).toBeLessThanOrEqual(60);
  });
});
