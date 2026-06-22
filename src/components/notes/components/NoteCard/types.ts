import type { NoteColor, NoteView, Position, Rect } from "../../types";

export interface NoteCardProps {
  /**
   * The note's layout/style fields. Excludes `text` (owned by NoteEditorConnector)
   * so typing never re-renders the card.
   */
  note: NoteView;
  /** Stacking order — the note's own `zIndex`; higher sits on top. */
  zIndex: number;
  getBoardRect: () => DOMRect | null;
  isPendingDelete?: boolean;
  onFocus: (id: string) => void;
  onMoveStart: (id: string) => void;
  onMove: (id: string, position: Position, rect: Rect) => void;
  onMoveEnd: (id: string, position: Position, rect: Rect) => void;
  onResize: (id: string, rect: Rect) => void;
  onResizeEnd: (id: string, rect: Rect) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onEditText: (id: string, text: string) => void;
  /** Resolves when the delete request settles, so the dialog can close on success. */
  onDelete: (id: string) => Promise<void>;
}
