import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Note } from "../types";
import { readNotes, saveNotes } from "./notesRepository";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "Reminder",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe("notesRepository", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should return an empty array when nothing is stored", () => {
    expect(readNotes("api")).toEqual([]);
  });

  it("should round-trip notes through save and read", () => {
    const notes = [createMockNote(), createMockNote({ id: "note-2" })];

    saveNotes("api", notes);

    expect(readNotes("api")).toEqual(notes);
  });

  it("should keep the local and api backends in separate keys", () => {
    saveNotes("local", [createMockNote({ id: "local-note" })]);
    saveNotes("api", [createMockNote({ id: "api-note" })]);

    expect(readNotes("local")).toEqual([
      createMockNote({ id: "local-note" }),
    ]);
    expect(readNotes("api")).toEqual([createMockNote({ id: "api-note" })]);
  });

  it("should fall back to an empty array on corrupt JSON", () => {
    window.localStorage.setItem("rymt-sticky-notes/api", "{not json");

    expect(readNotes("api")).toEqual([]);
  });

  it("should fall back to an empty array when the stored value is not an array", () => {
    window.localStorage.setItem("rymt-sticky-notes/api", '{"foo":1}');

    expect(readNotes("api")).toEqual([]);
  });
});
