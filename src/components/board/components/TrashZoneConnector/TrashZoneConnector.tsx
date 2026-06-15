import { memo } from "react";

import { useTrashActive } from "@/components/notes";

import { TrashZone } from "../TrashZone";
import type { TrashZoneConnectorProps } from "./types";

// Subscribes to the trash-active flag itself, so crossing the trash zone
// re-renders only the trash zone — never the board.
function TrashZoneConnectorBase({ ref }: TrashZoneConnectorProps) {
  const isActive = useTrashActive();
  return <TrashZone ref={ref} isActive={isActive} />;
}

export const TrashZoneConnector = memo(TrashZoneConnectorBase);
