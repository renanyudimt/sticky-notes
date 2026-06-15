import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRenderCounter, RenderProbe } from '@/test/renderCount';

import type { Note as NoteModel } from '../../types';
import { NoteCard } from './NoteCard';

const createMockNote = (overrides: Partial<NoteModel> = {}): NoteModel => ({
  id: 'note-1',
  position: { x: 40, y: 60 },
  size: { width: 200, height: 180 },
  text: 'Reminder',
  color: 'yellow',
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

const createMockHandlers = () => ({
  getBoardRect: () => ({ width: 1000, height: 800, left: 0, top: 0 }) as DOMRect,
  onFocus: vi.fn(),
  onMoveStart: vi.fn(),
  onMove: vi.fn(),
  onMoveEnd: vi.fn(),
  onResize: vi.fn(),
  onResizeEnd: vi.fn(),
  onTextChange: vi.fn(),
  onColorChange: vi.fn(),
  onDelete: vi.fn(),
});

const renderNote = (overrides: Partial<NoteModel> = {}) => {
  const handlers = createMockHandlers();
  const note = createMockNote(overrides);
  render(<NoteCard note={note} zIndex={3} {...handlers} />);
  return { note, ...handlers };
};

describe('NoteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should position and size the note from its model', () => {
    const { note } = renderNote();
    const element = screen.getByTestId(`note-${note.id}`);

    expect(element).toHaveStyle({
      left: '40px',
      top: '60px',
      width: '200px',
      height: '180px',
      zIndex: '3',
    });
  });

  it('should render the note text in the editor', () => {
    renderNote();
    expect(
      screen.getByRole('textbox', { name: 'Note content' }),
    ).toHaveValue('Reminder');
  });

  it('should render all eight resize handles', () => {
    const { note } = renderNote();
    const element = screen.getByTestId(`note-${note.id}`);
    const handles = within(element)
      .getAllByRole('button')
      .filter((node) => node.getAttribute('data-testid')?.startsWith('resize-'));
    expect(handles).toHaveLength(8);
  });

  it('should bring the note to front on pointer down', async () => {
    const { onFocus, note } = renderNote();
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId(`note-${note.id}`),
      keys: '[MouseLeft>]',
    });

    expect(onFocus).toHaveBeenCalledWith(note.id);
  });

  it('should emit text changes', async () => {
    const { onTextChange, note } = renderNote({ text: '' });
    const user = userEvent.setup();

    await user.type(
      screen.getByRole('textbox', { name: 'Note content' }),
      'x',
    );

    expect(onTextChange).toHaveBeenCalledWith(note.id, 'x');
  });

  it('should emit delete when the close button is clicked', async () => {
    const { onDelete, note } = renderNote();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Delete note' }));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });

  it('should emit a color change from the picker', async () => {
    const { onColorChange, note } = renderNote();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Change note color' }));
    await user.click(screen.getByRole('option', { name: 'Pink' }));

    expect(onColorChange).toHaveBeenCalledWith(note.id, 'pink');
  });
});

describe('NoteCard render count', () => {
  const renderProbed = (overrides: Partial<NoteModel> = {}) => {
    const handlers = { zIndex: 0, ...createMockHandlers() };
    const counter = createRenderCounter();
    const note = createMockNote(overrides);
    render(
      <RenderProbe id="note-card" onRender={counter.onRender}>
        <NoteCard note={note} {...handlers} />
      </RenderProbe>,
    );
    return { counter, note };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Mounting commits twice today: once for the card itself, once when the Radix
  // Popover trigger inside NoteColorPicker registers. That is expected
  // third-party settling, not a render loop. This bound is the runtime
  // complement to the react-hooks/set-state-in-render lint rule — a real loop or
  // an accidental mount-time setState would push commits well past it.
  const MAX_MOUNT_COMMITS = 2;

  it('should mount without a render loop', () => {
    const { counter } = renderProbed();
    expect(counter.count('note-card')).toBeLessThanOrEqual(MAX_MOUNT_COMMITS);
  });

  // An outer <Profiler> commits even when a memoized child bails, so it can't
  // isolate NoteCard's own renders. Instead, a Proxy flags every time NoteCard
  // *reads* the note during render — if React.memo bails out, the render
  // function never runs and the read never happens.
  const stableHandlers = () => ({ zIndex: 0, ...createMockHandlers() });

  const trackRenders = (renderSpy: () => void): NoteModel =>
    new Proxy(createMockNote(), {
      get(target, prop, receiver) {
        if (prop === 'id') renderSpy();
        return Reflect.get(target, prop, receiver);
      },
    });

  // This is the sibling case: when one note is dragged, the Board re-renders and
  // passes unchanged props (same note reference, memoized handlers) to the
  // others. React.memo must keep those siblings from re-rendering.
  it('should not re-render when its props are unchanged', () => {
    const renderSpy = vi.fn();
    const note = trackRenders(renderSpy);
    const handlers = stableHandlers();

    const { rerender } = render(<NoteCard note={note} {...handlers} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    renderSpy.mockClear();
    rerender(<NoteCard note={note} {...handlers} />);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('should re-render when its own note changes', () => {
    const renderSpy = vi.fn();
    const handlers = stableHandlers();
    const note = trackRenders(renderSpy);

    const { rerender } = render(<NoteCard note={note} {...handlers} />);
    renderSpy.mockClear();

    const moved = trackRenders(renderSpy);
    rerender(<NoteCard note={moved} {...handlers} />);

    expect(renderSpy).toHaveBeenCalled();
  });
});
