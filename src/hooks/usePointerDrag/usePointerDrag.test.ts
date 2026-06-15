import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePointerDrag } from './usePointerDrag';

const pointerDown = (overrides: Partial<React.PointerEvent> = {}) =>
  ({
    button: 0,
    clientX: 10,
    clientY: 20,
    nativeEvent: {} as PointerEvent,
    ...overrides,
  }) as React.PointerEvent;

const dispatch = (type: string, clientX: number, clientY: number) => {
  window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
};

describe('usePointerDrag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not be dragging initially', () => {
    const { result } = renderHook(() => usePointerDrag({}));
    expect(result.current.isDragging).toBe(false);
  });

  it('should set dragging state on start and clear it on end', () => {
    const { result } = renderHook(() => usePointerDrag({}));

    act(() => result.current.startDrag(pointerDown()));
    expect(result.current.isDragging).toBe(true);

    act(() => dispatch('pointerup', 10, 20));
    expect(result.current.isDragging).toBe(false);
  });

  it('should ignore non-primary buttons', () => {
    const onDragStart = vi.fn();
    const { result } = renderHook(() => usePointerDrag({ onDragStart }));

    act(() => result.current.startDrag(pointerDown({ button: 2 })));

    expect(result.current.isDragging).toBe(false);
    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('should report movement deltas relative to the origin', () => {
    const onDragMove = vi.fn();
    const { result } = renderHook(() => usePointerDrag({ onDragMove }));

    act(() => result.current.startDrag(pointerDown({ clientX: 10, clientY: 20 })));
    act(() => dispatch('pointermove', 35, 50));

    expect(onDragMove).toHaveBeenCalledWith(
      { dx: 25, dy: 30 },
      { x: 35, y: 50 },
      expect.any(MouseEvent),
    );
  });

  it('should report the final delta on drag end', () => {
    const onDragEnd = vi.fn();
    const { result } = renderHook(() => usePointerDrag({ onDragEnd }));

    act(() => result.current.startDrag(pointerDown({ clientX: 0, clientY: 0 })));
    act(() => dispatch('pointerup', 100, 40));

    expect(onDragEnd).toHaveBeenCalledWith(
      { dx: 100, dy: 40 },
      { x: 100, y: 40 },
      expect.any(MouseEvent),
    );
  });

  it('should not start on a sub-threshold click when a threshold is set', () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    const { result } = renderHook(() =>
      usePointerDrag({ onDragStart, onDragEnd }, 16),
    );

    act(() => result.current.startDrag(pointerDown({ clientX: 10, clientY: 20 })));
    expect(result.current.isDragging).toBe(false);
    expect(onDragStart).not.toHaveBeenCalled();

    act(() => dispatch('pointerup', 12, 21));

    expect(result.current.isDragging).toBe(false);
    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('should start once movement crosses the threshold', () => {
    const onDragStart = vi.fn();
    const onDragMove = vi.fn();
    const { result } = renderHook(() =>
      usePointerDrag({ onDragStart, onDragMove }, 16),
    );

    act(() => result.current.startDrag(pointerDown({ clientX: 10, clientY: 20 })));
    act(() => dispatch('pointermove', 14, 22));

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragMove).not.toHaveBeenCalled();

    act(() => dispatch('pointermove', 40, 22));

    expect(result.current.isDragging).toBe(true);
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragMove).toHaveBeenCalledWith(
      { dx: 30, dy: 2 },
      { x: 40, y: 22 },
      expect.any(MouseEvent),
    );
  });

  it('should stop listening after the gesture ends', () => {
    const onDragMove = vi.fn();
    const { result } = renderHook(() => usePointerDrag({ onDragMove }));

    act(() => result.current.startDrag(pointerDown()));
    act(() => dispatch('pointerup', 10, 20));
    act(() => dispatch('pointermove', 999, 999));

    expect(onDragMove).not.toHaveBeenCalled();
  });
});
