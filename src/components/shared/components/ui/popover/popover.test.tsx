import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

function renderPopover() {
  return render(
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover body</PopoverContent>
    </Popover>,
  );
}

describe('Popover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should hide its content by default', () => {
    renderPopover();
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('should reveal its content on trigger click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });
});
