import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InfoDialog } from './InfoDialog';

describe('InfoDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render an accessible trigger button', () => {
    render(<InfoDialog />);
    expect(
      screen.getByRole('button', { name: 'How to use' }),
    ).toBeInTheDocument();
  });

  it('should keep the dialog closed initially', () => {
    render(<InfoDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open the dialog with the usage guide on click', async () => {
    const user = userEvent.setup();
    render(<InfoDialog />);

    await user.click(screen.getByRole('button', { name: 'How to use' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'How to use Sticky Notes' }),
    ).toBeInTheDocument();
  });

  it('should describe creating, deleting and storage modes', async () => {
    const user = userEvent.setup();
    render(<InfoDialog />);

    await user.click(screen.getByRole('button', { name: 'How to use' }));

    expect(screen.getByText('Create a default note')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Local vs API (mock)')).toBeInTheDocument();
  });

  it('should close the dialog with the close button', async () => {
    const user = userEvent.setup();
    render(<InfoDialog />);

    await user.click(screen.getByRole('button', { name: 'How to use' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
