import * as DialogPrimitive from '@radix-ui/react-dialog';

import type { DialogTriggerProps } from './types';

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export { DialogTrigger };
