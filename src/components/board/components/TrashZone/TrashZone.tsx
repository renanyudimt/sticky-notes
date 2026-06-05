import { Trash2 } from "lucide-react";

import { cn } from "@/components/shared";

import { BOARD_STRINGS } from "../../constants";
import { TRASH_ACTIVE, TRASH_BASE, TRASH_IDLE } from "./styles";
import type { TrashZoneProps } from "./types";

export function TrashZone({ isActive, ref }: TrashZoneProps) {
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
