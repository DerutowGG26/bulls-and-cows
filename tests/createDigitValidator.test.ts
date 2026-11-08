import { describe, expect, test } from 'vitest';
import { createDigitValidator } from '../src/logic/createDigitValidator.ts';

describe('createDigitValidator', () => {
  test.for([
    { base: 2, char: '0', expected: true },
    { base: 2, char: '1', expected: true },
    { base: 2, char: '2', expected: false },

    { base: 8, char: '7', expected: true },
    { base: 8, char: '8', expected: false },

    { base: 10, char: '9', expected: true },
    { base: 10, char: 'A', expected: false },

    { base: 16, char: '0', expected: true },
    { base: 16, char: '9', expected: true },
    { base: 16, char: 'a', expected: true },
    { base: 16, char: 'f', expected: true },
    { base: 16, char: 'g', expected: false },
  ])('base $base: "$char" should return $expected', ({ base, char, expected }) => {
    const isValidDigit = createDigitValidator(base);

    expect(isValidDigit(char)).toBe(expected);
  });

  test('accepts uppercase hexadecimal letters', () => {
    const isHexDigit = createDigitValidator(16);

    expect(isHexDigit('A')).toBe(true);
    expect(isHexDigit('F')).toBe(true);
  });

  test('rejects an empty string', () => {
    const isDecimalDigit = createDigitValidator(10);

    expect(isDecimalDigit('')).toBe(false);
  });

  test('rejects strings containing multiple characters', () => {
    const isDecimalDigit = createDigitValidator(10);

    expect(isDecimalDigit('12')).toBe(false);
  });
});
