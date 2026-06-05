import * as PopoverPrimitive from '@radix-ui/react-popover';

import type { PopoverTriggerProps } from './types';

function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export { PopoverTrigger };
