export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Axis-aligned rectangle in board space. */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type NoteColor =
  | 'yellow'
  | 'pink'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange';

/** The eight resize grips, named by compass direction. */
export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface Note {
  id: string;
  position: Position;
  size: Size;
  text: string;
  color: NoteColor;
  createdAt: number;
  updatedAt: number;
}

/** Minimal shape required to create a note; the rest is derived. */
export interface CreateNoteInput {
  position: Position;
  size?: Partial<Size>;
  color?: NoteColor;
  text?: string;
}

export interface SizeConstraints {
  min: Size;
  max: Size;
}

export interface NoteColorOption {
  value: NoteColor;
  label: string;
}
