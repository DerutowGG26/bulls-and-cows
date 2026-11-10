import { describe, expect, test } from 'vitest';
import { evaluateGuess } from '../src/logic/evaluateGuess.ts';

describe('evaluateGuess', () => {
  test.for([
    {
      secret: '4271',
      guess: '4271',
      expected: { bulls: 4, cows: 0 },
    },
    {
      secret: '4271',
      guess: '1234',
      expected: { bulls: 1, cows: 2 },
    },
    {
      secret: '4271',
      guess: '0568',
      expected: { bulls: 0, cows: 0 },
    },
    {
      secret: '4271',
      guess: '1742',
      expected: { bulls: 0, cows: 4 },
    },
    {
      secret: '4271',
      guess: '1278',
      expected: { bulls: 2, cows: 1 },
    },
    {
      secret: 'a1b2',
      guess: 'A1B2',
      expected: { bulls: 4, cows: 0 },
    },
    {
      secret: 'a1b2',
      guess: 'B2A1',
      expected: { bulls: 0, cows: 4 },
    },
    {
      secret: '0123',
      guess: '3012',
      expected: { bulls: 0, cows: 4 },
    },
  ])(
    'secret "$secret", guess "$guess" should return the expected result',
    ({ secret, guess, expected }) => {
      expect(evaluateGuess(secret, guess)).toEqual(expected);
    },
  );
});
