import { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockNote } from "@/test/createMockNote";
import type { Note } from "@/services/notes";

import { resetActivityState } from "../../../activityStore";
import { notesLocalStore } from "../../../notesLocalStore";
import { resetNotesStore } from "../../../testing";
import { buildNotesMutations } from "./buildNotesMutations";
import type { ApiMutationsDeps } from "./types";

describe("buildNotesMutations", () => {
  beforeEach(() => {
    resetNotesStore();
    resetActivityState();
  });

  afterEach(() => {
    resetNotesStore();
    resetActivityState();
  });

  describe("local backend", () => {
    const localMutations = () => buildNotesMutations({ dataSource: "local" });
    const notes = () => notesLocalStore.getState().notes;

    it("should add a note to the store on createNote", () => {
      localMutations().createNote({ position: { x: 5, y: 6 } });

      expect(notes()).toHaveLength(1);
      expect(notes()[0].position).toEqual({ x: 5, y: 6 });
    });

    it("should patch a note in the store on patchNote", () => {
      notesLocalStore.setState({ notes: [createMockNote()] });

      localMutations().patchNote("note-1", { color: "blue" });

      expect(notes()[0].color).toBe("blue");
    });

    it("should raise zIndex above all others on bringToFront without reordering", () => {
      notesLocalStore.setState({
        notes: [
          createMockNote({ id: "a", zIndex: 0 }),
          createMockNote({ id: "b", zIndex: 1 }),
          createMockNote({ id: "c", zIndex: 2 }),
        ],
      });

      localMutations().bringToFront("a");

      const current = notes();
      expect(current.map((note) => note.id)).toEqual(["a", "b", "c"]);
      const top = Math.max(...current.map((note) => note.zIndex));
      expect(current.find((note) => note.id === "a")?.zIndex).toBe(top);
    });

    it("should remove a note on deleteNote", async () => {
      notesLocalStore.setState({
        notes: [createMockNote(), createMockNote({ id: "note-2" })],
      });

      await localMutations().deleteNote("note-1");

      expect(notes().map((note) => note.id)).toEqual(["note-2"]);
    });

    it("should empty the store on clearNotes", async () => {
      notesLocalStore.setState({ notes: [createMockNote()] });

      await localMutations().clearNotes();

      expect(notes()).toHaveLength(0);
    });

    it("should append the requested count on seedNotes", async () => {
      await localMutations().seedNotes(3);

      expect(notes()).toHaveLength(3);
    });
  });

  describe("api backend", () => {
    const LIST_KEY = ["notes", "api"];

    function createDeps(
      overrides: Partial<ApiMutationsDeps> = {},
    ): ApiMutationsDeps {
      return {
        queryClient: new QueryClient(),
        createMutate: vi.fn(),
        updateMutate: vi.fn(),
        deleteMutate: vi.fn(async () => {}),
        clearMutate: vi.fn(async () => {}),
        seedMutate: vi.fn(async () => [] as Note[]),
        ...overrides,
      };
    }

    const apiMutations = (deps: ApiMutationsDeps) =>
      buildNotesMutations({ dataSource: "api", deps });

    it("should patch a note in the cache without calling a mutation", () => {
      const deps = createDeps();
      deps.queryClient.setQueryData<Note[]>(LIST_KEY, [createMockNote()]);

      apiMutations(deps).patchNote("note-1", { color: "blue" });

      expect(deps.queryClient.getQueryData<Note[]>(LIST_KEY)?.[0].color).toBe(
        "blue",
      );
      expect(deps.updateMutate).not.toHaveBeenCalled();
    });

    it("should raise zIndex above all others in the cache on bringToFront without reordering", () => {
      const deps = createDeps();
      deps.queryClient.setQueryData<Note[]>(LIST_KEY, [
        createMockNote({ id: "a", zIndex: 0 }),
        createMockNote({ id: "b", zIndex: 1 }),
        createMockNote({ id: "c", zIndex: 2 }),
      ]);

      apiMutations(deps).bringToFront("a");

      const cached = deps.queryClient.getQueryData<Note[]>(LIST_KEY) ?? [];
      expect(cached.map((note) => note.id)).toEqual(["a", "b", "c"]);
      const top = Math.max(...cached.map((note) => note.zIndex));
      expect(cached.find((note) => note.id === "a")?.zIndex).toBe(top);
    });

    it("should forward the input to the create mutation on createNote", () => {
      const deps = createDeps();
      const input = { position: { x: 1, y: 2 } };

      apiMutations(deps).createNote(input);

      expect(deps.createMutate).toHaveBeenCalledWith(
        input,
        expect.objectContaining({ onSettled: expect.any(Function) }),
      );
    });

    it("should forward the id to the delete mutation on deleteNote", async () => {
      const deps = createDeps();

      await apiMutations(deps).deleteNote("note-1");

      expect(deps.deleteMutate).toHaveBeenCalledWith("note-1");
    });

    it("should call the clear mutation on clearNotes", async () => {
      const deps = createDeps();

      await apiMutations(deps).clearNotes();

      expect(deps.clearMutate).toHaveBeenCalled();
    });

    it("should resolve to undefined after seeding on seedNotes", async () => {
      const deps = createDeps();

      await expect(
        apiMutations(deps).seedNotes(3),
      ).resolves.toBeUndefined();
      expect(deps.seedMutate).toHaveBeenCalledWith(3);
    });
  });
});
