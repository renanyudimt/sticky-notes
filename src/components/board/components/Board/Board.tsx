import { useRef } from "react";

import { NoteCard } from "@/components/notes";

import { BOARD_STRINGS } from "../../constants";
import { useBoardController } from "../../hooks";
import { CreatePreview } from "../CreatePreview";
import { Toolbar } from "../Toolbar";
import { TrashZone } from "../TrashZone";
import {
  BOARD_ERROR,
  BOARD_HINT,
  BOARD_OVERLAY,
  BOARD_SURFACE,
} from "./styles";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const controller = useBoardController(boardRef, trashRef);

  const {
    notes,
    status,
    draggingId,
    isOverTrash,
    previewRect,
    isCreating,
    repositoryKind,
    getBoardRect,
    onBoardPointerDown,
    onBoardDoubleClick,
    onClear,
    onRepositoryChange,
    noteHandlers,
  } = controller;

  const showEmptyHint =
    status !== "loading" && notes.length === 0 && !isCreating;

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        noteCount={notes.length}
        repositoryKind={repositoryKind}
        onRepositoryChange={onRepositoryChange}
        onClear={onClear}
      />

      <div
        ref={boardRef}
        data-testid="board"
        onPointerDown={onBoardPointerDown}
        onDoubleClick={onBoardDoubleClick}
        className={BOARD_SURFACE}
      >
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            getBoardRect={getBoardRect}
            isPendingDelete={draggingId === note.id && isOverTrash}
            {...noteHandlers}
          />
        ))}

        {previewRect && <CreatePreview rect={previewRect} />}

        {status === "loading" && (
          <div className={BOARD_OVERLAY}>
            <p className={BOARD_HINT}>{BOARD_STRINGS.loading}</p>
          </div>
        )}

        {status === "error" && (
          <div className={BOARD_OVERLAY}>
            <p className={BOARD_ERROR}>{BOARD_STRINGS.error}</p>
          </div>
        )}

        {showEmptyHint && (
          <div className={BOARD_OVERLAY}>
            <p className={BOARD_HINT}>{BOARD_STRINGS.emptyHint}</p>
          </div>
        )}

        <TrashZone
          ref={trashRef}
          isActive={draggingId !== null && isOverTrash}
        />
      </div>
    </div>
  );
}
