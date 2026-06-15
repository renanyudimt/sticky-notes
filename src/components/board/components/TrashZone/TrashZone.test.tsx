import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TrashZone } from './TrashZone';

// A render sentinel: Trash2 is rendered inside TrashZone, so its mock runs once
// per TrashZone render. If React.memo bails out, TrashZone never re-renders and
// the icon is never invoked again.
const { renderSpy } = vi.hoisted(() => ({ renderSpy: vi.fn() }));

vi.mock('lucide-react', () => ({
  Trash2: () => {
    renderSpy();
    return null;
  },
}));

describe('TrashZone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the trash region with its label', () => {
    render(<TrashZone isActive={false} />);
    expect(
      screen.getByRole('region', {
        name: 'Drag a note here to delete it',
      }),
    ).toBeInTheDocument();
  });

  it('should mark itself current when active', () => {
    render(<TrashZone isActive />);
    expect(screen.getByTestId('trash-zone')).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('should not be current when idle', () => {
    render(<TrashZone isActive={false} />);
    expect(screen.getByTestId('trash-zone')).toHaveAttribute(
      'aria-current',
      'false',
    );
  });

  // The Board re-renders on every pointer move during a drag; the trash zone
  // must not follow when `isActive` is unchanged.
  it('should not re-render when isActive is unchanged', () => {
    const { rerender } = render(<TrashZone isActive={false} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    renderSpy.mockClear();
    rerender(<TrashZone isActive={false} />);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('should re-render when isActive toggles', () => {
    const { rerender } = render(<TrashZone isActive={false} />);
    renderSpy.mockClear();

    rerender(<TrashZone isActive />);

    expect(renderSpy).toHaveBeenCalled();
  });
});
