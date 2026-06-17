import { CreatePreviewBox } from "./styles";
import type { CreatePreviewProps } from "./types";

export function CreatePreview({ ref }: CreatePreviewProps) {
  return (
    <CreatePreviewBox ref={ref} data-testid="create-preview" aria-hidden />
  );
}
