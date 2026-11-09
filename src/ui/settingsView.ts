import { countPossibleSecrets } from '../logic/countPossibleSecrets.js';
import type { GameBase, GameState } from '../state/gameState.js';

import { createBrandHeader, createButton, createElement, createFooter } from './dom.js';

interface SettingsViewHandlers {
  onLengthChange: (length: number) => void;
  onBaseChange: (base: GameBase) => void;
  onStart: () => void;
}

const BASE_OPTIONS: readonly { value: GameBase; label: string }[] = [
  { value: 2, label: 'Binary (Base 2)' },
  { value: 8, label: 'Octal (Base 8)' },
  { value: 10, label: 'Decimal (Base 10)' },
  { value: 16, label: 'Hexadecimal (Base 16)' },
];

const BASE_NAMES: Record<GameBase, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
};

const isGameBase = (value: number): value is GameBase => {
  return value === 2 || value === 8 || value === 10 || value === 16;
};

export const createSettingsView = (
  state: GameState,
  handlers: SettingsViewHandlers,
): HTMLElement => {
  const main = createElement('main', 'app-shell');

  main.append(createBrandHeader());

  const heading = createElement('section', 'page-heading');

  heading.append(
    createElement('div', 'eyebrow', 'LOGIC CHALLENGE / 001'),
    createElement('h1', 'page-title', 'Crack the Code.'),
    createElement(
      'p',
      'page-description',
      'A secret number is waiting. Use logic, eliminate possibilities and find the correct combination.',
    ),
  );

  const panel = createElement('section', 'panel');
  const panelHeading = createElement('div', 'panel-heading');

  panelHeading.append(
    createElement('h2', 'panel-title', 'Game configuration'),
    createElement('span', 'status-pill', 'READY TO PLAY'),
  );

  const settingsGrid = createElement('div', 'settings-grid');

  const baseField = createElement('div', 'field');
  const baseLabel = createElement('label', 'field-label', 'Number system');

  const baseSelect = createElement('select', 'field-select');
  baseSelect.id = 'base-select';

  baseLabel.htmlFor = baseSelect.id;

  BASE_OPTIONS.forEach(({ value, label }) => {
    const option = createElement('option', '', label);

    option.value = String(value);
    baseSelect.append(option);
  });

  baseSelect.value = String(state.settings.base);

  baseSelect.addEventListener('change', () => {
    const selectedBase = Number(baseSelect.value);

    if (isGameBase(selectedBase)) {
      handlers.onBaseChange(selectedBase);
    }
  });

  baseField.append(baseLabel, baseSelect);

  const lengthField = createElement('div', 'field');
  const lengthLabel = createElement('span', 'field-label', 'Secret length');

  const lengthOptions = createElement('div', 'length-options');

  Array.from({ length: 5 }, (_, index) => index + 2).forEach((length) => {
    const isSelected = state.settings.length === length;
    const isDisabled = length > state.settings.base;

    const button = createButton(
      String(length),
      `length-option${isSelected ? ' is-selected' : ''}`,
      () => handlers.onLengthChange(length),
      isDisabled,
    );

    button.setAttribute('aria-label', `${length} digits`);
    button.setAttribute('aria-pressed', String(isSelected));

    lengthOptions.append(button);
  });

  lengthField.append(lengthLabel, lengthOptions);

  settingsGrid.append(baseField, lengthField);

  const infoCard = createElement('div', 'info-card');
  const infoDescription = createElement('div');

  infoDescription.append(
    createElement('div', 'field-label', 'Possible combinations'),
    createElement(
      'div',
      'help-card-description',
      `${BASE_NAMES[state.settings.base]} · ${state.settings.length} unique digits`,
    ),
  );

  const combinations = countPossibleSecrets(state.settings.length, state.settings.base);

  const infoValue = createElement('div', 'info-value', combinations.toLocaleString('en-US'));

  infoCard.append(infoDescription, infoValue);

  const startButton = createButton('START GAME →', 'primary-button', handlers.onStart);

  const helpGrid = createElement('div', 'help-grid');

  const bullCard = createElement('div', 'help-card');

  bullCard.append(
    createElement('div', 'help-card-title bull-text', '01 / BULL'),
    createElement('p', 'help-card-description', 'Correct digit in the correct position.'),
  );

  const cowCard = createElement('div', 'help-card');

  cowCard.append(
    createElement('div', 'help-card-title cow-text', '02 / COW'),
    createElement('p', 'help-card-description', 'Correct digit in the wrong position.'),
  );

  helpGrid.append(bullCard, cowCard);

  panel.append(panelHeading, settingsGrid, infoCard, startButton, helpGrid);

  main.append(heading, panel, createFooter());

  return main;
};
