import { render, screen } from '@/test/renderWithTheme';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { CreatePreview } from './CreatePreview';

describe('CreatePreview', () => {
  it('should render an aria-hidden preview box', () => {
    render(<CreatePreview ref={createRef<HTMLDivElement>()} />);

    expect(screen.getByTestId('create-preview')).toHaveAttribute('aria-hidden');
  });

  it('should expose the box element through the ref for imperative painting', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CreatePreview ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId('create-preview'));
  });
});
