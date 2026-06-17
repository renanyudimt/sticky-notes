import { memo, useCallback, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/components/ui";

import { NOTE_COLOR_OPTIONS } from "../../constants";
import {
  ColorGrid,
  ColorTrigger,
  POPOVER_AUTO_WIDTH,
  SwatchButton,
} from "./styles";
import type { NoteColorPickerProps } from "./types";
import type { NoteColor } from "../../types";

function NoteColorPickerBase({ value, onChange }: NoteColorPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (color: NoteColor) => {
      onChange(color);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ColorTrigger
          type="button"
          $color={value}
          aria-label="Change note color"
          onPointerDown={(event) => event.stopPropagation()}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={POPOVER_AUTO_WIDTH}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <ColorGrid role="listbox" aria-label="Colors">
          {NOTE_COLOR_OPTIONS.map((option) => (
            <SwatchButton
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              aria-label={option.label}
              $color={option.value}
              $selected={option.value === value}
              onClick={() => handleSelect(option.value)}
            />
          ))}
        </ColorGrid>
      </PopoverContent>
    </Popover>
  );
}

export const NoteColorPicker = memo(NoteColorPickerBase);
