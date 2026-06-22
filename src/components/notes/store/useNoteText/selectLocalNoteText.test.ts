import { describe, expect, it } from "vitest";

import type { NotesState } from "../notesLocalStore";
import { selectLocalNoteText } from "./selectLocalNoteText";
import { createMockNote } from "@/test/createMockNote";

const stateWith = (notes: NotesState["notes"]): NotesState =>
  ({ notes }) as NotesState;

describe("selectLocalNoteText", () => {
  it("should return the note's text", () => {
    const state = stateWith([createMockNote({ text: "buy milk" })]);

    expect(selectLocalNoteText(state, "note-1")).toBe("buy milk");
  });

  it("should return an empty string for an unknown id", () => {
    const state = stateWith([createMockNote()]);

    expect(selectLocalNoteText(state, "missing")).toBe("");
  });
});
