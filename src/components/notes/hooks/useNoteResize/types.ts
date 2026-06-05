import type { Note, Rect, ResizeDirection } from '../../types';

export interface UseNoteResizeParams {
  note: Note;
  getBoardRect: () => DOMRect | null;
  onResizeStart?: () => void;
  onResize: (rect: Rect) => void;
  onResizeEnd: (rect: Rect) => void;
}

export interface UseNoteResizeResult {
  isResizing: boolean;
  /** Begin a resize from the given handle direction. */
  startResize: (direction: ResizeDirection, event: React.PointerEvent) => void;
}
