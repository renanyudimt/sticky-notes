import { memo, useCallback } from "react";

import { useNoteMove } from "../../hooks/useNoteMove";
import { useNoteResize } from "../../hooks/useNoteResize";
import type { NoteColor, ResizeDirection } from "../../types";
import { NoteCardHeader } from "../NoteCardHeader";
import { NoteEditorConnector } from "../NoteEditorConnector";
import { RESIZE_DIRECTIONS, ResizeHandle } from "../ResizeHandle";
import { NoteSurface } from "./styles";
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

  const handleDelete = useCallback(() => onDelete(id), [onDelete, id]);

  return (
    <NoteSurface
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
      $color={note.color}
      $isMoving={isMoving}
      $isPendingDelete={isPendingDelete}
    >
      <NoteCardHeader
        color={note.color}
        onColorChange={handleColorChange}
        onDelete={handleDelete}
        onPointerDown={startMove}
      />

      <NoteEditorConnector id={id} />

      {RESIZE_DIRECTIONS.map((direction) => (
        <ResizeHandle
          key={direction}
          direction={direction}
          onResizeStart={handleResizeStart}
        />
      ))}
    </NoteSurface>
  );
}

export const NoteCard = memo(NoteCardBase);
