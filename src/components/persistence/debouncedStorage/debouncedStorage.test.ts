import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StateStorage } from "zustand/middleware";

import { createDebouncedStorage } from "./debouncedStorage";

const createBase = (): StateStorage => ({
  getItem: vi.fn().mockReturnValue("stored"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

describe("createDebouncedStorage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should read straight through without waiting", () => {
    const base = createBase();
    const storage = createDebouncedStorage(base, 100);

    expect(storage.getItem("k")).toBe("stored");
    expect(base.getItem).toHaveBeenCalledWith("k");
  });

  it("should collapse rapid writes into a single flush", () => {
    const base = createBase();
    const storage = createDebouncedStorage(base, 100);

    storage.setItem("k", "a");
    storage.setItem("k", "b");
    storage.setItem("k", "c");
    expect(base.setItem).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(base.setItem).toHaveBeenCalledTimes(1);
    expect(base.setItem).toHaveBeenCalledWith("k", "c");
  });

  it("should drop a pending write when removed", () => {
    const base = createBase();
    const storage = createDebouncedStorage(base, 100);

    storage.setItem("k", "a");
    storage.removeItem("k");
    vi.advanceTimersByTime(100);

    expect(base.setItem).not.toHaveBeenCalled();
    expect(base.removeItem).toHaveBeenCalledWith("k");
  });

  it("should drop a pending write on cancel", () => {
    const base = createBase();
    const storage = createDebouncedStorage(base, 100);

    storage.setItem("k", "a");
    storage.cancel();
    vi.advanceTimersByTime(100);

    expect(base.setItem).not.toHaveBeenCalled();
  });
});
