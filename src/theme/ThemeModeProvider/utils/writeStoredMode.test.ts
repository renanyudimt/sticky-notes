import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "../constants";
import { writeStoredMode } from "./writeStoredMode";

describe("writeStoredMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should persist the light mode", () => {
    writeStoredMode("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("should persist the dark mode", () => {
    writeStoredMode("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("should overwrite a previous choice", () => {
    writeStoredMode("light");
    writeStoredMode("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
