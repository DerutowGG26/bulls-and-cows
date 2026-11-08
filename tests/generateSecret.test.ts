import { describe, expect, test, vi } from 'vitest';
import { generateSecret } from '../src/logic/generateSecret.ts';

describe('generateSecret', () => {
  test.for([
    { length: 2, base: 2, expected: '01' },
    { length: 3, base: 8, expected: '012' },
    { length: 4, base: 10, expected: '0123' },
    { length: 6, base: 16, expected: '012345' },
  ])('generates $length unique digits in base $base', ({ length, base, expected }) => {
    const secret = generateSecret(length, base, () => 0);

    expect(secret).toBe(expected);
  });

  test('uses the provided random function', () => {
    const random = vi.fn(() => 0);

    generateSecret(4, 10, random);

    expect(random).toHaveBeenCalled();
  });

  test('generates only unique digits', () => {
    const secret = generateSecret(6, 16, () => 0);

    expect(new Set(secret).size).toBe(secret.length);
  });

  test('allows zero as the first digit', () => {
    const secret = generateSecret(4, 10, () => 0);

    expect(secret.startsWith('0')).toBe(true);
  });

  test.for([
    { length: 0, base: 10 },
    { length: 2.5, base: 10 },
    { length: 11, base: 10 },
    { length: 3, base: 2 },
    { length: 2, base: 1 },
    { length: 2, base: 17 },
  ])('throws RangeError for invalid length $length and base $base', ({ length, base }) => {
    expect(() => generateSecret(length, base, () => 0)).toThrow(RangeError);
  });
});
