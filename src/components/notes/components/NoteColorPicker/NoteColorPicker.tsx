import { memo } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/components/ui";
import { cn } from "@/components/shared";

import { NOTE_COLOR_OPTIONS } from "../../constants";
import {
  COLOR_GRID,
  COLOR_SWATCH_BUTTON,
  COLOR_SWATCH_SELECTED,
  COLOR_TRIGGER,
  NOTE_SWATCH,
} from "./styles";
import type { NoteColorPickerProps } from "./types";

function NoteColorPickerBase({ value, onChange }: NoteColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Change note color"
        onPointerDown={(event) => event.stopPropagation()}
        className={cn(COLOR_TRIGGER, NOTE_SWATCH[value])}
      />
      <PopoverContent
        align="start"
        className="w-auto"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className={COLOR_GRID} role="listbox" aria-label="Colors">
          {NOTE_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              aria-label={option.label}
              onClick={() => onChange(option.value)}
              className={cn(
                COLOR_SWATCH_BUTTON,
                NOTE_SWATCH[option.value],
                option.value === value && COLOR_SWATCH_SELECTED,
              )}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Memoized so typing in a note (which re-renders NoteCard) does not re-render
// the color picker; `onChange` is memoized in NoteCard.
export const NoteColorPicker = memo(NoteColorPickerBase);
