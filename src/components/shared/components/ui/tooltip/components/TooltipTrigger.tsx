import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import type { TooltipTriggerProps } from './types';

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export { TooltipTrigger };
