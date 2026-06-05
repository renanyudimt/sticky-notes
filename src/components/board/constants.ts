import type { RepositoryOption } from "./types";

export const BOARD_STRINGS = {
  appTitle: "Sticky Notes",
  emptyHint: "Double-click to create a note, or drag to set its size.",
  loading: "Loading notes...",
  error: "Could not load the notes.",
  clear: "Clear all",
  trashLabel: "Drag a note here to delete it",
  noteCount: (count: number) => (count === 1 ? "1 note" : `${count} notes`),
  storageLabel: "Storage",
} as const;

export const REPOSITORY_OPTIONS: readonly RepositoryOption[] = [
  { value: "local", label: "Local" },
  { value: "rest", label: "API" },
];
