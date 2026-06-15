import { useCallback, useMemo, type RefObject } from "react";

import {
  clampPosition,
  DEFAULT_NOTE_SIZE,
  rectsIntersect,
  useNoteActions,
  useNoteIds,
  useNotesStatus,
  useRepositoryKind,
  type Rect,
} from "@/components/notes";

import { useCreateNoteDrag } from "../useCreateNoteDrag";
import { toBoardRect } from "../../utils";
import type { BoardController, NoteInteractionHandlers } from "./types";

export function useBoardController(
  boardRef: RefObject<HTMLDivElement | null>,
  trashRef: RefObject<HTMLDivElement | null>,
): BoardController {
  const noteIds = useNoteIds();
  const status = useNotesStatus();
  const repositoryKind = useRepositoryKind();
  const actions = useNoteActions();

  const getBoardRect = useCallback(
    () => boardRef.current?.getBoundingClientRect() ?? null,
    [boardRef],
  );

  const isOverTrashZone = useCallback(
    (rect: Rect) => {
      const board = getBoardRect();
      const trash = trashRef.current?.getBoundingClientRect();
      if (!board || !trash) return false;
      return rectsIntersect(rect, toBoardRect(trash, board));
    },
    [getBoardRect, trashRef],
  );

  const { isCreating, previewRect, startCreate } = useCreateNoteDrag({
    getBoardRect,
    onCreate: (rect) =>
      actions.addNote({
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
      }),
  });

  const onBoardPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.target === event.currentTarget) startCreate(event);
    },
    [startCreate],
  );

  const onBoardDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target !== event.currentTarget) return;
      const board = getBoardRect();
      if (!board) return;

      const position = clampPosition(
        {
          x: event.clientX - board.left - DEFAULT_NOTE_SIZE.width / 2,
          y: event.clientY - board.top - DEFAULT_NOTE_SIZE.height / 2,
        },
        DEFAULT_NOTE_SIZE,
        { width: board.width, height: board.height },
      );

      actions.addNote({ position });
    },
    [actions, getBoardRect],
  );

  const noteHandlers: NoteInteractionHandlers = useMemo(
    () => ({
      onFocus: actions.bringToFront,
      onMoveStart: (id) => actions.setDragging(id),
      onMove: (id, position, rect) => {
        actions.moveNote(id, position);
        actions.setOverTrash(isOverTrashZone(rect));
      },
      onMoveEnd: (id, position, rect) => {
        if (isOverTrashZone(rect)) {
          actions.removeNote(id);
        } else {
          actions.moveNote(id, position);
        }
        actions.setDragging(null);
        actions.setOverTrash(false);
      },
      onResize: (id, rect) => actions.resizeNote(id, rect),
      onResizeEnd: (id, rect) => actions.resizeNote(id, rect),
      onTextChange: actions.editNoteText,
      onColorChange: actions.changeNoteColor,
      onDelete: actions.removeNote,
    }),
    [actions, isOverTrashZone],
  );

  return {
    noteIds,
    noteCount: noteIds.length,
    status,
    previewRect,
    isCreating,
    repositoryKind,
    getBoardRect,
    onBoardPointerDown,
    onBoardDoubleClick,
    onClear: actions.clear,
    onRepositoryChange: actions.switchRepository,
    noteHandlers,
  };
}
