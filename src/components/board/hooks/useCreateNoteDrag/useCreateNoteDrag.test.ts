import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateNoteDrag } from './useCreateNoteDrag';

const boardRect = { width: 1000, height: 800, left: 0, top: 0 } as DOMRect;

const pointerDown = (clientX: number, clientY: number) =>
  ({
    button: 0,
    clientX,
    clientY,
    nativeEvent: {} as PointerEvent,
  }) as React.PointerEvent;

const dispatch = (type: string, clientX: number, clientY: number) => {
  window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
};

describe('useCreateNoteDrag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should expose a live preview while drawing', () => {
    const { result } = renderHook(() =>
      useCreateNoteDrag({ getBoardRect: () => boardRect, onCreate: vi.fn() }),
    );

    act(() => result.current.startCreate(pointerDown(100, 100)));
    act(() => dispatch('pointermove', 300, 250));

    expect(result.current.previewRect).toEqual({
      x: 100,
      y: 100,
      width: 200,
      height: 150,
    });
  });

  it('should create a note of the drawn size on release', () => {
    const onCreate = vi.fn();
    const { result } = renderHook(() =>
      useCreateNoteDrag({ getBoardRect: () => boardRect, onCreate }),
    );

    act(() => result.current.startCreate(pointerDown(100, 100)));
    act(() => dispatch('pointermove', 300, 250));
    act(() => dispatch('pointerup', 300, 250));

    expect(onCreate).toHaveBeenCalledWith({
      x: 100,
      y: 100,
      width: 200,
      height: 150,
    });
    expect(result.current.previewRect).toBeNull();
  });

  it('should not create anything on a plain click (sub-threshold)', () => {
    const onCreate = vi.fn();
    const { result } = renderHook(() =>
      useCreateNoteDrag({ getBoardRect: () => boardRect, onCreate }),
    );

    act(() => result.current.startCreate(pointerDown(400, 300)));
    act(() => dispatch('pointerup', 402, 301));

    expect(onCreate).not.toHaveBeenCalled();
  });

  it('should clamp the drawn rect to the board bounds', () => {
    const onCreate = vi.fn();
    const { result } = renderHook(() =>
      useCreateNoteDrag({ getBoardRect: () => boardRect, onCreate }),
    );

    act(() => result.current.startCreate(pointerDown(900, 700)));
    act(() => dispatch('pointerup', 5000, 5000));

    expect(onCreate).toHaveBeenCalledWith({
      x: 900,
      y: 700,
      width: 100,
      height: 100,
    });
  });
});
