import * as PopoverPrimitive from '@radix-ui/react-popover';

import type { PopoverProps } from './types';

function Popover({ ...props }: PopoverProps) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export { Popover };
