import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render as a button with its accessible name', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render the child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
