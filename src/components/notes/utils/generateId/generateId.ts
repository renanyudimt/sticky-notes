/** Generate a unique note id, preferring the platform crypto UUID. */
export function generateId(): string {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `note-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}
