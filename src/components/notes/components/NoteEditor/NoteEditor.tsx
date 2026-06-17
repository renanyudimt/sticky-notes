import { memo } from "react";

import { NOTE_PLACEHOLDER } from "./constants";
import { NoteTextarea } from "./styles";
import type { NoteEditorProps } from "./types";

function NoteEditorBase({ value, onChange, label }: NoteEditorProps) {
  return (
    <NoteTextarea
      aria-label={label}
      placeholder={NOTE_PLACEHOLDER}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onPointerDown={(event) => event.stopPropagation()}
    />
  );
}

export const NoteEditor = memo(NoteEditorBase);
