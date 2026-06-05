import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './variants';

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
