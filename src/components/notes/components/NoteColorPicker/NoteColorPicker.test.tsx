import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NoteColorPicker } from './NoteColorPicker';

describe('NoteColorPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should expose a trigger to change the note color', () => {
    render(<NoteColorPicker value="yellow" onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Change note color' }),
    ).toBeInTheDocument();
  });

  it('should emit the chosen color when a swatch is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteColorPicker value="yellow" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Change note color' }));
    await user.click(screen.getByRole('option', { name: 'Blue' }));

    expect(onChange).toHaveBeenCalledWith('blue');
  });

  it('should mark the current color as selected', async () => {
    const user = userEvent.setup();
    render(<NoteColorPicker value="green" onChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Change note color' }));

    expect(screen.getByRole('option', { name: 'Green' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
