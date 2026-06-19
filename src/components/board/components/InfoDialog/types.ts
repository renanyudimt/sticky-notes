import type { LucideIcon } from 'lucide-react';

export interface InfoSection {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface InfoDialogProps {
  /**
   * Seeds a batch of random empty cards. May return a promise — the button
   * shows a loading state until it settles, then the dialog closes on success.
   */
  onSeed: () => Promise<void> | void;
}
