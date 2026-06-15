import { memo } from "react";

import { cn } from "@/components/shared";

import { NOTE_PLACEHOLDER } from "./constants";
import { NOTE_EDITOR } from "./styles";
import type { NoteEditorProps } from "./types";

function NoteEditorBase({ value, onChange, label }: NoteEditorProps) {
  return (
    <textarea
      aria-label={label}
      className={cn(NOTE_EDITOR)}
      placeholder={NOTE_PLACEHOLDER}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onPointerDown={(event) => event.stopPropagation()}
    />
  );
}

// Memoized so non-text patches to the note (color change, move/resize end,
// focus, pending-delete) re-render NoteCard without re-rendering the textarea.
// On typing, `value` changes, so it still re-renders as expected.
export const NoteEditor = memo(NoteEditorBase);
