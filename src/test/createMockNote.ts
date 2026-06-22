import type { Note } from "@/components/notes/types";

/**
 * Shared factory for `Note` test fixtures. Pass `overrides` for the fields a
 * given test cares about; everything else falls back to these stable defaults.
 */
export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "",
  color: "yellow",
  zIndex: 0,
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});
