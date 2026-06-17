import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "../constants";
import { readStoredMode } from "./readStoredMode";

describe("readStoredMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return the stored mode when it is light", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    expect(readStoredMode()).toBe("light");
  });

  it("should return the stored mode when it is dark", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(readStoredMode()).toBe("dark");
  });

  it("should return null when nothing is stored", () => {
    expect(readStoredMode()).toBeNull();
  });

  it("should return null when the stored value is invalid", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple");
    expect(readStoredMode()).toBeNull();
  });
});
