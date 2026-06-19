import { NOTES_STORAGE_KEY } from "../constants";
import type { DataSource, Note } from "../types";

/**
 * The simulated backend's persistence. Reads and writes the notes for a backend
 * as a single JSON string in `localStorage`, under that backend's own key. This
 * is the *only* thing that actually touches storage — the queries/mutations wrap
 * these with latency to mimic a real API; here it is plain and synchronous.
 */

function readRaw(dataSource: DataSource): Note[] {
  const raw = window.localStorage.getItem(NOTES_STORAGE_KEY[dataSource]);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    // Tolerate anything that isn't a notes array (corrupt/legacy data) by
    // falling back to empty rather than throwing into the query layer.
    return Array.isArray(parsed) ? (parsed as Note[]) : [];
  } catch {
    return [];
  }
}

/** Read all notes for a backend. Returns `[]` when empty or unparseable. */
export function readNotes(dataSource: DataSource): Note[] {
  return readRaw(dataSource);
}

/** Persist the full notes array for a backend as a JSON string. */
export function saveNotes(dataSource: DataSource, notes: Note[]): void {
  window.localStorage.setItem(NOTES_STORAGE_KEY[dataSource], JSON.stringify(notes));
}
