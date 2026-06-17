import { useRef } from "react";

import { NoteCardConnector } from "@/components/notes";

import { BOARD_STRINGS } from "../../constants";
import { useBoardController } from "../../hooks";
import { CreatePreview } from "../CreatePreview";
import { Toolbar } from "../Toolbar";
import { TrashZoneConnector } from "../TrashZoneConnector";
import {
  BoardError,
  BoardHint,
  BoardLayout,
  BoardLoading,
  BoardOverlay,
  BoardSurface,
  Spinner,
} from "./styles";

export function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  const controller = useBoardController(boardRef, trashRef);

  const {
    noteIds,
    noteCount,
    status,
    previewRef,
    isCreating,
    repositoryKind,
    getBoardRect,
    onBoardPointerDown,
    onBoardDoubleClick,
    onClear,
    onRepositoryChange,
    noteHandlers,
  } = controller;

  const showEmptyHint = status !== "loading" && noteCount === 0 && !isCreating;

  return (
    <BoardLayout>
      <Toolbar
        noteCount={noteCount}
        repositoryKind={repositoryKind}
        isSwitching={status === "loading"}
        onRepositoryChange={onRepositoryChange}
        onClear={onClear}
      />

      <BoardSurface
        ref={boardRef}
        data-testid="board"
        onPointerDown={onBoardPointerDown}
        onDoubleClick={onBoardDoubleClick}
      >
        {status !== "loading" &&
          noteIds.map((id, index) => (
            <NoteCardConnector
              key={id}
              id={id}
              zIndex={index}
              getBoardRect={getBoardRect}
              {...noteHandlers}
            />
          ))}

        <CreatePreview ref={previewRef} />

        {status === "loading" && (
          <BoardOverlay role="status" aria-live="polite">
            <BoardLoading>
              <Spinner aria-hidden="true" />
              <BoardHint>{BOARD_STRINGS.loading}</BoardHint>
            </BoardLoading>
          </BoardOverlay>
        )}

        {status === "error" && (
          <BoardOverlay>
            <BoardError>{BOARD_STRINGS.error}</BoardError>
          </BoardOverlay>
        )}

        {showEmptyHint && (
          <BoardOverlay>
            <BoardHint>{BOARD_STRINGS.emptyHint}</BoardHint>
          </BoardOverlay>
        )}

        <TrashZoneConnector ref={trashRef} />
      </BoardSurface>
    </BoardLayout>
  );
}
