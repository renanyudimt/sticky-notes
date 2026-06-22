import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  addToast,
  dismissToast,
  getToasts,
  resetToasts,
  subscribeToasts,
  toast,
} from "./toastStore";

describe("toastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetToasts();
  });

  afterEach(() => {
    resetToasts();
    vi.useRealTimers();
  });

  it("should add a toast and expose it via getToasts", () => {
    addToast("success", "Saved", 0);

    expect(getToasts()).toEqual([
      { id: expect.any(String), type: "success", message: "Saved" },
    ]);
  });

  it("should notify subscribers when a toast is added", () => {
    const listener = vi.fn();
    subscribeToasts(listener);

    addToast("error", "Failed", 0);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should auto-dismiss after the given duration", () => {
    addToast("success", "Saved", 1000);
    expect(getToasts()).toHaveLength(1);

    vi.advanceTimersByTime(1000);

    expect(getToasts()).toHaveLength(0);
  });

  it("should dismiss a toast by id", () => {
    const id = addToast("success", "Saved", 0);

    dismissToast(id);

    expect(getToasts()).toHaveLength(0);
  });

  it("should expose success and error helpers that set the type", () => {
    toast.success("ok");
    toast.error("bad");

    expect(getToasts().map((item) => item.type)).toEqual([
      "success",
      "error",
    ]);
  });

  it("should stop notifying after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    unsubscribe();
    addToast("success", "Saved", 0);

    expect(listener).not.toHaveBeenCalled();
  });
});
