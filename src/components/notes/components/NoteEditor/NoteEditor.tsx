import { cn } from "@/components/shared";

import { NOTE_PLACEHOLDER } from "./constants";
import { NOTE_EDITOR } from "./styles";
import type { NoteEditorProps } from "./types";

export function NoteEditor({ value, onChange, label }: NoteEditorProps) {
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
