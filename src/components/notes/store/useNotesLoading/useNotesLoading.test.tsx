import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { resetNotesStore } from "../testing";
import { useNotesLoading } from "./useNotesLoading";

describe("useNotesLoading", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should never be loading for the local backend (synchronous store)", () => {
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNotesLoading(), { wrapper });

    expect(result.current).toBe(false);
  });

  it("should be loading for the api backend on first fetch", () => {
    const { wrapper } = createNotesHookWrapper("api");

    const { result } = renderHook(() => useNotesLoading(), { wrapper });

    expect(result.current).toBe(true);
  });
});
