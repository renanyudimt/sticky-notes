import type { NoteColor } from '../../types';

/** Paper surface (background + border) per color. Notes stay bright in dark mode. */
export const NOTE_SURFACE: Record<NoteColor, string> = {
  yellow: 'bg-amber-200 border-amber-300 dark:bg-amber-200/95',
  pink: 'bg-pink-200 border-pink-300 dark:bg-pink-200/95',
  blue: 'bg-sky-200 border-sky-300 dark:bg-sky-200/95',
  green: 'bg-emerald-200 border-emerald-300 dark:bg-emerald-200/95',
  purple: 'bg-violet-200 border-violet-300 dark:bg-violet-200/95',
  orange: 'bg-orange-200 border-orange-300 dark:bg-orange-200/95',
};

export const NOTE_BASE = [
  'group absolute flex flex-col overflow-visible',
  'rounded-md border shadow-lg ring-1 ring-black/5',
  'select-none',
].join(' ');

export const NOTE_MOVING = 'shadow-2xl';

export const NOTE_PENDING_DELETE = 'scale-95 opacity-40';

export const NOTE_HEADER =
  'flex shrink-0 cursor-grab items-center justify-between gap-2 px-2 py-1.5 active:cursor-grabbing';

export const NOTE_DELETE_BUTTON =
  'flex size-5 items-center justify-center rounded text-neutral-700/70 transition-colors hover:bg-black/10 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
