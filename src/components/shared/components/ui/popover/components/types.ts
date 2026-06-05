import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

export type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
export type PopoverTriggerProps = React.ComponentProps<
  typeof PopoverPrimitive.Trigger
>;
export type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;
