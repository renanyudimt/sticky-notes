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
    isLoading,
    isError,
    previewRef,
    isCreating,
    dataSource,
    getBoardRect,
    onBoardPointerDown,
    onBoardDoubleClick,
    onClear,
    onSeed,
    onDataSourceChange,
    noteHandlers,
  } = controller;

  const showEmptyHint = !isLoading && noteCount === 0 && !isCreating;

  return (
    <BoardLayout>
      <Toolbar
        noteCount={noteCount}
        dataSource={dataSource}
        isSwitching={isLoading}
        onDataSourceChange={onDataSourceChange}
        onClear={onClear}
        onSeed={onSeed}
      />

      <BoardSurface
        ref={boardRef}
        data-testid="board"
        onPointerDown={onBoardPointerDown}
        onDoubleClick={onBoardDoubleClick}
      >
        {!isLoading &&
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

        {isLoading && (
          <BoardOverlay role="status" aria-live="polite">
            <BoardLoading>
              <Spinner aria-hidden="true" />
              <BoardHint>{BOARD_STRINGS.loading}</BoardHint>
            </BoardLoading>
          </BoardOverlay>
        )}

        {isError && (
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
