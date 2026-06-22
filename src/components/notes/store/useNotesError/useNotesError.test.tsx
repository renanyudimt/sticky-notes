import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { resetNotesStore } from "../testing";
import { useNotesError } from "./useNotesError";

describe("useNotesError", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should not report an error on the happy path", async () => {
    const { wrapper } = createNotesHookWrapper("api");

    const { result } = renderHook(() => useNotesError(), { wrapper });

    await waitFor(() => expect(result.current).toBe(false));
  });
});
