import { memo, useCallback } from "react";
import { X } from "lucide-react";

import { cn } from "@/components/shared";

import { useNoteMove } from "../../hooks/useNoteMove";
import { useNoteResize } from "../../hooks/useNoteResize";
import type { NoteColor, ResizeDirection } from "../../types";
import { NoteColorPicker } from "../NoteColorPicker";
import { NoteEditor } from "../NoteEditor";
import { RESIZE_DIRECTIONS, ResizeHandle } from "../ResizeHandle";
import {
  NOTE_BASE,
  NOTE_DELETE_BUTTON,
  NOTE_HEADER,
  NOTE_MOVING,
  NOTE_PENDING_DELETE,
  NOTE_SURFACE,
} from "./styles";
import type { NoteCardProps } from "./types";

function NoteCardBase({
  note,
  zIndex,
  getBoardRect,
  isPendingDelete = false,
  onFocus,
  onMoveStart,
  onMove,
  onMoveEnd,
  onResize,
  onResizeEnd,
  onTextChange,
  onColorChange,
  onDelete,
}: NoteCardProps) {
  const { id } = note;

  const { isMoving, startMove } = useNoteMove({
    note,
    getBoardRect,
    onMoveStart: () => onMoveStart(id),
    onMove: (position, rect) => onMove(id, position, rect),
    onMoveEnd: (position, rect) => onMoveEnd(id, position, rect),
  });

  const { startResize } = useNoteResize({
    note,
    getBoardRect,
    onResize: (rect) => onResize(id, rect),
    onResizeEnd: (rect) => onResizeEnd(id, rect),
  });

  // Memoized handlers keep child props referentially stable, so typing (which
  // re-renders this card via the patched `note`) does not re-render the static
  // ResizeHandles or the color picker.
  const handleResizeStart = useCallback(
    (direction: ResizeDirection, event: React.PointerEvent) => {
      onFocus(id);
      startResize(direction, event);
    },
    [onFocus, startResize, id],
  );

  const handleColorChange = useCallback(
    (color: NoteColor) => onColorChange(id, color),
    [onColorChange, id],
  );

  const handleTextChange = useCallback(
    (text: string) => onTextChange(id, text),
    [onTextChange, id],
  );

  return (
    <article
      data-testid={`note-${id}`}
      aria-label="Note"
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex,
      }}
      onPointerDown={() => onFocus(id)}
      className={cn(
        NOTE_BASE,
        NOTE_SURFACE[note.color],
        isMoving && NOTE_MOVING,
        isPendingDelete && NOTE_PENDING_DELETE,
      )}
    >
      <header className={NOTE_HEADER} onPointerDown={startMove}>
        <NoteColorPicker value={note.color} onChange={handleColorChange} />
        <button
          type="button"
          aria-label="Delete note"
          className={NOTE_DELETE_BUTTON}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onDelete(id)}
        >
          <X className="size-3.5" />
        </button>
      </header>

      <NoteEditor
        value={note.text}
        label="Note content"
        onChange={handleTextChange}
      />

      {RESIZE_DIRECTIONS.map((direction) => (
        <ResizeHandle
          key={direction}
          direction={direction}
          onResizeStart={handleResizeStart}
        />
      ))}
    </article>
  );
}

// Memoized so a drag/resize on one note — which re-renders the Board and the
// store — does not re-render its siblings. Sibling props are referentially
// stable: `note` keeps its reference (the store patches only the moved note),
// `getBoardRect`/handlers are memoized in useBoardController, and
// `isPendingDelete` stays false for non-dragged notes.
export const NoteCard = memo(NoteCardBase);
