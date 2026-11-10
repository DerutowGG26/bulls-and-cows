import { describe, expect, test } from 'vitest';
import { countPossibleSecrets } from '../src/logic/countPossibleSecrets.ts';

describe('countPossibleSecrets', () => {
  test.for([
    { length: 1, base: 2, expected: 2 },
    { length: 2, base: 2, expected: 2 },
    { length: 3, base: 8, expected: 336 },
    { length: 4, base: 10, expected: 5040 },
    { length: 6, base: 16, expected: 5765760 },
  ])('counts possible secrets for length $length and base $base', ({ length, base, expected }) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  test('returns the same result for repeated calls', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  test.for([
    { length: 0, base: 10 },
    { length: -1, base: 10 },
    { length: 2.5, base: 10 },
    { length: 3, base: 2 },
    { length: 2, base: 1 },
    { length: 2, base: 17 },
    { length: 2, base: 2.5 },
  ])('throws RangeError for invalid length $length and base $base', ({ length, base }) => {
    expect(() => countPossibleSecrets(length, base)).toThrow(RangeError);
  });
});
