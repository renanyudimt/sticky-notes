import type { ResizeDirection } from '../../types';

export const RESIZE_DIRECTIONS: readonly ResizeDirection[] = [
  'nw',
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
];

export const RESIZE_HANDLE_LABEL: Record<ResizeDirection, string> = {
  n: 'Resize up',
  s: 'Resize down',
  e: 'Resize right',
  w: 'Resize left',
  ne: 'Resize to the top-right corner',
  nw: 'Resize to the top-left corner',
  se: 'Resize to the bottom-right corner',
  sw: 'Resize to the bottom-left corner',
};
