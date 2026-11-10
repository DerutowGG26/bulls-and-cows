import { describe, expect, test } from 'vitest';
import {
  createInitialGameState,
  resetGame,
  startGame,
  submitGuess,
  updateGameSettings,
  type GameBase,
} from '../src/state/gameState.ts';

describe('Game State', () => {
  test('creates an initial state with default settings', () => {
    const state = createInitialGameState();

    expect(state).toEqual({
      settings: { length: 4, base: 10 },
      secret: null,
      history: [],
      status: 'settings',
      startedAt: null,
      finishedAt: null,
    });
  });

  test('creates an initial state with custom settings', () => {
    const state = createInitialGameState({
      length: 2,
      base: 2,
    });

    expect(state.settings).toEqual({
      length: 2,
      base: 2,
    });
  });

  const invalidSettings: { length: number; base: GameBase }[] = [
    { length: 1, base: 10 },
    { length: 7, base: 16 },
    { length: 3, base: 2 },
  ];

  test.for(invalidSettings)(
    'rejects invalid initial settings: length $length, base $base',
    ({ length, base }) => {
      expect(() => createInitialGameState({ length, base })).toThrow(RangeError);
    },
  );

  test('updates settings before starting a game', () => {
    const initialState = createInitialGameState();

    const updatedState = updateGameSettings(initialState, {
      length: 5,
      base: 10,
    });

    expect(updatedState.settings).toEqual({
      length: 5,
      base: 10,
    });

    expect(initialState.settings.length).toBe(4);
    expect(updatedState).not.toBe(initialState);
  });

  test('does not update settings when they are invalid', () => {
    const state = createInitialGameState();

    const updatedState = updateGameSettings(state, {
      length: 3,
      base: 2,
    });

    expect(updatedState).toBe(state);
  });

  test('does not update settings after starting a game', () => {
    const initialState = createInitialGameState();
    const playingState = startGame(
      initialState,
      () => 0,
      () => 1000,
    );

    const updatedState = updateGameSettings(playingState, {
      length: 2,
      base: 8,
    });

    expect(updatedState).toBe(playingState);
  });

  test('starts a game with a generated secret and start time', () => {
    const initialState = createInitialGameState();

    const state = startGame(
      initialState,
      () => 0,
      () => 1000,
    );

    expect(state).toMatchObject({
      secret: '0123',
      status: 'playing',
      startedAt: 1000,
      finishedAt: null,
      history: [],
    });
  });

  test('does not start an already running game again', () => {
    const initialState = createInitialGameState();
    const playingState = startGame(
      initialState,
      () => 0,
      () => 1000,
    );

    const nextState = startGame(
      playingState,
      () => 0,
      () => 2000,
    );

    expect(nextState).toBe(playingState);
    expect(nextState.startedAt).toBe(1000);
  });

  test('adds a valid guess to history immutably', () => {
    const initialState = createInitialGameState();
    const playingState = startGame(
      initialState,
      () => 0,
      () => 1000,
    );

    const nextState = submitGuess(playingState, '4012', () => 1500);

    expect(playingState.history).toEqual([]);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history).not.toBe(playingState.history);

    expect(nextState.history[0]).toEqual({
      guess: '4012',
      bulls: 0,
      cows: 3,
      submittedAt: 1500,
    });
  });

  test('ignores a guess with an incorrect length', () => {
    const playingState = startGame(
      createInitialGameState(),
      () => 0,
      () => 1000,
    );

    const nextState = submitGuess(playingState, '123', () => 1500);

    expect(nextState).toBe(playingState);
    expect(nextState.history).toHaveLength(0);
  });

  test('ignores a guess containing repeated digits', () => {
    const playingState = startGame(
      createInitialGameState(),
      () => 0,
      () => 1000,
    );

    const nextState = submitGuess(playingState, '0012', () => 1500);

    expect(nextState).toBe(playingState);
  });

  test('does not add the same guess to history twice', () => {
    const playingState = startGame(
      createInitialGameState(),
      () => 0,
      () => 1000,
    );

    const firstState = submitGuess(playingState, '4012', () => 1500);
    const secondState = submitGuess(firstState, '4012', () => 2000);

    expect(firstState.history).toHaveLength(1);
    expect(secondState.history).toHaveLength(1);
    expect(secondState).toBe(firstState);
  });

  test('does not accept guesses before the game starts', () => {
    const state = createInitialGameState();

    const nextState = submitGuess(state, '1234');

    expect(nextState).toBe(state);
  });

  test('finishes the game when the secret is guessed', () => {
    const playingState = startGame(
      createInitialGameState({ length: 2, base: 10 }),
      () => 0,
      () => 1000,
    );

    const wonState = submitGuess(playingState, '01', () => 2000);

    expect(wonState.status).toBe('won');
    expect(wonState.finishedAt).toBe(2000);
    expect(wonState.history[0]).toMatchObject({
      guess: '01',
      bulls: 2,
      cows: 0,
    });
  });

  test('does not accept guesses after winning', () => {
    const playingState = startGame(
      createInitialGameState({ length: 2, base: 10 }),
      () => 0,
      () => 1000,
    );

    const wonState = submitGuess(playingState, '01', () => 2000);
    const nextState = submitGuess(wonState, '23', () => 3000);

    expect(nextState).toBe(wonState);
    expect(nextState.history).toHaveLength(1);
  });

  test('resets the game while preserving selected settings', () => {
    const initialState = createInitialGameState({
      length: 4,
      base: 10,
    });

    const playingState = startGame(
      initialState,
      () => 0,
      () => 1000,
    );
    const stateWithHistory = submitGuess(playingState, '4012', () => 1500);

    const resetState = resetGame(stateWithHistory);

    expect(resetState).toMatchObject({
      settings: { length: 4, base: 10 },
      secret: null,
      history: [],
      status: 'settings',
      startedAt: null,
      finishedAt: null,
    });

    expect(resetState.history).not.toBe(stateWithHistory.history);
    expect(stateWithHistory.history).toHaveLength(1);
  });
});
