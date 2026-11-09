export const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  className = '',
  text?: string,
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
};

export const createButton = (
  text: string,
  className: string,
  onClick: () => void,
  disabled = false,
): HTMLButtonElement => {
  const button = createElement('button', className, text);

  button.type = 'button';
  button.disabled = disabled;
  button.addEventListener('click', onClick);

  return button;
};

export const createBrandHeader = (): HTMLElement => {
  const header = createElement('header', 'topbar');
  const brand = createElement('div', 'brand');
  const mark = createElement('div', 'brand-mark', 'B&C');

  mark.setAttribute('aria-hidden', 'true');

  const brandInfo = createElement('div');
  const name = createElement('div', 'brand-name', 'Bulls & Cows');
  const caption = createElement('div', 'brand-caption', 'NUMBER LOGIC GAME');

  brandInfo.append(name, caption);
  brand.append(mark, brandInfo);

  const note = createElement('div', 'topbar-note', 'THINK BEFORE YOU GUESS');

  header.append(brand, note);

  return header;
};

export const createFooter = (): HTMLElement => {
  const footer = createElement('footer', 'footer');

  const copyright = createElement('span', '', 'Bulls & Cows — Number Logic Game');

  const technology = createElement('span', '', 'Built with TypeScript');

  footer.append(copyright, technology);

  return footer;
};

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ].join(':');
  }

  return [String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')].join(':');
};
