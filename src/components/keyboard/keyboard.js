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
      case: 'caseUp',
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
    body.append(centralizer);
  }

  mouseDown(event) {
    const target = event.target.closest('.key');

    if (!target) return;

    const keyCode = target.classList[target.classList.length - 1];
    const key = this.keys[keyCode];
    this.state.currentKey = key;

    this.textarea.textContent += key.getKey();
    key.flash();
  }

  mouseUp() {
    this.state.currentKey.unflash();
  }
}
