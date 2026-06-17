import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  LOCAL_STORAGE_KEY,
  MOCK_REST_LATENCY,
  REST_STORAGE_KEY,
} from "@/components/persistence";

import type { Note } from "../../types";
import { useBackendStore } from "../backendStore";
import { MIN_LOADING_MS, PERSIST_DEBOUNCE } from "../constants";
import { notesLocalStore, notesRestStore, switchBackend } from "./notesStores";

const cleanState = {
  notes: [] as Note[],
  status: "ready" as const,
  draggingId: null,
  isOverTrash: false,
};

const remoteNote: Note = {
  id: "remote",
  position: { x: 0, y: 0 },
  size: { width: 10, height: 10 },
  text: "from backend",
  color: "yellow",
  createdAt: 0,
  updatedAt: 0,
};

describe("notesStores", () => {
  beforeEach(() => {
    window.localStorage.clear();
    notesLocalStore.setState(cleanState);
    notesRestStore.setState(cleanState);
    useBackendStore.setState({ kind: "local" });
  });

  describe("notesLocalStore", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should persist only the notes to localStorage after the debounce", () => {
      notesLocalStore.getState().addNote({ position: { x: 1, y: 2 } });
      notesLocalStore.getState().setDragging("dragging");

      vi.advanceTimersByTime(PERSIST_DEBOUNCE);

      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = JSON.parse(raw ?? "{}");
      expect(parsed.state.notes).toHaveLength(1);
      // Ephemeral drag state is partialized out.
      expect(parsed.state.draggingId).toBeUndefined();
    });
  });

  describe("switchBackend", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should activate the chosen backend kind", async () => {
      const switching = switchBackend("rest");
      await vi.runAllTimersAsync();
      await switching;

      expect(useBackendStore.getState().kind).toBe("rest");
    });

    it("should fetch the rest notes from its storage on switch", async () => {
      window.localStorage.setItem(
        REST_STORAGE_KEY,
        JSON.stringify({ state: { notes: [remoteNote] }, version: 0 }),
      );

      const switching = switchBackend("rest");
      await vi.runAllTimersAsync();
      await switching;

      expect(notesRestStore.getState().notes).toEqual([remoteNote]);
      expect(notesRestStore.getState().status).toBe("ready");
    });

    it("should hold the loading state until the minimum duration elapses", async () => {
      const switching = switchBackend("rest");

      // The fetch latency resolves first, but the loading floor keeps the
      // overlay on screen so a fast resolve can't flash by unseen.
      await vi.advanceTimersByTimeAsync(MOCK_REST_LATENCY);
      expect(notesRestStore.getState().status).toBe("loading");

      await vi.advanceTimersByTimeAsync(MIN_LOADING_MS - MOCK_REST_LATENCY);
      await switching;
      expect(notesRestStore.getState().status).toBe("ready");
    });
  });
});
