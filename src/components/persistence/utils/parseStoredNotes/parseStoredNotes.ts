import type { Note } from "@/components/notes";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNote = (value: unknown): value is Note => {
  if (!isObject(value)) return false;
  const { id, position, size, text, color } = value;
  return (
    typeof id === "string" &&
    isObject(position) &&
    typeof position.x === "number" &&
    typeof position.y === "number" &&
    isObject(size) &&
    typeof size.width === "number" &&
    typeof size.height === "number" &&
    typeof text === "string" &&
    typeof color === "string"
  );
};

export function parseStoredNotes(raw: string | null): Note[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isNote);
  } catch {
    return [];
  }
}
