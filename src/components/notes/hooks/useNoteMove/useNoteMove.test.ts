import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Note } from '../../types';
import { useNoteMove } from './useNoteMove';

const note: Note = {
  id: 'n1',
  position: { x: 100, y: 100 },
  size: { width: 100, height: 100 },
  text: '',
  color: 'yellow',
  zIndex: 0,
  createdAt: 0,
  updatedAt: 0,
};

const boardRect = { width: 800, height: 600, left: 0, top: 0 } as DOMRect;

const pointerDown = () =>
  ({
    button: 0,
    clientX: 0,
    clientY: 0,
    nativeEvent: {} as PointerEvent,
  }) as React.PointerEvent;

const dispatch = (type: string, clientX: number, clientY: number) => {
  window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
};

describe('useNoteMove', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should translate the note by the pointer delta', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useNoteMove({
        note,
        getBoardRect: () => boardRect,
        onMove,
        onMoveEnd: vi.fn(),
      }),
    );

    act(() => result.current.startMove(pointerDown()));
    act(() => dispatch('pointermove', 30, 40));

    expect(onMove).toHaveBeenCalledWith(
      { x: 130, y: 140 },
      { x: 130, y: 140, width: 100, height: 100 },
    );
  });

  it('should clamp the note within the board bounds', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() =>
      useNoteMove({
        note,
        getBoardRect: () => boardRect,
        onMove,
        onMoveEnd: vi.fn(),
      }),
    );

    act(() => result.current.startMove(pointerDown()));
    act(() => dispatch('pointermove', 9999, 9999));

    // board 800x600, note 100x100 → max x=700, y=500
    expect(onMove).toHaveBeenLastCalledWith(
      { x: 700, y: 500 },
      expect.objectContaining({ x: 700, y: 500 }),
    );
  });

  it('should report the final rect on move end', () => {
    const onMoveEnd = vi.fn();
    const { result } = renderHook(() =>
      useNoteMove({
        note,
        getBoardRect: () => boardRect,
        onMove: vi.fn(),
        onMoveEnd,
      }),
    );

    act(() => result.current.startMove(pointerDown()));
    act(() => dispatch('pointerup', 10, 20));

    expect(onMoveEnd).toHaveBeenCalledWith(
      { x: 110, y: 120 },
      { x: 110, y: 120, width: 100, height: 100 },
    );
  });
});
