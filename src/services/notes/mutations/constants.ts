export const NOTE_MUTATION_MESSAGES = {
  created: "Note created",
  cleared: "All notes deleted",
  seeded: (count: number) => `${count} cards created`,
} as const;
