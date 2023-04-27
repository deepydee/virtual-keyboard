import KEYS from '../../data/keys.js';
import Key from './key.js';
import DomBuilder from '../../helpers/DomBuilder.js';

export default class Keyboard {
  constructor() {
    this.keyboard = null;
    this.keys = {};
    this.textarea = null;

    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      currentKey: null,
      case: 'caseDown',
      lang: 'rus',
    };

    this.render();

    this.mouseDownHandler = this.mouseDown.bind(this);
    this.mouseUpHandler = this.mouseUp.bind(this);
    this.keyboard.addEventListener('mousedown', this.mouseDownHandler);
    this.keyboard.addEventListener('mouseup', this.mouseUpHandler);
  }

  render() {
    const { body } = document;
    body.classList.add('body');
    const centralizer = DomBuilder.createElement({
      element: 'div',
      classList: ['centralizer'],
    });

    const heading = DomBuilder.createElement({
      element: 'h1',
      classList: ['title'],
      innerText: 'RSS Виртуальная клавиатура',
    });
    centralizer.append(heading);

    const textarea = DomBuilder.createElement({
      element: 'textarea',
      classList: ['body--textarea', 'textarea'],
      attributes: {
        id: 'textarea',
        rows: '5',
        cols: '50',
      },
    });

    textarea.autofocus = true;
    this.textarea = textarea;
    centralizer.append(textarea);

    const keyboard = DomBuilder.createElement({
      element: 'div',
      classList: ['body--keyboard', 'keyboard'],
      attributes: { id: 'keyboard' },
    });

    KEYS.ROWS.forEach((row) => {
      const kbdRow = DomBuilder.createElement({
        element: 'div',
        classList: ['keyboard--row', 'row'],
      });

      row.forEach((attributes) => {
        const isService = KEYS.SERVICE_KEYS.includes(attributes.className);

        const key = new Key(
          { attributes },
          isService,
          this.state.lang,
          this.state.case,
        );
        this.keys[attributes.className] = key;

        kbdRow.append(
          key.render(),
        );
      });

      keyboard.append(kbdRow);
    });

    this.keyboard = keyboard;
    centralizer.append(keyboard);

    const description = DomBuilder.createElement({
      element: 'p',
      innerText: 'Клавиатура создана в операционной системе Windows',
      classList: ['description'],
    });
    centralizer.append(description);

    const language = DomBuilder.createElement({
      element: 'p',
      innerText: 'Для переключения языка комбинация: левыe ctrl + alt',
      classList: ['language'],
    });
    centralizer.append(language);

    body.append(centralizer);
  }

  implementKey(keyKode, key) {
    switch (keyKode) {
      case 'Backspace':
        break;
      case 'Delete':
        break;
      case 'Tab':
        break;
      case 'Enter':
        break;
      case 'CapsLock':
        this.toggleCaps();
        break;
      case 'ShiftLeft':
        break;
      case 'ShiftRight':
        break;
      default:
        throw new Error('Unknown service key has been pressed');
    }
  }

  toggleCaps() {
    this.state.isCapsLockPressed = !this.state.isCapsLockPressed;
    if (this.state.isCapsLockPressed) {
      this.keys.CapsLock.setActive();
    } else {
      this.keys.CapsLock.unsetActive();
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.values(this.keys)) {
      key.toggleCaps();
    }

    console.dir(this.keys);
  }

  mouseDown(event) {
    const target = event.target.closest('.key');

    if (!target) return;

    const keyCode = target.dataset.keycode;
    const key = this.keys[keyCode];
    this.state.currentKey = key;

    if (key.isServiceKey()) {
      this.implementKey(keyCode, key);
    } else {
      key.setActive();
      this.textarea.textContent += key.getChar();
    }
  }

  mouseUp() {
    if (!this.state.currentKey.isServiceKey()) {
      this.state.currentKey.unsetActive();
    }
  }
}
