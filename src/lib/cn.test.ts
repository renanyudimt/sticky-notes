import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('should join multiple class names', () => {
    expect(cn('flex', 'gap-2')).toBe('flex gap-2');
  });

  it('should drop falsy values', () => {
    expect(cn('flex', false, undefined, null, 'gap-2')).toBe('flex gap-2');
  });

  it('should resolve conflicting tailwind classes keeping the last', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('should support conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});
