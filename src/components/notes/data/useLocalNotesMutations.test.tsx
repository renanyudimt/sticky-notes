import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Note } from "../types";
import { notesLocalStore, resetNotesStore } from "../store";
import { useLocalNotesMutations } from "./useLocalNotesMutations";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

const notes = () => notesLocalStore.getState().notes;

describe("useLocalNotesMutations", () => {
  beforeEach(() => {
    resetNotesStore();
  });

  afterEach(() => {
    resetNotesStore();
  });

  it("should expose a stable reference across renders", () => {
    const { result, rerender } = renderHook(() => useLocalNotesMutations());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("should add a note to the store on createNote", () => {
    const { result } = renderHook(() => useLocalNotesMutations());

    act(() => result.current.createNote({ position: { x: 5, y: 6 } }));

    expect(notes()).toHaveLength(1);
    expect(notes()[0].position).toEqual({ x: 5, y: 6 });
  });

  it("should patch a note in the store on patchNote", () => {
    notesLocalStore.setState({ notes: [createMockNote()] });
    const { result } = renderHook(() => useLocalNotesMutations());

    act(() => result.current.patchNote("note-1", { color: "blue" }));

    expect(notes()[0].color).toBe("blue");
  });

  it("should move a note to the end on bringToFront", () => {
    notesLocalStore.setState({
      notes: [
        createMockNote({ id: "a" }),
        createMockNote({ id: "b" }),
        createMockNote({ id: "c" }),
      ],
    });
    const { result } = renderHook(() => useLocalNotesMutations());

    act(() => result.current.bringToFront("a"));

    expect(notes().map((note) => note.id)).toEqual(["b", "c", "a"]);
  });

  it("should remove a note on deleteNote", async () => {
    notesLocalStore.setState({
      notes: [createMockNote(), createMockNote({ id: "note-2" })],
    });
    const { result } = renderHook(() => useLocalNotesMutations());

    await act(async () => {
      await result.current.deleteNote("note-1");
    });

    expect(notes().map((note) => note.id)).toEqual(["note-2"]);
  });

  it("should empty the store on clearNotes", async () => {
    notesLocalStore.setState({ notes: [createMockNote()] });
    const { result } = renderHook(() => useLocalNotesMutations());

    await act(async () => {
      await result.current.clearNotes();
    });

    expect(notes()).toHaveLength(0);
  });

  it("should append the requested count on seedNotes", async () => {
    const { result } = renderHook(() => useLocalNotesMutations());

    await act(async () => {
      await result.current.seedNotes(3);
    });

    expect(notes()).toHaveLength(3);
  });
});
