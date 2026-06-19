import { TOAST_DURATION } from "./constants";
import type { Toast, ToastType } from "./types";

let toasts: readonly Toast[] = [];
let counter = 0;
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) listener();
}

function clearTimer(id: string) {
  const timer = timers.get(id);
  if (timer === undefined) return;
  clearTimeout(timer);
  timers.delete(id);
}

export function addToast(
  type: ToastType,
  message: string,
  duration = TOAST_DURATION,
): string {
  counter += 1;
  const id = `toast-${counter}`;
  toasts = [...toasts, { id, type, message }];
  emit();

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismissToast(id), duration),
    );
  }

  return id;
}

export function dismissToast(id: string): void {
  clearTimer(id);
  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  emit();
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts(): readonly Toast[] {
  return toasts;
}

export function resetToasts(): void {
  for (const id of timers.keys()) clearTimer(id);
  toasts = [];
  emit();
}

export const toast = {
  success: (message: string) => addToast("success", message),
  error: (message: string) => addToast("error", message),
};
