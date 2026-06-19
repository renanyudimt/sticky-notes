import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resetDragState, setDragging, setOverTrash } from "./dragStore";
import { useNotePendingDelete } from "./useNotePendingDelete";

describe("useNotePendingDelete", () => {
  beforeEach(() => {
    resetDragState();
  });

  afterEach(() => {
    resetDragState();
  });

  it("should be false while idle", () => {
    const { result } = renderHook(() => useNotePendingDelete("note-1"));

    expect(result.current).toBe(false);
  });

  it("should be true when this note is dragged over the trash", () => {
    const { result } = renderHook(() => useNotePendingDelete("note-1"));

    act(() => {
      setDragging("note-1");
      setOverTrash(true);
    });

    expect(result.current).toBe(true);
  });

  it("should stay false for a different note", () => {
    const { result } = renderHook(() => useNotePendingDelete("note-2"));

    act(() => {
      setDragging("note-1");
      setOverTrash(true);
    });

    expect(result.current).toBe(false);
  });
});
