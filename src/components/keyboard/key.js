import DomBuilder from '../../helpers/DomBuilder.js';

export default class Key {
  constructor(
    { attributes },
    isService,
    currentLang = 'eng',
    currentCase = 'caseDown',
  ) {
    this.attributes = attributes;
    this.isService = isService;
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

    // eslint-disable-next-line no-restricted-syntax
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

  getChar() {
    return this.char;
  }

  toggleCaps() {
    this.currentCase = this.currentCase === 'caps'
      ? 'caseDown'
      : 'caps';

    this.#setChar();
    this.rerender();
  }

  rerender() {
    [...this.key.children].forEach((el) => {
      if (el.classList.contains(this.currentLang)) {
        [...el.children].map((e) => (e.classList.contains(this.currentCase)
          ? e.classList.remove('hidden')
          : e.classList.add('hidden')));
      }
    });
  }

  toggleLang() {
    this.currentCase = this.currentLang === 'eng'
      ? 'rus'
      : 'eng';
  }

  setActive() {
    this.key.classList.add('active');
  }

  unsetActive() {
    this.key.classList.remove('active');
  }

  toggleActive() {
    this.key.classList.toggle('active');
  }

  isServiceKey() {
    return this.isService;
  }
}
