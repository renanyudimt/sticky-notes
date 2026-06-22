import type { RefObject } from "react";

import type { NoteColor, Position, Rect } from "@/components/notes";
import type { DataSource } from "@/services/notes";

export interface NoteInteractionHandlers {
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

export interface BoardController {
  noteIds: string[];
  noteCount: number;
  isLoading: boolean;
  isError: boolean;
  previewRef: RefObject<HTMLDivElement | null>;
  isCreating: boolean;
  dataSource: DataSource;
  getBoardRect: () => DOMRect | null;
  onBoardPointerDown: (event: React.PointerEvent) => void;
  onBoardDoubleClick: (event: React.MouseEvent) => void;
  onClear: () => Promise<void>;
  /** Seeds a batch of random empty cards (the "Simulate 100 cards" action). */
  onSeed: () => Promise<void>;
  onDataSourceChange: (dataSource: DataSource) => void;
  noteHandlers: NoteInteractionHandlers;
}
