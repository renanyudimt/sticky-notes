import {
  DEFAULT_NOTE_COLOR,
  DEFAULT_NOTE_SIZE,
  MAX_NOTE_SIZE,
  MIN_NOTE_SIZE,
} from '../../constants';
import type { CreateNoteInput, Note } from '../../types';
import { clampSize } from '../clampSize';
import { generateId } from '../generateId';

/** Build a fully-formed note from a minimal input, applying defaults + clamps. */
export function createNote(input: CreateNoteInput): Note {
  const now = Date.now();
  const size = clampSize(
    {
      width: input.size?.width ?? DEFAULT_NOTE_SIZE.width,
      height: input.size?.height ?? DEFAULT_NOTE_SIZE.height,
    },
    { min: MIN_NOTE_SIZE, max: MAX_NOTE_SIZE },
  );

  return {
    id: generateId(),
    position: input.position,
    size,
    text: input.text ?? '',
    color: input.color ?? DEFAULT_NOTE_COLOR,
    createdAt: now,
    updatedAt: now,
  };
}
