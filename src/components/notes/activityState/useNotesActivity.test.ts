import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { beginActivity, resetActivityState } from "./activityStore";
import { useNotesActivity } from "./useNotesActivity";

describe("useNotesActivity", () => {
  beforeEach(() => {
    resetActivityState();
  });

  afterEach(() => {
    resetActivityState();
  });

  it("should be null when idle", () => {
    const { result } = renderHook(() => useNotesActivity());

    expect(result.current).toBeNull();
  });

  it("should report the in-flight action", () => {
    const { result } = renderHook(() => useNotesActivity());

    act(() => {
      beginActivity("editing");
    });

    expect(result.current).toBe("editing");
  });

  it("should prefer creating over editing when both overlap", () => {
    const { result } = renderHook(() => useNotesActivity());

    act(() => {
      beginActivity("editing");
      beginActivity("creating");
    });

    expect(result.current).toBe("creating");
  });

  it("should prefer deleting over editing when both overlap", () => {
    const { result } = renderHook(() => useNotesActivity());

    act(() => {
      beginActivity("editing");
      beginActivity("deleting");
    });

    expect(result.current).toBe("deleting");
  });
});
