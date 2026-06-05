import type { NoteColor } from '../../types';

export interface NoteColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
}
