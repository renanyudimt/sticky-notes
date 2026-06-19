import type { DataSource } from "./types";

/**
 * The `localStorage` key backing each simulated backend. They are intentionally
 * distinct: switching modes in the header reads from a different data source, it
 * never shares the local-mode notes with the simulated API.
 */
export const NOTES_STORAGE_KEY: Record<DataSource, string> = {
  local: "rymt-sticky-notes/local",
  api: "rymt-sticky-notes/api",
};

/**
 * Simulated network latency per backend. `local` resolves instantly (it is the
 * user's own storage); `api` waits out a round-trip so the loading states are
 * visible. This is the *only* place latency lives now — the old storage-level
 * timeouts are gone.
 */
export const DATA_SOURCE_LATENCY: Record<DataSource, number> = {
  local: 0,
  api: 280,
};

/** Default active backend on first load. */
export const DEFAULT_DATA_SOURCE: DataSource = "local";

/**
 * The `localStorage` key holding which backend is active. Distinct from the
 * per-backend note keys: it persists only the user's selection, so the chosen
 * data source survives reloads.
 */
export const DATA_SOURCE_STORAGE_KEY = "rymt-sticky-notes/data-source";

/** How many notes the "Simulate 100 empty cards" action seeds. */
export const SEED_NOTE_COUNT = 100;
