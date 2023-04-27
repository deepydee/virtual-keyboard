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

  #applyKey() {
    let text = this.textarea.value;
    const start = this.textarea.selectionStart;

    const insertChar = () => {
      if (start > 0 && start <= text.length) {
        this.textarea.value = text.slice(0, start)
          + this.current.char
          + text.slice(start, text.length);

        this.textarea.selectionStart = start + this.current.char.length;
        this.textarea.selectionEnd = start + this.current.char.length;
      } else {
        this.textarea.value += this.current.char;
      }
    };

    if (this.#isServiceKey(this.current.code)) {
      switch (this.current.code) {
        case 'Backspace':
          if (start > 0 && start <= text.length) {
            text = text.slice(0, start - 1) + text.slice(start, text.length);
            this.textarea.value = text;
            this.textarea.selectionStart = start - 1;
            this.textarea.selectionEnd = start - 1;
          }
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
    } else {
      insertChar();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  #isServiceKey(code) {
    return KEYS.SERVICE_KEYS.includes(code);
  }

  toggleCaps() {
    this.state.case = this.state.case === 'caps'
      ? 'caseDown'
      : 'caps';

    this.state.isCapsLockPressed = !this.state.isCapsLockPressed;
    if (this.state.isCapsLockPressed) {
      this.keys.CapsLock.setActive();
    } else {
      this.keys.CapsLock.unsetActive();
    }

    for (const key of Object.values(this.keys)) {
      key.changeCase(this.state.case);
    }
    // console.dir(this.keys);
  }

  // updateKeysState(callback, ...args) {
  //   for (const key of Object.values(this.keys)) {
  //     key.callback.call(this, ...args);
  //   }
  // }

  toggleCase() {
    this.state.case = this.state.case === 'caseDown'
      ? 'caseUp'
      : 'caseDown';

    for (const key of Object.values(this.keys)) {
      key.changeCase(this.state.case);
    }
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

  #mouseDown(event) {
    const target = event.target.closest('.key');
    if (!target) return;

    this.#updateCurrentKeyState({
      code: target.dataset.keycode,
      event,
    });

    this.#applyKey();

    if (this.current.code !== 'CapsLock') {
      this.current.key.setActive();
    }
  }

  #mouseUp(event) {
    const target = event.target.closest('.key');
    if (!target) return;

    this.#updateCurrentKeyState({
      code: target.dataset.keycode,
      event,
    });

    if (this.current.code !== 'CapsLock') {
      this.current.key.unsetActive();
    }

    if (this.state.isShiftLeftPressed && this.current.code === 'ShiftLeft') {
      this.state.isShiftLeftPressed = false;
      this.toggleCase();
    } else if (this.state.isShiftRightPressed && this.current.code === 'ShiftRight') {
      this.state.isShiftRightPressed = false;
      this.toggleCase();
    }
  }

  #keyDown(event) {
    event.preventDefault();

    this.#updateCurrentKeyState({
      code: event.code,
      event,
    });

    this.#applyKey();

    if (this.current.code !== 'CapsLock') {
      this.current.key.setActive();
    }

    if (this.current.code === 'MetaLeft') {
      this.current.key.setActive();
      setTimeout(() => {
        this.current.key.unsetActive();
      }, 500);
    } else if (['ShiftLeft', 'ShiftRight'].includes(this.current.code)) {
      this.current.key.setActive();
    }
  }

  #keyUp(event) {
    if (event.code !== 'CapsLock') {
      this.current.key.unsetActive();
    }

    if (event.code === 'ShiftLeft') {
      this.state.isShiftLeftPressed = false;
      this.current.key.unsetActive();
    } else if (event.code === 'ShiftRight') {
      this.state.isShiftRightPressed = false;
      this.current.key.unsetActive();
    }
  }
}
