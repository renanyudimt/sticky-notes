import { describe, expect, it } from 'vitest';

import { createRepository } from './createRepository';

describe('createRepository', () => {
  it('should build a repository exposing load and save for "local"', () => {
    const repo = createRepository('local');
    expect(typeof repo.load).toBe('function');
    expect(typeof repo.save).toBe('function');
  });

  it('should build a repository exposing load and save for "rest"', () => {
    const repo = createRepository('rest');
    expect(typeof repo.load).toBe('function');
    expect(typeof repo.save).toBe('function');
  });
});
