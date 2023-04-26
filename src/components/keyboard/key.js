import DomBuilder from '../../helpers/DomBuilder.js';

export default class Key {
  constructor({ attributes }) {
    this.attributes = attributes;
    this.#render();
  }

  #render() {
    const key = DomBuilder.createElement({
      element: 'div',
      classList: ['keyboard--key', 'key', this.attributes.className],
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const [lang, langSettings] of Object.entries(this.attributes.lang)) {
      console.log(langSettings.caseDown);
      const keyNode = DomBuilder.createElement({
        element: 'span',
        classList: [lang, 'hidden'],
      });

      const keyChildNodes = [
        DomBuilder.createElement({
          element: 'span',
          classList: ['caseDown', 'hidden'],
          innerText: langSettings.caseDown,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: ['caseUp', 'hidden'],
          innerText: langSettings.caseUp,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: ['caps', 'hidden'],
          innerText: langSettings.caps,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: ['shiftCaps', 'hidden'],
          innerText: langSettings.shiftCaps,
        }),
      ];

      keyNode.append(...keyChildNodes);
      key.append(keyNode);
    }

    return key;
  }
}
