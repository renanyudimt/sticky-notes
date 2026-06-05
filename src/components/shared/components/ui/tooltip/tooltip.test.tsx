import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

function renderTooltip() {
  return render(
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Tooltip body</TooltipContent>
    </Tooltip>,
  );
}

describe('Tooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should hide its content by default', () => {
    renderTooltip();
    expect(screen.queryByText('Tooltip body')).not.toBeInTheDocument();
  });

  it('should reveal its content when the trigger is focused', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    expect(
      (await screen.findAllByText('Tooltip body')).length,
    ).toBeGreaterThan(0);
  });
});
