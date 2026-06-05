import { describe, expect, it } from 'vitest';

import { toBoardRect } from './toBoardRect';

const asRect = (rect: Partial<DOMRect>) => rect as DOMRect;

describe('toBoardRect', () => {
  it('should offset a viewport rect by the board origin', () => {
    const element = asRect({ left: 120, top: 90, width: 80, height: 60 });
    const board = asRect({ left: 20, top: 40 });

    expect(toBoardRect(element, board)).toEqual({
      x: 100,
      y: 50,
      width: 80,
      height: 60,
    });
  });

  it('should keep coordinates when the board sits at the origin', () => {
    const element = asRect({ left: 200, top: 150, width: 10, height: 10 });
    const board = asRect({ left: 0, top: 0 });

    expect(toBoardRect(element, board)).toEqual({
      x: 200,
      y: 150,
      width: 10,
      height: 10,
    });
  });
});
