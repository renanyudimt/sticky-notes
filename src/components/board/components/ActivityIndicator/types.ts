import type { NoteActivity } from "@/components/notes";

export interface ActivityIndicatorProps {
  /** The in-flight API write, or null when idle (renders nothing). */
  activity: NoteActivity | null;
}
