import { NOTES_STORAGE_KEY } from "../constants";
import type { DataSource, Note } from "../types";

function readRaw(dataSource: DataSource): Note[] {
  const raw = window.localStorage.getItem(NOTES_STORAGE_KEY[dataSource]);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Note[]) : [];
  } catch {
    return [];
  }
}

/**
 * Backfills `zIndex` for notes persisted before it existed, using array order
 * (the old implicit stacking) so reloads keep the same paint order. Notes that
 * already carry a `zIndex` are returned untouched (same reference).
 */
function ensureZIndex(notes: Note[]): Note[] {
  return notes.map((note, index) =>
    typeof note.zIndex === "number" ? note : { ...note, zIndex: index },
  );
}

export function readNotes(dataSource: DataSource): Note[] {
  return ensureZIndex(readRaw(dataSource));
}

export function saveNotes(dataSource: DataSource, notes: Note[]): void {
  window.localStorage.setItem(
    NOTES_STORAGE_KEY[dataSource],
    JSON.stringify(notes),
  );
}
