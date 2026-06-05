import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TrashZone } from './TrashZone';

describe('TrashZone', () => {
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
});
