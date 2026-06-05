import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import type { TooltipProviderProps } from './types';

function TooltipProvider({ delayDuration = 0, ...props }: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

export { TooltipProvider };
