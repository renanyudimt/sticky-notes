import { Loader2 } from "lucide-react";

import { BOARD_STRINGS } from "../../constants";
import { ActivityBadge, ActivitySpinner } from "./styles";
import type { ActivityIndicatorProps } from "./types";

/**
 * A small "creating / editing / deleting" status shown in the header while an
 * API write round-trips. Renders nothing when idle; the badge itself is the
 * polite live region, with a decorative spinner alongside the label.
 */
export function ActivityIndicator({ activity }: ActivityIndicatorProps) {
  if (!activity) return null;

  return (
    <ActivityBadge role="status" aria-live="polite">
      <ActivitySpinner aria-hidden>
        <Loader2 />
      </ActivitySpinner>
      {BOARD_STRINGS.activity[activity]}
    </ActivityBadge>
  );
}
