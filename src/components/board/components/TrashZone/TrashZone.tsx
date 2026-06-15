import { memo } from "react";
import { Trash2 } from "lucide-react";

import { cn } from "@/components/shared";

import { BOARD_STRINGS } from "../../constants";
import { TRASH_ACTIVE, TRASH_BASE, TRASH_IDLE } from "./styles";
import type { TrashZoneProps } from "./types";

function TrashZoneBase({ isActive, ref }: TrashZoneProps) {
  return (
    <div
      ref={ref}
      data-testid="trash-zone"
      role="region"
      aria-label={BOARD_STRINGS.trashLabel}
      aria-current={isActive}
      className={cn(TRASH_BASE, isActive ? TRASH_ACTIVE : TRASH_IDLE)}
    >
      <Trash2 className={cn("size-6", isActive && "animate-bounce")} />
      <span>{BOARD_STRINGS.trashLabel}</span>
    </div>
  );
}

// Memoized: the Board re-renders on every pointer move during a drag (the store
// updates the moved note), but the trash zone only depends on `isActive`, which
// changes solely when a note crosses into/out of the zone. `ref` is a stable
// useRef object, so memo bails on every move that doesn't toggle `isActive`.
export const TrashZone = memo(TrashZoneBase);
