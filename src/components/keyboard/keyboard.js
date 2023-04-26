import keys from '../../data/keys.js';
import Key from './key.js';
import DomBuilder from '../../helpers/DomBuilder.js';

export default class Keyboard {
  constructor() {
    this.element = null;
    this.textarea = null;
    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      case: 'caseDown',
      lang: 'eng',
    };
    this.current = {
      element: null,
      code: null,
      event: null,
      char: null,
    };
    this.previous = {
      element: null,
      code: null,
      event: null,
      char: null,
    };
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
    centralizer.append(textarea);

    const keyboard = DomBuilder.createElement({
      element: 'div',
      classList: ['body--keyboard', 'keyboard'],
      attributes: { id: 'keyboard' },
    });

    keys.ROWS.forEach((row) => {
      const kbdRow = DomBuilder.createElement({
        element: 'div',
        classList: ['keyboard--row', 'row'],
      });

      row.forEach((attributes) => {
        kbdRow.append(
          new Key(
            { attributes },
            this.state.lang,
            this.state.case,
          ).render(),
        );
      });

      keyboard.append(kbdRow);
    });

    centralizer.append(keyboard);
    body.append(centralizer);
  }
}
