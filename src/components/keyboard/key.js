/* eslint-disable no-restricted-syntax */
import DomBuilder from '../../helpers/DomBuilder.js';

export default class Key {
  constructor(
    { attributes },
    currentLang = 'eng',
    currentCase = 'caseDown',
  ) {
    this.attributes = attributes;
    this.currentLang = currentLang;
    this.currentCase = currentCase;
    this.#setChar();
    this.key = null;
  }

  render() {
    const key = DomBuilder.createElement({
      element: 'div',
      classList: ['keyboard--key', 'key', this.attributes.className],
      attributes: { 'data-keycode': this.attributes.className },
    });

    for (const [lang, langSettings] of Object.entries(this.attributes.lang)) {
      const keyNode = DomBuilder.createElement({
        element: 'span',
        classList: this.currentLang === lang
          ? [lang]
          : [lang, 'hidden'],
      });

      const keyChildNodes = [
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
            && this.currentCase === 'caseDown'
            ? ['caseDown']
            : ['caseDown', 'hidden'],
          innerText: langSettings.caseDown,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === 'caseUp'
            ? ['caseUp']
            : ['caseUp', 'hidden'],
          innerText: langSettings.caseUp,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === 'caps'
            ? ['caps']
            : ['caps', 'hidden'],
          innerText: langSettings.caps ?? langSettings.caseUp,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === 'shiftCaps'
            ? ['shiftCaps']
            : ['shiftCaps', 'hidden'],
          innerText: langSettings.shiftCaps ?? langSettings.caseUp,
        }),
      ];

      keyNode.append(...keyChildNodes);
      key.append(keyNode);
    }

    this.key = key;
    return key;
  }

  rerender() {
    [...this.key.children].map((el) => (el.classList.contains(this.currentLang)
      ? el.classList.remove('hidden')
      : el.classList.add('hidden')));

    [...this.key.children].forEach((el) => {
      if (el.classList.contains(this.currentLang)) {
        [...el.children].map((e) => (e.classList.contains(this.currentCase)
          ? e.classList.remove('hidden')
          : e.classList.add('hidden')));
      }
    });
  }

  getChar() {
    return this.char;
  }

  #setChar() {
    switch (this.currentCase) {
      case 'caps':
        this.char = this.attributes.lang[this.currentLang][this.currentCase]
          ?? this.attributes.lang[this.currentLang].caseUp;
        break;
      case 'shiftCaps':
        this.char = this.attributes.lang[this.currentLang][this.currentCase]
          ?? this.attributes.lang[this.currentLang].caseDown;
        break;
      default:
        this.char = this.attributes.lang[this.currentLang][this.currentCase];
        break;
    }
  }

  getCode() {
    return this.attributes.className;
  }

  toggleCaps() {
    this.currentCase = this.currentCase === 'caps'
      ? 'caseDown'
      : 'caps';

    this.#setChar();
    this.rerender();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'eng'
      ? 'rus'
      : 'eng';

    this.#setChar();
    this.rerender();
  }

  toggleActive() {
    this.key.classList.toggle('active');
  }

  setActive() {
    this.key.classList.add('active');
  }

  unsetActive() {
    this.key.classList.remove('active');
  }
}
