import type { TrashZoneProps } from "../TrashZone";

/** TrashZone's props minus `isActive`, which the connector sources from the store. */
export type TrashZoneConnectorProps = Omit<TrashZoneProps, "isActive">;
