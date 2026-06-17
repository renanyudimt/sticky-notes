import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResizeHandle } from './ResizeHandle';

describe('ResizeHandle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render an accessible label for its direction', () => {
    render(<ResizeHandle direction="se" onResizeStart={vi.fn()} />);
    expect(
      screen.getByRole('button', {
        name: 'Resize to the bottom-right corner',
      }),
    ).toBeInTheDocument();
  });

  it('should start a resize with its direction on pointer down', async () => {
    const onResizeStart = vi.fn();
    const user = userEvent.setup();
    render(<ResizeHandle direction="n" onResizeStart={onResizeStart} />);

    await user.pointer({
      target: screen.getByTestId('resize-handle-n'),
      keys: '[MouseLeft>]',
    });

    expect(onResizeStart).toHaveBeenCalledWith('n', expect.anything());
  });
});
