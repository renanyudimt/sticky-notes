import { memo } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shared/components/ui";

import { BOARD_STRINGS, REPOSITORY_OPTIONS } from "../../constants";
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
  repositoryKind,
  isSwitching,
  onRepositoryChange,
  onClear,
}: ToolbarProps) {
  return (
    <ToolbarBar>
      <ToolbarTitleGroup>
        <ToolbarTitle>{BOARD_STRINGS.appTitle}</ToolbarTitle>
        <ToolbarCount>{BOARD_STRINGS.noteCount(noteCount)}</ToolbarCount>
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
              aria-checked={option.value === repositoryKind}
              $active={option.value === repositoryKind}
              disabled={isSwitching}
              onClick={() => onRepositoryChange(option.value)}
            >
              {option.label}
            </SegmentButton>
          ))}
        </SegmentGroup>

        <InfoDialog />

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={noteCount === 0}
        >
          <Trash2 />
          {BOARD_STRINGS.clear}
        </Button>
      </ToolbarGroup>
    </ToolbarBar>
  );
}

// Memoized: the Board re-renders on every pointer move during a drag, but the
// toolbar depends only on `noteCount`/`repositoryKind` (unchanged mid-drag) and
// store actions (stable refs via useShallow), so memo bails on every move.
export const Toolbar = memo(ToolbarBase);
