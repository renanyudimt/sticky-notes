import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './dialog';

function renderDialog() {
  return render(
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Note details</DialogTitle>
        <DialogDescription>How sticky notes work.</DialogDescription>
      </DialogContent>
    </Dialog>,
  );
}

describe('Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be closed by default', () => {
    renderDialog();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open and show its title and description on trigger click', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Note details' }),
    ).toBeInTheDocument();
    expect(screen.getByText('How sticky notes work.')).toBeInTheDocument();
  });

  it('should close when the Close button is clicked', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // The portal makes dialog events bubble through the React tree to whatever
  // mounted the dialog. A click on the overlay must not leak into interactive
  // ancestors (e.g. a draggable card) behind the modal.
  it('should not propagate overlay pointer events to ancestors', async () => {
    const onAncestorPointerDown = vi.fn();
    const user = userEvent.setup();

    render(
      <div onPointerDown={onAncestorPointerDown}>
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Note details</DialogTitle>
          </DialogContent>
        </Dialog>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    onAncestorPointerDown.mockClear();

    const overlay = screen.getByRole('dialog')
      .previousElementSibling as HTMLElement;
    await user.click(overlay);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onAncestorPointerDown).not.toHaveBeenCalled();
  });
});
