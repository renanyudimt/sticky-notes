import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Note as NoteModel } from '../../types';
import { NoteCard } from './NoteCard';

const createMockNote = (overrides: Partial<NoteModel> = {}): NoteModel => ({
  id: 'note-1',
  position: { x: 40, y: 60 },
  size: { width: 200, height: 180 },
  text: 'Reminder',
  color: 'yellow',
  zIndex: 3,
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

const renderNote = (overrides: Partial<NoteModel> = {}) => {
  const handlers = {
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
  };
  const note = createMockNote(overrides);
  render(<NoteCard note={note} {...handlers} />);
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
