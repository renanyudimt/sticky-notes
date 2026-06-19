import { memo } from "react";

import { DeleteNoteDialog } from "../DeleteNoteDialog";
import { NoteColorPicker } from "../NoteColorPicker";
import { NoteHeader } from "./styles";
import type { NoteCardHeaderProps } from "./types";

function NoteCardHeaderBase({
  color,
  onColorChange,
  onDelete,
  onPointerDown,
}: NoteCardHeaderProps) {
  return (
    <NoteHeader data-testid="note-drag-handle" onPointerDown={onPointerDown}>
      <NoteColorPicker value={color} onChange={onColorChange} />
      <DeleteNoteDialog onConfirm={onDelete} />
    </NoteHeader>
  );
}

export const NoteCardHeader = memo(NoteCardHeaderBase);
