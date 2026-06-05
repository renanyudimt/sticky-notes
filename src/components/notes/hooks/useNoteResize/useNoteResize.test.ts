import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Note } from '../../types';
import { useNoteResize } from './useNoteResize';

const note: Note = {
  id: 'n1',
  position: { x: 100, y: 100 },
  size: { width: 200, height: 200 },
  text: '',
  color: 'yellow',
  zIndex: 1,
  createdAt: 0,
  updatedAt: 0,
};

const boardRect = { width: 1000, height: 1000, left: 0, top: 0 } as DOMRect;

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

describe('useNoteResize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should grow the note from the south-east handle', () => {
    const onResize = vi.fn();
    const { result } = renderHook(() =>
      useNoteResize({
        note,
        getBoardRect: () => boardRect,
        onResize,
        onResizeEnd: vi.fn(),
      }),
    );

    act(() => result.current.startResize('se', pointerDown()));
    act(() => dispatch('pointermove', 50, 30));

    expect(onResize).toHaveBeenCalledWith({
      x: 100,
      y: 100,
      width: 250,
      height: 230,
    });
  });

  it('should keep the right edge pinned when resizing from the west', () => {
    const onResize = vi.fn();
    const { result } = renderHook(() =>
      useNoteResize({
        note,
        getBoardRect: () => boardRect,
        onResize,
        onResizeEnd: vi.fn(),
      }),
    );

    act(() => result.current.startResize('w', pointerDown()));
    act(() => dispatch('pointermove', -40, 0));

    expect(onResize).toHaveBeenCalledWith({
      x: 60,
      y: 100,
      width: 240,
      height: 200,
    });
  });

  it('should report the final rect on resize end', () => {
    const onResizeEnd = vi.fn();
    const { result } = renderHook(() =>
      useNoteResize({
        note,
        getBoardRect: () => boardRect,
        onResize: vi.fn(),
        onResizeEnd,
      }),
    );

    act(() => result.current.startResize('se', pointerDown()));
    act(() => dispatch('pointerup', 20, 20));

    expect(onResizeEnd).toHaveBeenCalledWith({
      x: 100,
      y: 100,
      width: 220,
      height: 220,
    });
  });
});
