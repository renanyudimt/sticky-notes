import { describe, expect, it } from "vitest";

import type { NotesState } from "../notesLocalStore";
import { selectLocalNoteView } from "./selectLocalNoteView";
import { createMockNote } from "@/test/createMockNote";

const stateWith = (notes: NotesState["notes"]): NotesState =>
  ({ notes }) as NotesState;

describe("selectLocalNoteView", () => {
  it("should return the note's layout/style slice", () => {
    const state = stateWith([
      createMockNote({ position: { x: 10, y: 20 }, color: "blue" }),
    ]);

    expect(selectLocalNoteView(state, "note-1")).toEqual({
      id: "note-1",
      position: { x: 10, y: 20 },
      size: { width: 220, height: 220 },
      color: "blue",
    });
  });

  it("should return undefined for an unknown id", () => {
    const state = stateWith([createMockNote()]);

    expect(selectLocalNoteView(state, "missing")).toBeUndefined();
  });
});
