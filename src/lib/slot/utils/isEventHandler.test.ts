import { describe, expect, it } from "vitest";

import { isEventHandler } from "./isEventHandler";

describe("isEventHandler", () => {
  it("should return true for on-prefixed function props", () => {
    expect(isEventHandler("onClick", () => {})).toBe(true);
  });

  it("should return false when the value is not a function", () => {
    expect(isEventHandler("onClick", "nope")).toBe(false);
  });

  it("should return false for non event-handler keys", () => {
    expect(isEventHandler("className", () => {})).toBe(false);
  });
});
