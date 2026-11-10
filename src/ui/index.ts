import {
  createInitialGameState,
  updateGameSettings,
  startGame,
  submitGuess,
  resetGame,
} from '../state/gameState.js';

import type { GameBase } from '../state/gameState.js';

import { createSettingsView } from './settingsView.js';
import { createGameView } from './gameView.js';
import { formatDuration } from './dom.js';

const app = document.createElement('div');

app.id = 'app';
document.body.append(app);

let gameState = createInitialGameState();

const render = (): void => {
  if (gameState.status === 'settings') {
    const settingsView = createSettingsView(gameState, {
      onLengthChange: (length) => {
        gameState = updateGameSettings(gameState, {
          ...gameState.settings,
          length,
        });

        render();
      },

      onBaseChange: (base: GameBase) => {
        const nextLength = Math.min(gameState.settings.length, base, 6);

        gameState = updateGameSettings(gameState, {
          length: nextLength,
          base,
        });

        render();
      },

      onStart: () => {
        gameState = startGame(gameState);
        render();
      },
    });

    app.replaceChildren(settingsView);
    return;
  }

  const gameView = createGameView(gameState, {
    onSubmitGuess: (guess) => {
      const nextState = submitGuess(gameState, guess);

      if (nextState === gameState) {
        return false;
      }

      gameState = nextState;
      render();

      return true;
    },

    onNewGame: () => {
      gameState = resetGame(gameState);
      render();
    },
  });

  app.replaceChildren(gameView);
};

render();

window.setInterval(() => {
  if (gameState.status !== 'playing' || gameState.startedAt === null) {
    return;
  }

  const timer = app.querySelector<HTMLElement>('[data-role="timer"]');

  if (timer) {
    timer.textContent = formatDuration(Date.now() - gameState.startedAt);
  }
}, 1000);
