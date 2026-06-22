import { describe, expect, it } from "vitest";

import type { NotesState } from "../notesLocalStore";
import { selectLocalNoteIds } from "./selectLocalNoteIds";
import { createMockNote } from "@/test/createMockNote";

const stateWith = (notes: NotesState["notes"]): NotesState =>
  ({ notes }) as NotesState;

describe("selectLocalNoteIds", () => {
  it("should return the ids in stacking order", () => {
    const state = stateWith([
      createMockNote({ id: "a" }),
      createMockNote({ id: "b" }),
    ]);

    expect(selectLocalNoteIds(state)).toEqual(["a", "b"]);
  });

  it("should return an empty array when there are no notes", () => {
    expect(selectLocalNoteIds(stateWith([]))).toEqual([]);
  });
});
