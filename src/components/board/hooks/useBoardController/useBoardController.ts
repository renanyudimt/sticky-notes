import { useCallback, useMemo, type RefObject } from "react";

import {
  clampPosition,
  DEFAULT_NOTE_SIZE,
  rectsIntersect,
  setDragging,
  setOverTrash,
  useDataSource,
  useNoteIds,
  useNotesError,
  useNotesLoading,
  useNotesMutations,
  type Rect,
} from "@/components/notes";
import { SEED_NOTE_COUNT } from "@/services/notes";

import { useCreateNoteDrag } from "../useCreateNoteDrag";
import { toBoardRect } from "../../utils";
import type { BoardController, NoteInteractionHandlers } from "./types";

export function useBoardController(
  boardRef: RefObject<HTMLDivElement | null>,
  trashRef: RefObject<HTMLDivElement | null>,
): BoardController {
  const { dataSource, setDataSource } = useDataSource();
  const noteIds = useNoteIds();
  const isLoading = useNotesLoading();
  const isError = useNotesError();
  const mutations = useNotesMutations();

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

  const { isCreating, previewRef, startCreate } = useCreateNoteDrag({
    getBoardRect,
    onCreate: (rect) =>
      mutations.createNote({
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

  const onSeed = useCallback(
    () => mutations.seedNotes(SEED_NOTE_COUNT),
    [mutations],
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

      mutations.createNote({ position });
    },
    [mutations, getBoardRect],
  );

  const noteHandlers: NoteInteractionHandlers = useMemo(
    () => ({
      onFocus: mutations.bringToFront,
      onMoveStart: (id) => setDragging(id),
      onMove: (id, position, rect) => {
        mutations.patchNote(id, { position });
        setOverTrash(isOverTrashZone(rect));
      },
      onMoveEnd: (id, position, rect) => {
        if (isOverTrashZone(rect)) {
          void mutations.deleteNote(id);
        } else {
          mutations.commitNote(id, { position });
          mutations.bringToFront(id);
        }
        setDragging(null);
        setOverTrash(false);
      },
      onResize: (id, rect) =>
        mutations.patchNote(id, {
          position: { x: rect.x, y: rect.y },
          size: { width: rect.width, height: rect.height },
        }),
      onResizeEnd: (id, rect) =>
        mutations.commitNote(id, {
          position: { x: rect.x, y: rect.y },
          size: { width: rect.width, height: rect.height },
        }),
      onColorChange: (id, color) => mutations.commitNote(id, { color }),
      onEditText: (id, text) => mutations.commitNote(id, { text }),
      onDelete: (id) => mutations.deleteNote(id),
    }),
    [mutations, isOverTrashZone],
  );

  return {
    noteIds,
    noteCount: noteIds.length,
    isLoading,
    isError,
    previewRef,
    isCreating,
    dataSource: dataSource,
    getBoardRect,
    onBoardPointerDown,
    onBoardDoubleClick,
    onClear: mutations.clearNotes,
    onSeed,
    onDataSourceChange: setDataSource,
    noteHandlers,
  };
}
