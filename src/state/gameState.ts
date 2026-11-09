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

export const createInitialGameState = (settings?: GameSettings): GameState => {
  void settings;

  throw new Error('Not implemented');
};

export const updateGameSettings = (state: GameState, settings: GameSettings): GameState => {
  void state;
  void settings;

  throw new Error('Not implemented');
};

export const startGame = (
  state: GameState,
  random: () => number = Math.random,
  now: () => number = Date.now,
): GameState => {
  void state;
  void random;
  void now;

  throw new Error('Not implemented');
};

export const submitGuess = (
  state: GameState,
  guess: string,
  now: () => number = Date.now,
): GameState => {
  void state;
  void guess;
  void now;

  throw new Error('Not implemented');
};

export const resetGame = (state: GameState): GameState => {
  void state;

  throw new Error('Not implemented');
};
