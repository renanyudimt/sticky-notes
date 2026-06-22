import { createMockNote } from '@/test/createMockNote';

import { nextZIndex } from './nextZIndex';

describe('nextZIndex', () => {
  it('should return 0 for an empty board', () => {
    expect(nextZIndex([])).toBe(0);
  });

  it('should return one above the current top note', () => {
    const notes = [
      createMockNote({ id: 'a', zIndex: 3 }),
      createMockNote({ id: 'b', zIndex: 7 }),
      createMockNote({ id: 'c', zIndex: 1 }),
    ];

    expect(nextZIndex(notes)).toBe(8);
  });
});
