import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readNotes, saveNotes } from "./notesRepository";
import { createMockNote } from "@/test/createMockNote";

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

  it("should backfill zIndex by array order for legacy notes without it", () => {
    const legacy = (id: string) => {
      const note: Record<string, unknown> = { ...createMockNote({ id }) };
      delete note.zIndex;
      return note;
    };
    window.localStorage.setItem(
      "rymt-sticky-notes/api",
      JSON.stringify([legacy("a"), legacy("b")]),
    );

    expect(readNotes("api").map((note) => note.zIndex)).toEqual([0, 1]);
  });

  it("should preserve an already-stored zIndex", () => {
    saveNotes("api", [createMockNote({ id: "a", zIndex: 9 })]);

    expect(readNotes("api")[0].zIndex).toBe(9);
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
