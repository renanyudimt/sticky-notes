import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CreatePreview } from './CreatePreview';

describe('CreatePreview', () => {
  it('should render at the given rect position and size', () => {
    render(<CreatePreview rect={{ x: 30, y: 40, width: 120, height: 90 }} />);

    expect(screen.getByTestId('create-preview')).toHaveStyle({
      left: '30px',
      top: '40px',
      width: '120px',
      height: '90px',
    });
  });
});
