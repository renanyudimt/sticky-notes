import { CREATE_PREVIEW } from "./styles";
import type { CreatePreviewProps } from "./types";

export function CreatePreview({ rect }: CreatePreviewProps) {
  return (
    <div
      data-testid="create-preview"
      aria-hidden
      className={CREATE_PREVIEW}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
}
