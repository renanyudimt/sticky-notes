import type { NoteColor } from "../../types";

export interface NoteCardHeaderProps {
  color: NoteColor;
  onColorChange: (color: NoteColor) => void;
  /** Pre-bound to the note's id — deletes this note. Resolves when the request settles. */
  onDelete: () => Promise<void>;
  /** Starts a move drag; the header doubles as the drag handle. */
  onPointerDown: (event: React.PointerEvent) => void;
}
