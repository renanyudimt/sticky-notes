export const BOARD_SURFACE = [
  "relative isolate flex-1 overflow-hidden cursor-crosshair",
  "bg-background",
  "[background-image:radial-gradient(rgba(120,120,135,0.18)_1px,transparent_1px)]",
  "[background-size:24px_24px]",
].join(" ");

export const BOARD_OVERLAY =
  "pointer-events-none absolute inset-0 flex items-center justify-center";

export const BOARD_HINT = "max-w-xs text-center text-sm text-muted-foreground";

export const BOARD_ERROR =
  "rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive";
