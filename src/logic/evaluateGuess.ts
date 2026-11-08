export const evaluateGuess = (secret: string, guess: string): { bulls: number; cows: number } => {
  const secretDigits = [...secret.toLowerCase()];
  const guessDigits = [...guess.toLowerCase()];
  const secretDigitSet = new Set(secretDigits);

  const bulls = secretDigits
    .map((digit, index) => Number(digit === guessDigits[index]))
    .reduce((total, isBull) => total + isBull, 0);

  const matchingDigits = new Set(guessDigits.filter((digit) => secretDigitSet.has(digit)));

  const cows = matchingDigits.size - bulls;

  return { bulls, cows };
};
