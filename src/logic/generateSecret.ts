export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (
    !Number.isInteger(length) ||
    length < 1 ||
    !Number.isInteger(base) ||
    base < 2 ||
    base > 16 ||
    length > base
  ) {
    throw new RangeError('Invalid length or base');
  }

  const digits = Array.from({ length: base }, (_, index) => index.toString(16));

  for (let index = 0; index < length; index += 1) {
    const randomIndex = index + Math.floor(random() * (base - index));
    const currentDigit = digits[index];
    const selectedDigit = digits[randomIndex];

    if (currentDigit === undefined || selectedDigit === undefined) {
      throw new Error('Unexpected error: digit is undefined');
    }

    digits[index] = selectedDigit;
    digits[randomIndex] = currentDigit;
  }

  return digits.slice(0, length).join('');
};
