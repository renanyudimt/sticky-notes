import { Slot } from "@/lib/slot";

import { StyledButton } from "./styles";
import type { ButtonProps } from "./types";

function Button({
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      as={asChild ? Slot : undefined}
      $variant={variant}
      $size={size}
      {...props}
    />
  );
}

export { Button };
