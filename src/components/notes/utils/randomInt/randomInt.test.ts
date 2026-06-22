import { describe, expect, it } from "vitest";

import { randomInt } from "./randomInt";

describe("randomInt", () => {
  it("should return 0 for an empty range", () => {
    expect(randomInt(0)).toBe(0);
  });

  it("should return 0 for a single-value range", () => {
    expect(randomInt(1)).toBe(0);
  });

  it("should stay within [0, maxExclusive) across many draws", () => {
    const max = 5;

    for (let i = 0; i < 200; i += 1) {
      const value = randomInt(max);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(max);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("should eventually produce every value in the range", () => {
    const max = 4;
    const seen = new Set<number>();

    for (let i = 0; i < 500; i += 1) {
      seen.add(randomInt(max));
    }

    expect(seen.size).toBe(max);
  });
});
