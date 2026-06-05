import type { Size, SizeConstraints } from '../../types';

export interface ResizeConstraints extends SizeConstraints {
  /** Board size; resizing never pushes the note outside it. */
  bounds: Size;
}
