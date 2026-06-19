import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resetDragState, setDragging, setOverTrash } from "./dragStore";
import { useTrashActive } from "./useTrashActive";

describe("useTrashActive", () => {
  beforeEach(() => {
    resetDragState();
  });

  afterEach(() => {
    resetDragState();
  });

  it("should be false while idle", () => {
    const { result } = renderHook(() => useTrashActive());

    expect(result.current).toBe(false);
  });

  it("should be true only while dragging over the trash", () => {
    const { result } = renderHook(() => useTrashActive());

    act(() => {
      setDragging("note-1");
      setOverTrash(true);
    });

    expect(result.current).toBe(true);
  });

  it("should be false when dragging but not over the trash", () => {
    const { result } = renderHook(() => useTrashActive());

    act(() => setDragging("note-1"));

    expect(result.current).toBe(false);
  });
});
