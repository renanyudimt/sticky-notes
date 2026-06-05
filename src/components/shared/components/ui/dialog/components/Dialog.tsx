import * as DialogPrimitive from '@radix-ui/react-dialog';

import type { DialogProps } from './types';

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export { Dialog };
