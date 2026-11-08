import { describe, expect, test } from 'vitest';
import { isValidGuess } from '../src/logic/isValidGuess.ts';

describe('isValidGuess', () => {
  test.for([
    { guess: '01', length: 2, base: 2, expected: true },
    { guess: '10', length: 2, base: 2, expected: true },
    { guess: '076', length: 3, base: 8, expected: true },
    { guess: '0123', length: 4, base: 10, expected: true },
    { guess: '9876543210', length: 10, base: 10, expected: true },
    { guess: 'aBcD', length: 4, base: 16, expected: true },
    { guess: 'AB12', length: 4, base: 16, expected: true },

    { guess: '00', length: 2, base: 2, expected: false },
    { guess: '1123', length: 4, base: 10, expected: false },
    { guess: 'Aa12', length: 4, base: 16, expected: false },

    { guess: '02', length: 2, base: 2, expected: false },
    { guess: '078', length: 3, base: 8, expected: false },
    { guess: '12A', length: 3, base: 10, expected: false },
    { guess: '12G', length: 3, base: 16, expected: false },

    { guess: '123', length: 4, base: 10, expected: false },
    { guess: '1234', length: 3, base: 10, expected: false },
    { guess: '', length: 2, base: 10, expected: false },
    { guess: '1', length: 2, base: 10, expected: false },
  ])(
    'guess "$guess" in base $base should return $expected',
    ({ guess, length, base, expected }) => {
      expect(isValidGuess(guess, length, base)).toBe(expected);
    },
  );
});
