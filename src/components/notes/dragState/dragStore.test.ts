import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDragState,
  resetDragState,
  setDragging,
  setOverTrash,
  subscribeDrag,
} from "./dragStore";

describe("dragStore", () => {
  beforeEach(() => {
    resetDragState();
  });

  afterEach(() => {
    resetDragState();
  });

  it("should start idle", () => {
    expect(getDragState()).toEqual({ draggingId: null, isOverTrash: false });
  });

  it("should set the dragging id", () => {
    setDragging("note-1");

    expect(getDragState().draggingId).toBe("note-1");
  });

  it("should set the over-trash flag", () => {
    setOverTrash(true);

    expect(getDragState().isOverTrash).toBe(true);
  });

  it("should notify subscribers on change", () => {
    const listener = vi.fn();
    subscribeDrag(listener);

    setDragging("note-1");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should not notify when the value is unchanged", () => {
    const listener = vi.fn();
    subscribeDrag(listener);

    setOverTrash(false);

    expect(listener).not.toHaveBeenCalled();
  });

  it("should reset back to idle", () => {
    setDragging("note-1");
    setOverTrash(true);

    resetDragState();

    expect(getDragState()).toEqual({ draggingId: null, isOverTrash: false });
  });
});
