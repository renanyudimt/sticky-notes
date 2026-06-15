import { memo } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shared/components/ui";
import { cn } from "@/components/shared";

import { BOARD_STRINGS, REPOSITORY_OPTIONS } from "../../constants";
import { InfoDialog } from "../InfoDialog";
import {
  SEGMENT_BUTTON,
  SEGMENT_BUTTON_ACTIVE,
  SEGMENT_GROUP,
  TOOLBAR,
  TOOLBAR_COUNT,
  TOOLBAR_TITLE,
} from "./styles";
import type { ToolbarProps } from "./types";

function ToolbarBase({
  noteCount,
  repositoryKind,
  onRepositoryChange,
  onClear,
}: ToolbarProps) {
  return (
    <header className={TOOLBAR}>
      <div className="flex items-baseline gap-3">
        <h1 className={TOOLBAR_TITLE}>{BOARD_STRINGS.appTitle}</h1>
        <span className={TOOLBAR_COUNT}>
          {BOARD_STRINGS.noteCount(noteCount)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={SEGMENT_GROUP}
          role="radiogroup"
          aria-label={BOARD_STRINGS.storageLabel}
        >
          {REPOSITORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={option.value === repositoryKind}
              onClick={() => onRepositoryChange(option.value)}
              className={cn(
                SEGMENT_BUTTON,
                option.value === repositoryKind && SEGMENT_BUTTON_ACTIVE,
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

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
      </div>
    </header>
  );
}

// Memoized: the Board re-renders on every pointer move during a drag, but the
// toolbar depends only on `noteCount`/`repositoryKind` (unchanged mid-drag) and
// store actions (stable refs via useShallow), so memo bails on every move.
export const Toolbar = memo(ToolbarBase);
