const cache = new Map<string, number>();

const calculatePossibleSecrets = (length: number, base: number): number => {
  const cacheKey = `${length}:${base}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const result = length === 1 ? base : base * calculatePossibleSecrets(length - 1, base - 1);
  cache.set(cacheKey, result);
  return result;
};

export const countPossibleSecrets = (length: number, base: number): number => {
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

  return calculatePossibleSecrets(length, base);
};
