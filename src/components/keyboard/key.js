import DomBuilder from '../../helpers/DomBuilder.js';

export default class Key {
  constructor({ attributes }, currentLang = 'eng', currentCase = 'caseDown') {
    this.attributes = attributes;
    this.currentLang = currentLang;
    this.currentCase = currentCase;
    this.key = null;
  }

  render() {
    const key = DomBuilder.createElement({
      element: 'div',
      classList: ['keyboard--key', 'key', this.attributes.className],
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
          innerText: langSettings.caps,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === 'shiftCaps'
            ? ['shiftCaps']
            : ['shiftCaps', 'hidden'],
          innerText: langSettings.shiftCaps,
        }),
      ];

      keyNode.append(...keyChildNodes);
      key.append(keyNode);
    }

    this.key = key;
    return key;
  }

  flash() {
    this.key.classList.add('active');
  }

  unflash() {
    this.key.classList.remove('active');
  }

  getKey() {
    return this.attributes.lang[this.currentLang][this.currentCase];
  }
}
