import { memo } from "react";

import { BOARD_STRINGS, REPOSITORY_OPTIONS } from "../../constants";
import { ActivityIndicatorConnector } from "../ActivityIndicatorConnector";
import { ClearAllDialog } from "../ClearAllDialog";
import { InfoDialog } from "../InfoDialog";
import { ThemeToggle } from "../ThemeToggle";
import {
  SegmentButton,
  SegmentGroup,
  ToolbarBar,
  ToolbarCount,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarTitleGroup,
} from "./styles";
import type { ToolbarProps } from "./types";

function ToolbarBase({
  noteCount,
  dataSource,
  isSwitching,
  onDataSourceChange,
  onClear,
  onSeed,
}: ToolbarProps) {
  return (
    <ToolbarBar>
      <ToolbarTitleGroup>
        <ToolbarTitle>{BOARD_STRINGS.appTitle}</ToolbarTitle>
        <ToolbarCount>{BOARD_STRINGS.noteCount(noteCount)}</ToolbarCount>
        <ActivityIndicatorConnector />
      </ToolbarTitleGroup>

      <ToolbarGroup>
        <ThemeToggle />

        <SegmentGroup
          role="radiogroup"
          aria-label={BOARD_STRINGS.storageLabel}
          aria-busy={isSwitching}
        >
          {REPOSITORY_OPTIONS.map((option) => (
            <SegmentButton
              key={option.value}
              type="button"
              role="radio"
              aria-checked={option.value === dataSource}
              $active={option.value === dataSource}
              disabled={isSwitching}
              onClick={() => onDataSourceChange(option.value)}
            >
              {option.label}
            </SegmentButton>
          ))}
        </SegmentGroup>

        <InfoDialog onSeed={onSeed} />

        <ClearAllDialog onConfirm={onClear} disabled={noteCount === 0} />
      </ToolbarGroup>
    </ToolbarBar>
  );
}

// Memoized: the Board re-renders on every pointer move during a drag, but the
// toolbar depends only on `noteCount`/`dataSource` (unchanged mid-drag) and
// store actions (stable refs via useShallow), so memo bails on every move.
export const Toolbar = memo(ToolbarBase);
