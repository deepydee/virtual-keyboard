/* eslint-disable no-restricted-syntax */
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
      lang: 'eng',
    };

    this.current = {
      key: null,
      code: null,
      event: null,
      char: null,
    };

    this.previous = {
      key: null,
      code: null,
      event: null,
      char: null,
    };
  }

  init() {
    this.#render();
    this.#initLanguage();

    this.mouseDownHandler = this.#mouseDown.bind(this);
    this.mouseUpHandler = this.#mouseUp.bind(this);
    this.keyDownHandler = this.#keyDown.bind(this);
    this.keyUpHandler = this.#keyUp.bind(this);

    this.keyboard.addEventListener('mousedown', this.mouseDownHandler);
    this.keyboard.addEventListener('mouseup', this.mouseUpHandler);
    document.addEventListener('keydown', this.keyDownHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  }

  #initLanguage() {
    this.state.lang = localStorage.lang ?? this.state.lang;
    this.#updateLanguage();
  }

  #render() {
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
        const key = new Key(
          { attributes },
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

  implementSerciceKey(keyCode, key) {
    if (!this.#isService(keyCode)) return;

    switch (keyCode) {
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
    }
  }

  #isService(code) {
    return KEYS.SERVICE_KEYS.includes(code);
  }

  toggleCaps() {
    this.state.isCapsLockPressed = !this.state.isCapsLockPressed;
    if (this.state.isCapsLockPressed) {
      this.keys.CapsLock.setActive();
    } else {
      this.keys.CapsLock.unsetActive();
    }

    for (const key of Object.values(this.keys)) {
      key.toggleCaps();
    }

    console.dir(this.keys);
  }

  toggleLanguage() {
    this.state.lang = this.state.lang === 'eng'
      ? 'rus'
      : 'eng';

    localStorage.setItem('lang', this.state.lang);
    this.#updateLanguage();
  }

  #updateLanguage() {
    for (const key of Object.values(this.keys)) {
      key.toggleLanguage();
    }
  }

  #updateCurrentKeyState({ code, event = null }) {
    this.previous = { ...this.current };

    this.current.code = code;
    this.current.key = this.keys[code];
    this.current.char = this.current.key.getChar();
    this.current.event = event;
  }

  #processKeyDown() {
    if (this.#isService(this.current.code)) {
      this.implementSerciceKey(this.current.code, this.current.key);
    } else {
      this.current.key.setActive();
      this.textarea.textContent += this.current.key.getChar();
    }
  }

  #processKeyUp() {
    if (!this.#isService(this.current.char)) {
      this.current.key.unsetActive();
    }
  }

  #mouseDown(event) {
    const target = event.target.closest('.key');
    if (!target) return;

    this.#updateCurrentKeyState({
      code: target.dataset.keycode,
      event,
    });

    this.#processKeyDown(this.current.code);
  }

  #mouseUp() {
    this.#processKeyUp();
  }

  #keyDown(event) {
    event.preventDefault();

    this.#updateCurrentKeyState({
      code: event.code,
      event,
    });

    this.#processKeyDown(this.current.code);
  }

  #keyUp() {
    this.#processKeyUp();
  }
}
