import { renderHook } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Note } from "@/services/notes";

import { notesLocalStore } from "../notesLocalStore";
import { useLocalNoteIds } from "./useLocalNoteIds";
import { useLocalNoteText } from "./useLocalNoteText";
import { useLocalNoteView } from "./useLocalNoteView";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 10, y: 20 },
  size: { width: 220, height: 220 },
  text: "hello",
  color: "blue",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

const seed = (notes: Note[]) => notesLocalStore.setState({ notes });

describe("local note selectors", () => {
  beforeEach(() => {
    seed([]);
  });

  afterEach(() => {
    seed([]);
  });

  describe("useLocalNoteIds", () => {
    it("should return the ids in order", () => {
      seed([createMockNote({ id: "a" }), createMockNote({ id: "b" })]);

      const { result } = renderHook(() => useLocalNoteIds());

      expect(result.current).toEqual(["a", "b"]);
    });

    it("should keep a stable reference when an unrelated field changes", () => {
      seed([createMockNote({ id: "a" })]);
      const { result, rerender } = renderHook(() => useLocalNoteIds());
      const first = result.current;

      act(() => seed([createMockNote({ id: "a", position: { x: 99, y: 99 } })]));
      rerender();

      expect(result.current).toBe(first);
    });
  });

  describe("useLocalNoteView", () => {
    it("should return the note's layout/style slice", () => {
      seed([createMockNote()]);

      const { result } = renderHook(() => useLocalNoteView("note-1"));

      expect(result.current).toEqual({
        id: "note-1",
        position: { x: 10, y: 20 },
        size: { width: 220, height: 220 },
        color: "blue",
      });
    });

    it("should return undefined for an unknown id", () => {
      seed([createMockNote()]);

      const { result } = renderHook(() => useLocalNoteView("missing"));

      expect(result.current).toBeUndefined();
    });
  });

  describe("useLocalNoteText", () => {
    it("should return the note's text", () => {
      seed([createMockNote({ text: "buy milk" })]);

      const { result } = renderHook(() => useLocalNoteText("note-1"));

      expect(result.current).toBe("buy milk");
    });

    it("should return an empty string for an unknown id", () => {
      seed([createMockNote()]);

      const { result } = renderHook(() => useLocalNoteText("missing"));

      expect(result.current).toBe("");
    });
  });
});
