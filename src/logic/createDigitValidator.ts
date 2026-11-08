const DIGITS = '0123456789abcdef';
export const createDigitValidator = (base: number): ((char: string) => boolean) => {
  return (char: string): boolean => {
    if (char.length !== 1 || !Number.isInteger(base) || base < 2 || base > DIGITS.length) {
      return false;
    }
    const normalizedChar = char.toLowerCase();
    const digitValue = DIGITS.indexOf(normalizedChar);
    return digitValue !== -1 && digitValue < base;
  };
};
