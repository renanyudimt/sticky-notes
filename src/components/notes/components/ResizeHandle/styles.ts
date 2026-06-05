import type { ResizeDirection } from "../../types";

export const HANDLE_POSITION: Record<ResizeDirection, string> = {
  nw: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  ne: "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  e: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  se: "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  w: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
};

export const HANDLE_CURSOR: Record<ResizeDirection, string> = {
  n: "cursor-ns-resize",
  s: "cursor-ns-resize",
  e: "cursor-ew-resize",
  w: "cursor-ew-resize",
  ne: "cursor-nesw-resize",
  sw: "cursor-nesw-resize",
  nw: "cursor-nwse-resize",
  se: "cursor-nwse-resize",
};

export const HANDLE_BASE =
  "absolute z-10 size-3 rounded-full border border-black/30 bg-white shadow-sm opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 dark:border-white/40 dark:bg-neutral-200";
