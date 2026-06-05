import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Toolbar } from './Toolbar';

const renderToolbar = (props: Partial<Parameters<typeof Toolbar>[0]> = {}) => {
  const onRepositoryChange = vi.fn();
  const onClear = vi.fn();
  render(
    <Toolbar
      noteCount={props.noteCount ?? 2}
      repositoryKind={props.repositoryKind ?? 'local'}
      onRepositoryChange={onRepositoryChange}
      onClear={onClear}
    />,
  );
  return { onRepositoryChange, onClear };
};

describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show the note count', () => {
    renderToolbar({ noteCount: 3 });
    expect(screen.getByText('3 notes')).toBeInTheDocument();
  });

  it('should show the singular count for one note', () => {
    renderToolbar({ noteCount: 1 });
    expect(screen.getByText('1 note')).toBeInTheDocument();
  });

  it('should mark the active repository', () => {
    renderToolbar({ repositoryKind: 'rest' });
    expect(screen.getByRole('radio', { name: 'API' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('should switch repository on click', async () => {
    const { onRepositoryChange } = renderToolbar({ repositoryKind: 'local' });
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'API' }));

    expect(onRepositoryChange).toHaveBeenCalledWith('rest');
  });

  it('should clear notes when the clear button is clicked', async () => {
    const { onClear } = renderToolbar({ noteCount: 2 });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Clear all/ }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should disable clear when there are no notes', () => {
    renderToolbar({ noteCount: 0 });
    expect(screen.getByRole('button', { name: /Clear all/ })).toBeDisabled();
  });
});
