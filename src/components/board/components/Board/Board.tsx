import { useRef } from "react";

import { NoteCardConnector } from "@/components/notes";

import { BOARD_STRINGS } from "../../constants";
import { useBoardController } from "../../hooks";
import { CreatePreview } from "../CreatePreview";
import { Toolbar } from "../Toolbar";
import { TrashZoneConnector } from "../TrashZoneConnector";
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
    noteIds,
    noteCount,
    status,
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
    status !== "loading" && noteCount === 0 && !isCreating;

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        noteCount={noteCount}
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
        {noteIds.map((id, index) => (
          <NoteCardConnector
            key={id}
            id={id}
            zIndex={index}
            getBoardRect={getBoardRect}
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

        <TrashZoneConnector ref={trashRef} />
      </div>
    </div>
  );
}
