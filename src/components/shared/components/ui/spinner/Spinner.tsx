import { Loader2 } from "lucide-react";

import { SPINNER_LABEL } from "./constants";
import { SpinnerIcon } from "./styles";

export function Spinner() {
  return (
    <SpinnerIcon role="status" aria-label={SPINNER_LABEL}>
      <Loader2 aria-hidden />
    </SpinnerIcon>
  );
}
