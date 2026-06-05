export const TRASH_BASE = [
  'pointer-events-none absolute bottom-6 left-1/2 z-[9999] -translate-x-1/2',
  'flex flex-col items-center gap-1 rounded-xl border-2 border-dashed',
  'px-6 py-3 text-xs font-medium transition-all duration-150',
].join(' ');

export const TRASH_IDLE =
  'border-muted-foreground/40 bg-background/70 text-muted-foreground backdrop-blur-sm';

export const TRASH_ACTIVE =
  'scale-110 border-destructive bg-destructive/15 text-destructive';
