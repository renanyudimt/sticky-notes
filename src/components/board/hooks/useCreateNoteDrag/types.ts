import type { RefObject } from "react";

import type { Rect } from "@/components/notes";

export interface UseCreateNoteDragParams {
  getBoardRect: () => DOMRect | null;
  onCreate: (rect: Rect) => void;
}

export interface UseCreateNoteDragResult {
  isCreating: boolean;
  /** Attach to the always-mounted preview element; painted imperatively. */
  previewRef: RefObject<HTMLDivElement | null>;
  startCreate: (event: React.PointerEvent) => void;
}
