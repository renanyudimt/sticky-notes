import { memo } from "react";
import { X } from "lucide-react";

import { NoteColorPicker } from "../NoteColorPicker";
import { NoteDeleteButton, NoteHeader } from "./styles";
import type { NoteCardHeaderProps } from "./types";
import { stopPropagation } from "./constants";

function NoteCardHeaderBase({
  color,
  onColorChange,
  onDelete,
  onPointerDown,
}: NoteCardHeaderProps) {
  return (
    <NoteHeader onPointerDown={onPointerDown}>
      <NoteColorPicker value={color} onChange={onColorChange} />
      <NoteDeleteButton
        type="button"
        aria-label="Delete note"
        onPointerDown={stopPropagation}
        onClick={onDelete}
      >
        <X />
      </NoteDeleteButton>
    </NoteHeader>
  );
}

export const NoteCardHeader = memo(NoteCardHeaderBase);
