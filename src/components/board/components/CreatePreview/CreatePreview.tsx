import { memo } from "react";

import { CreatePreviewBox } from "./styles";
import type { CreatePreviewProps } from "./types";

// The board re-renders when a create-drag flips isCreating, but the preview is
// painted imperatively via its ref — its only prop (the ref) is stable, so memo
// keeps it out of React's render loop.
function CreatePreviewBase({ ref }: CreatePreviewProps) {
  return (
    <CreatePreviewBox ref={ref} data-testid="create-preview" aria-hidden />
  );
}

export const CreatePreview = memo(CreatePreviewBase);
