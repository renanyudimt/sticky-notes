import { describe, expect, it } from 'vitest';

import { generateId } from './generateId';

describe('generateId', () => {
  it('should return a non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('should produce unique values across calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});
