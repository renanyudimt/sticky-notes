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

/** Renders the hook with a real div wired to its preview ref, as the board does. */
const setup = (onCreate = vi.fn()) => {
  const { result } = renderHook(() =>
    useCreateNoteDrag({ getBoardRect: () => boardRect, onCreate }),
  );
  const element = document.createElement('div');
  result.current.previewRef.current = element;
  return { result, element, onCreate };
};

describe('useCreateNoteDrag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should paint a live preview onto the element while drawing', () => {
    const { result, element } = setup();

    act(() => result.current.startCreate(pointerDown(100, 100)));
    act(() => dispatch('pointermove', 300, 250));

    expect(element.style.display).toBe('block');
    expect(element.style.transform).toBe('translate(100px, 100px)');
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('150px');
  });

  it('should create a note of the drawn size on release', () => {
    const { result, element, onCreate } = setup();

    act(() => result.current.startCreate(pointerDown(100, 100)));
    act(() => dispatch('pointermove', 300, 250));
    act(() => dispatch('pointerup', 300, 250));

    expect(onCreate).toHaveBeenCalledWith({
      x: 100,
      y: 100,
      width: 200,
      height: 150,
    });
    expect(element.style.display).toBe('none');
  });

  it('should not create anything on a plain click (sub-threshold)', () => {
    const { result, onCreate } = setup();

    act(() => result.current.startCreate(pointerDown(400, 300)));
    act(() => dispatch('pointerup', 402, 301));

    expect(onCreate).not.toHaveBeenCalled();
  });

  it('should not paint a preview on a plain click', () => {
    const { result, element } = setup();

    act(() => result.current.startCreate(pointerDown(400, 300)));
    act(() => dispatch('pointerup', 402, 301));

    expect(element.style.transform).toBe('');
  });

  it('should clamp the drawn rect to the board bounds', () => {
    const { result, onCreate } = setup();

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
