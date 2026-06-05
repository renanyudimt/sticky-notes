import type { Note, NoteColor, Position, Rect } from "../../types";

export interface NoteCardProps {
  note: Note;
  getBoardRect: () => DOMRect | null;
  isPendingDelete?: boolean;
  onFocus: (id: string) => void;
  onMoveStart: (id: string) => void;
  onMove: (id: string, position: Position, rect: Rect) => void;
  onMoveEnd: (id: string, position: Position, rect: Rect) => void;
  onResize: (id: string, rect: Rect) => void;
  onResizeEnd: (id: string, rect: Rect) => void;
  onTextChange: (id: string, text: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
}
