import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { notesLocalStore, resetNotesStore } from "../store";
import { useNotesMutations } from "./useNotesMutations";

describe("useNotesMutations", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should route to the Zustand store when local is active", () => {
    const { queryClient, wrapper } = createNotesHookWrapper("local");
    const { result } = renderHook(() => useNotesMutations(), { wrapper });

    act(() => result.current.createNote({ position: { x: 1, y: 2 } }));

    expect(notesLocalStore.getState().notes).toHaveLength(1);
    // The React Query cache stays untouched in local mode.
    expect(queryClient.getQueryData(["notes", "api"])).toBeUndefined();
  });

  it("should route to the React Query cache when api is active", () => {
    const { queryClient, wrapper } = createNotesHookWrapper("api");
    queryClient.setQueryData(["notes", "api"], [
      {
        id: "a",
        position: { x: 0, y: 0 },
        size: { width: 220, height: 220 },
        text: "",
        color: "yellow" as const,
        createdAt: 1,
        updatedAt: 1,
      },
    ]);
    const { result } = renderHook(() => useNotesMutations(), { wrapper });

    act(() => result.current.patchNote("a", { color: "blue" }));

    expect(
      queryClient.getQueryData<{ color: string }[]>(["notes", "api"])?.[0].color,
    ).toBe("blue");
    // The local store stays untouched in api mode.
    expect(notesLocalStore.getState().notes).toHaveLength(0);
  });
});
