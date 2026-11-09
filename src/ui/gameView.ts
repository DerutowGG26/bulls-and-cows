import { createDigitValidator } from '../logic/createDigitValidator.js';
import type { GameState } from '../state/gameState.js';

import {
  createBrandHeader,
  createButton,
  createElement,
  createFooter,
  formatDuration,
} from './dom.js';

interface GameViewHandlers {
  onSubmitGuess: (guess: string) => boolean;
  onNewGame: () => void;
}

const BASE_NAMES: Record<number, string> = {
  2: 'BINARY',
  8: 'OCTAL',
  10: 'DECIMAL',
  16: 'HEXADECIMAL',
};

export const createGameView = (state: GameState, handlers: GameViewHandlers): HTMLElement => {
  const main = createElement('main', 'app-shell');

  main.append(createBrandHeader());

  const heading = createElement('section', 'page-heading');

  heading.append(
    createElement('div', 'eyebrow', 'LOGIC CHALLENGE / ACTIVE ROUND'),
    createElement('h1', 'page-title', 'Find the Code.'),
    createElement(
      'p',
      'page-description',
      'Enter a unique combination of digits. Every attempt gives you a new clue.',
    ),
  );

  const panel = createElement('section', 'panel');

  const panelHeading = createElement('div', 'panel-heading');

  panelHeading.append(
    createElement('h2', 'panel-title', 'Your game'),
    createElement('span', 'status-pill', state.status === 'won' ? 'COMPLETED' : 'IN PROGRESS'),
  );

  const gameMeta = createElement('div', 'game-meta');

  const attemptsCard = createElement('div', 'meta-card');

  attemptsCard.append(
    createElement('div', 'meta-label', 'Attempts'),
    createElement('div', 'meta-value', String(state.history.length)),
  );

  const timerCard = createElement('div', 'meta-card');

  timerCard.append(createElement('div', 'meta-label', 'Time'));

  const endTime = state.finishedAt ?? Date.now();

  const elapsedTime = state.startedAt === null ? 0 : endTime - state.startedAt;

  const timerValue = createElement('div', 'meta-value', formatDuration(elapsedTime));

  timerValue.dataset.role = 'timer';

  timerCard.append(timerValue);

  const systemCard = createElement('div', 'meta-card');

  systemCard.append(
    createElement('div', 'meta-label', 'System'),
    createElement('div', 'meta-value', BASE_NAMES[state.settings.base] ?? 'UNKNOWN'),
  );

  gameMeta.append(attemptsCard, timerCard, systemCard);

  const secretDisplay = createElement('div', 'secret-display');
  const secretDigits = [...(state.secret ?? '')];

  Array.from({ length: state.settings.length }, (_, index) => {
    const isWon = state.status === 'won';
    const digit = isWon ? (secretDigits[index] ?? '•') : '•';

    const slot = createElement('div', 'secret-slot', digit);

    slot.setAttribute(
      'aria-label',
      isWon ? `Secret digit ${index + 1}: ${digit}` : `Hidden digit ${index + 1}`,
    );

    secretDisplay.append(slot);
  });

  panel.append(panelHeading, gameMeta, secretDisplay);

  if (state.status === 'won') {
    const winBanner = createElement('section', 'win-banner');

    winBanner.setAttribute('aria-live', 'polite');

    winBanner.append(
      createElement('h2', 'win-title', 'Code cracked!'),
      createElement(
        'p',
        'win-description',
        `You found the secret in ${state.history.length} attempts.`,
      ),
    );

    panel.append(winBanner);
  }

  if (state.status === 'playing') {
    const guessForm = createElement('form', 'guess-form');

    const guessInput = createElement('input', 'guess-input');

    guessInput.type = 'text';
    guessInput.maxLength = state.settings.length;
    guessInput.placeholder = `ENTER ${state.settings.length} DIGITS`;
    guessInput.autocomplete = 'off';
    guessInput.spellcheck = false;
    guessInput.setAttribute('aria-label', 'Enter your guess');
    guessInput.setAttribute('autocapitalize', 'characters');

    const errorMessage = createElement('p', 'error-message');

    errorMessage.id = 'guess-error';
    errorMessage.setAttribute('aria-live', 'polite');

    guessInput.setAttribute('aria-describedby', errorMessage.id);

    const isValidDigit = createDigitValidator(state.settings.base);

    guessInput.addEventListener('input', () => {
      const filteredValue = [...guessInput.value]
        .filter(isValidDigit)
        .slice(0, state.settings.length)
        .join('');

      if (guessInput.value !== filteredValue) {
        guessInput.value = filteredValue;
      }

      errorMessage.textContent = '';
    });

    const submitButton = createElement('button', 'primary-button', 'CHECK GUESS →');

    submitButton.type = 'submit';

    guessForm.append(guessInput, submitButton);

    guessForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!guessInput.value) {
        errorMessage.textContent = 'Enter your guess first.';
        return;
      }

      const accepted = handlers.onSubmitGuess(guessInput.value);

      if (!accepted) {
        errorMessage.textContent =
          'Invalid or already used guess. Check your digits and try again.';
      }
    });

    panel.append(guessForm, errorMessage);
  }

  const historySection = createElement('section', 'history-section');
  const historyHeading = createElement('div', 'history-heading');

  historyHeading.append(
    createElement('h2', 'history-title', 'Attempt history'),
    createElement('span', 'history-count', `${state.history.length} attempts`),
  );

  const historyList = createElement('div', 'history-list');

  historyList.setAttribute('aria-live', 'polite');

  if (state.history.length === 0) {
    historyList.append(
      createElement('div', 'history-empty', 'No attempts yet. Your first guess starts here.'),
    );
  } else {
    [...state.history].reverse().forEach((entry) => {
      const row = createElement('div', 'history-entry');

      const guess = createElement('span', 'history-guess', entry.guess.toUpperCase());

      const results = createElement('div', 'result-group');

      const bulls = createElement('span', 'result-badge bulls', `${entry.bulls} BULLS`);

      const cows = createElement('span', 'result-badge cows', `${entry.cows} COWS`);

      results.append(bulls, cows);
      row.append(guess, results);
      historyList.append(row);
    });
  }

  historySection.append(historyHeading, historyList);

  const newGameButton = createButton('NEW GAME', 'secondary-button', handlers.onNewGame);

  panel.append(historySection, newGameButton);

  main.append(heading, panel, createFooter());

  return main;
};
