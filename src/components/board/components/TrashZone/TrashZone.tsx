import { memo } from "react";
import { Trash2 } from "lucide-react";

import { BOARD_STRINGS } from "../../constants";
import { TrashRegion } from "./styles";
import type { TrashZoneProps } from "./types";

function TrashZoneBase({ isActive, ref }: TrashZoneProps) {
  return (
    <TrashRegion
      ref={ref}
      data-testid="trash-zone"
      role="region"
      aria-label={BOARD_STRINGS.trashLabel}
      aria-current={isActive}
      $active={isActive}
    >
      <Trash2 />
      <span>{BOARD_STRINGS.trashLabel}</span>
    </TrashRegion>
  );
}

// Memoized: the Board re-renders on every pointer move during a drag (the store
// updates the moved note), but the trash zone only depends on `isActive`, which
// changes solely when a note crosses into/out of the zone. `ref` is a stable
// useRef object, so memo bails on every move that doesn't toggle `isActive`.
export const TrashZone = memo(TrashZoneBase);
