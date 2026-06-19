import { Loader2 } from "lucide-react";

import { SPINNER_LABEL } from "./constants";
import { SpinnerIcon } from "./styles";

/** A small spinning indicator for inline/button loading states. */
export function Spinner() {
  return (
    <SpinnerIcon role="status" aria-label={SPINNER_LABEL}>
      <Loader2 aria-hidden />
    </SpinnerIcon>
  );
}
