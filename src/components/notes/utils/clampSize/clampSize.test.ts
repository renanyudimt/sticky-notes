import { describe, expect, it } from 'vitest';

import type { SizeConstraints } from '../../types';
import { clampSize } from './clampSize';

const constraints: SizeConstraints = {
  min: { width: 100, height: 80 },
  max: { width: 400, height: 400 },
};

describe('clampSize', () => {
  it('should keep a size that is already within bounds', () => {
    expect(clampSize({ width: 200, height: 150 }, constraints)).toEqual({
      width: 200,
      height: 150,
    });
  });

  it('should clamp up to the minimum', () => {
    expect(clampSize({ width: 10, height: 10 }, constraints)).toEqual({
      width: 100,
      height: 80,
    });
  });

  it('should clamp down to the maximum', () => {
    expect(clampSize({ width: 999, height: 999 }, constraints)).toEqual({
      width: 400,
      height: 400,
    });
  });
});
