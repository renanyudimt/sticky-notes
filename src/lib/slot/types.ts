import type { ReactNode } from "react";

export type AnyProps = Record<string, unknown>;

export type EventHandler = (...args: unknown[]) => void;

export interface SlotProps {
  children?: ReactNode;
  [key: string]: unknown;
}
