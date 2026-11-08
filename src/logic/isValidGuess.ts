import { createDigitValidator } from './createDigitValidator.js';

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (!Number.isInteger(length) || length < 1 || length > base || guess.length !== length) {
    return false;
  }

  const isValidDigit = createDigitValidator(base);

  const normalizedGuess = guess.toLowerCase();
  const digits = [...normalizedGuess];

  const hasOnlyValidDigits = digits.every(isValidDigit);
  const hasUniqueDigits = new Set(digits).size === digits.length;

  return hasOnlyValidDigits && hasUniqueDigits;
};
