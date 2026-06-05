import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipProvider } from './TooltipProvider';
import type { TooltipProps } from './types';

function Tooltip({ ...props }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

export { Tooltip };
