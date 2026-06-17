import { describe, expect, it } from "vitest";

import { useBackendStore } from "../backendStore";
import { notesLocalStore, notesRestStore } from "../notesStores";
import { resetNotesStores } from "./resetNotesStores";

describe("resetNotesStores", () => {
  it("should clear leftover state on both stores", () => {
    notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    notesRestStore.getState().addNote({ position: { x: 0, y: 0 } });
    notesLocalStore.getState().setDragging("note-1");

    resetNotesStores();

    expect(notesLocalStore.getState().notes).toHaveLength(0);
    expect(notesLocalStore.getState().draggingId).toBeNull();
    expect(notesRestStore.getState().notes).toHaveLength(0);
  });

  it("should reset the active backend to local", () => {
    useBackendStore.setState({ kind: "rest" });

    resetNotesStores();

    expect(useBackendStore.getState().kind).toBe("local");
  });
});
