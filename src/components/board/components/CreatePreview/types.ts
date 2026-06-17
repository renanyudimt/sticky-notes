import type { RefObject } from "react";

export interface CreatePreviewProps {
  /** Stays mounted and hidden; the drag hook paints it via this ref. */
  ref: RefObject<HTMLDivElement | null>;
}
