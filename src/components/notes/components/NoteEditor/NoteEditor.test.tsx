import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NoteEditor } from './NoteEditor';

describe('NoteEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the current text value', () => {
    render(<NoteEditor value="Buy milk" onChange={vi.fn()} label="Note" />);
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveValue(
      'Buy milk',
    );
  });

  it('should show the placeholder when empty', () => {
    render(<NoteEditor value="" onChange={vi.fn()} label="Note" />);
    expect(screen.getByPlaceholderText('Write something...')).toBeInTheDocument();
  });

  it('should emit each typed change', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteEditor value="" onChange={onChange} label="Note" />);

    await user.type(screen.getByRole('textbox', { name: 'Note' }), 'hi');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('i');
  });
});
