import type { Note, Position, Rect } from '../../types';

export interface UseNoteMoveParams {
  note: Note;
  /** Returns the board's bounding rect, used for clamping. */
  getBoardRect: () => DOMRect | null;
  onMoveStart?: () => void;
  /** Fired on every move with the clamped position and full rect. */
  onMove: (position: Position, rect: Rect) => void;
  onMoveEnd: (position: Position, rect: Rect) => void;
}

export interface UseNoteMoveResult {
  isMoving: boolean;
  startMove: (event: React.PointerEvent) => void;
}
