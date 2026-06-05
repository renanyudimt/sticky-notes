import type { NoteColor } from '../../types';

/** Solid swatch color used in the picker dots and trigger. */
export const NOTE_SWATCH: Record<NoteColor, string> = {
  yellow: 'bg-amber-300',
  pink: 'bg-pink-300',
  blue: 'bg-sky-300',
  green: 'bg-emerald-300',
  purple: 'bg-violet-300',
  orange: 'bg-orange-300',
};

export const COLOR_TRIGGER =
  'size-5 rounded-full border border-black/20 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const COLOR_GRID = 'grid grid-cols-3 gap-2';

export const COLOR_SWATCH_BUTTON =
  'size-7 rounded-full border border-black/20 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const COLOR_SWATCH_SELECTED = 'ring-2 ring-ring ring-offset-2';
