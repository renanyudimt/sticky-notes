import { render, screen } from '@/test/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeModeProvider } from '@/theme';

import { Toolbar } from './Toolbar';

// Render sentinel: every lucide icon in the toolbar subtree is replaced by a
// spy. Any icon rendering means the (memoized) toolbar re-rendered; if memo
// bails out, the whole subtree is skipped and no icon renders.
const { renderSpy } = vi.hoisted(() => ({ renderSpy: vi.fn() }));

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const sentinel = () => {
    renderSpy();
    return null;
  };
  return Object.fromEntries(
    Object.keys(actual).map((name) => [name, sentinel]),
  );
});

const renderToolbar = (props: Partial<Parameters<typeof Toolbar>[0]> = {}) => {
  const onDataSourceChange = vi.fn();
  const onClear = vi.fn();
  const onSeed = vi.fn();
  render(
    <Toolbar
      noteCount={props.noteCount ?? 2}
      dataSource={props.dataSource ?? 'local'}
      isSwitching={props.isSwitching ?? false}
      onDataSourceChange={onDataSourceChange}
      onClear={onClear}
      onSeed={onSeed}
    />,
    { wrapper: ThemeModeProvider },
  );
  return { onDataSourceChange, onClear, onSeed };
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
    renderToolbar({ dataSource: 'api' });
    expect(screen.getByRole('radio', { name: 'API' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('should switch repository on click', async () => {
    const { onDataSourceChange } = renderToolbar({ dataSource: 'local' });
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'API' }));

    expect(onDataSourceChange).toHaveBeenCalledWith('api');
  });

  it('should disable the repository toggle while switching', () => {
    renderToolbar({ isSwitching: true });
    expect(screen.getByRole('radio', { name: 'Local' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'API' })).toBeDisabled();
  });

  it('should not switch repository while a switch is in flight', async () => {
    const { onDataSourceChange } = renderToolbar({
      dataSource: 'local',
      isSwitching: true,
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('radio', { name: 'API' }));

    expect(onDataSourceChange).not.toHaveBeenCalled();
  });

  it('should clear notes only after the action is confirmed', async () => {
    const { onClear } = renderToolbar({ noteCount: 2 });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClear).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Delete all' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('should disable clear when there are no notes', () => {
    renderToolbar({ noteCount: 0 });
    expect(screen.getByRole('button', { name: /Clear all/ })).toBeDisabled();
  });

  // The Board re-renders on every pointer move during a drag; the toolbar must
  // not follow when its inputs are unchanged.
  it('should not re-render when its props are unchanged', () => {
    const onDataSourceChange = vi.fn();
    const onClear = vi.fn();
    const onSeed = vi.fn();
    const props = {
      noteCount: 2,
      dataSource: 'local' as const,
      isSwitching: false,
      onDataSourceChange,
      onClear,
      onSeed,
    };

    const { rerender } = render(<Toolbar {...props} />, {
      wrapper: ThemeModeProvider,
    });
    renderSpy.mockClear();
    rerender(<Toolbar {...props} />);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('should reflect a changed note count after re-rendering', () => {
    const onDataSourceChange = vi.fn();
    const onClear = vi.fn();
    const onSeed = vi.fn();
    const props = {
      noteCount: 2,
      dataSource: 'local' as const,
      isSwitching: false,
      onDataSourceChange,
      onClear,
      onSeed,
    };

    const { rerender } = render(<Toolbar {...props} />, {
      wrapper: ThemeModeProvider,
    });
    expect(screen.getByText('2 notes')).toBeInTheDocument();

    rerender(<Toolbar {...props} noteCount={3} />);

    expect(screen.getByText('3 notes')).toBeInTheDocument();
  });
});
