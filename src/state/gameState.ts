import { generateSecret } from '../logic/generateSecret.js';
import { evaluateGuess } from '../logic/evaluateGuess.js';
import { isValidGuess } from '../logic/isValidGuess.js';

export type GameBase = 2 | 8 | 10 | 16;

export type GameStatus = 'settings' | 'playing' | 'won';

export interface GameSettings {
  readonly length: number;
  readonly base: GameBase;
}

export interface GuessEntry {
  readonly guess: string;
  readonly bulls: number;
  readonly cows: number;
  readonly submittedAt: number;
}

export interface GameState {
  readonly settings: GameSettings;
  readonly secret: string | null;
  readonly history: readonly GuessEntry[];
  readonly status: GameStatus;
  readonly startedAt: number | null;
  readonly finishedAt: number | null;
}

const SUPPORTED_BASES: readonly GameBase[] = [2, 8, 10, 16];

const DEFAULT_SETTINGS: GameSettings = {
  length: 4,
  base: 10,
};

const isValidGameSettings = (settings: GameSettings): boolean => {
  return (
    Number.isInteger(settings.length) &&
    settings.length >= 2 &&
    settings.length <= 6 &&
    SUPPORTED_BASES.includes(settings.base) &&
    settings.length <= settings.base
  );
};

export const createInitialGameState = (settings: GameSettings = DEFAULT_SETTINGS): GameState => {
  if (!isValidGameSettings(settings)) {
    throw new RangeError('Invalid game settings');
  }

  return {
    settings: { ...settings },
    secret: null,
    history: [],
    status: 'settings',
    startedAt: null,
    finishedAt: null,
  };
};

export const updateGameSettings = (state: GameState, settings: GameSettings): GameState => {
  if (state.status !== 'settings' || !isValidGameSettings(settings)) {
    return state;
  }

  return {
    ...state,
    settings: { ...settings },
  };
};

export const startGame = (
  state: GameState,
  random: () => number = Math.random,
  now: () => number = Date.now,
): GameState => {
  if (state.status !== 'settings') {
    return state;
  }

  return {
    ...state,
    secret: generateSecret(state.settings.length, state.settings.base, random),
    history: [],
    status: 'playing',
    startedAt: now(),
    finishedAt: null,
  };
};

export const submitGuess = (
  state: GameState,
  guess: string,
  now: () => number = Date.now,
): GameState => {
  if (state.status !== 'playing' || state.secret === null) {
    return state;
  }

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();

  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);

  if (isDuplicate) {
    return state;
  }

  const result = evaluateGuess(state.secret, normalizedGuess);
  const submittedAt = now();

  const entry: GuessEntry = {
    guess,
    bulls: result.bulls,
    cows: result.cows,
    submittedAt,
  };

  const isWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, entry],
    status: isWon ? 'won' : 'playing',
    finishedAt: isWon ? submittedAt : null,
  };
};

export const resetGame = (state: GameState): GameState => {
  return createInitialGameState(state.settings);
};
