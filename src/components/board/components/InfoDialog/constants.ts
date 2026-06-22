import {
  Database,
  Eraser,
  Frame,
  Maximize2,
  MousePointerClick,
  Move,
  Palette,
  Trash2,
} from 'lucide-react';

import type { InfoSection } from './types';

export const INFO_DIALOG = {
  triggerLabel: 'How to use',
  title: 'How to use Sticky Notes',
  description: 'A quick guide to every board interaction.',
  seedLabel: 'Simulate 100 empty cards',
} as const;

export const INFO_SECTIONS: readonly InfoSection[] = [
  {
    icon: MousePointerClick,
    title: 'Create a default note',
    description: 'Double-click anywhere on an empty area of the board.',
  },
  {
    icon: Frame,
    title: 'Create a note with a custom size',
    description:
      'Press and drag on an empty area to draw the note at the size you want.',
  },
  {
    icon: Move,
    title: 'Move',
    description: 'Drag the note by its header to reposition it.',
  },
  {
    icon: Maximize2,
    title: 'Resize',
    description:
      'Hover over the note and drag any of the 8 handles on its edges and corners.',
  },
  {
    icon: Palette,
    title: 'Edit text, color and order',
    description:
      'Write in the note body, switch the color with the picker in the header. Clicking a note brings it to the front.',
  },
  {
    icon: Trash2,
    title: 'Delete',
    description:
      'Drag the note to the trash zone at the bottom of the board, or use the X in the header.',
  },
  {
    icon: Database,
    title: 'Local vs API (mock)',
    description:
      'Local: saves to the browser localStorage, instantly. API (mock): an async repository that simulates network latency (~280 ms) and stores the data separately — it demonstrates integration with a real API.',
  },
  {
    icon: Eraser,
    title: 'Clear all',
    description: 'Removes every note from the selected storage.',
  },
];
