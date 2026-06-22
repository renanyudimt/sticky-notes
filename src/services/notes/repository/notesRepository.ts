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

export function readNotes(dataSource: DataSource): Note[] {
  return readRaw(dataSource);
}

export function saveNotes(dataSource: DataSource, notes: Note[]): void {
  window.localStorage.setItem(
    NOTES_STORAGE_KEY[dataSource],
    JSON.stringify(notes),
  );
}
