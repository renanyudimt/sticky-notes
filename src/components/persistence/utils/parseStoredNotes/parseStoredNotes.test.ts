import { describe, expect, it } from "vitest";

import type { Note } from "@/components/notes";
import { parseStoredNotes } from "./parseStoredNotes";

const validNote: Note = {
  id: "n1",
  position: { x: 1, y: 2 },
  size: { width: 100, height: 100 },
  text: "hi",
  color: "yellow",
  createdAt: 0,
  updatedAt: 0,
};

describe("parseStoredNotes", () => {
  it("should return an empty array for null input", () => {
    expect(parseStoredNotes(null)).toEqual([]);
  });

  it("should return an empty array for invalid JSON", () => {
    expect(parseStoredNotes("{not json")).toEqual([]);
  });

  it("should return an empty array when the payload is not an array", () => {
    expect(parseStoredNotes('{"foo":1}')).toEqual([]);
  });

  it("should parse a list of valid notes", () => {
    expect(parseStoredNotes(JSON.stringify([validNote]))).toEqual([validNote]);
  });

  it("should drop malformed entries but keep valid ones", () => {
    const raw = JSON.stringify([validNote, { id: "broken" }, 42]);
    expect(parseStoredNotes(raw)).toEqual([validNote]);
  });
});
