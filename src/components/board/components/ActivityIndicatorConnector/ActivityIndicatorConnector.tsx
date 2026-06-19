import { memo } from "react";

import { useNotesActivity } from "@/components/notes";

import { ActivityIndicator } from "../ActivityIndicator";

// Subscribes to the activity store itself, so an in-flight API write re-renders
// only this indicator — never the (memoized) toolbar or the board.
function ActivityIndicatorConnectorBase() {
  const activity = useNotesActivity();
  return <ActivityIndicator activity={activity} />;
}

export const ActivityIndicatorConnector = memo(ActivityIndicatorConnectorBase);
