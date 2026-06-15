import type {
  NoteColor,
  NotesStatus,
  Position,
  Rect,
} from "@/components/notes";
import type { RepositoryKind } from "@/components/persistence";

export interface NoteInteractionHandlers {
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

export interface BoardController {
  noteIds: string[];
  noteCount: number;
  status: NotesStatus;
  previewRect: Rect | null;
  isCreating: boolean;
  repositoryKind: RepositoryKind;
  getBoardRect: () => DOMRect | null;
  onBoardPointerDown: (event: React.PointerEvent) => void;
  onBoardDoubleClick: (event: React.MouseEvent) => void;
  onClear: () => void;
  onRepositoryChange: (kind: RepositoryKind) => void;
  noteHandlers: NoteInteractionHandlers;
}
