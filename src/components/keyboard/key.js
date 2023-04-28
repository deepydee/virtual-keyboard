/* eslint-disable no-restricted-syntax */
import DomBuilder from '../../helpers/DomBuilder.js';
import LANGUAGES from './common/languages.js';
import CASES from './common/cases.js';

/**
 * Separate keyboard's key class
 * @class
 */
export default class Key {
  /**
   * @constructor
   * @param {object} attributes Key attributes object
   * @param {enum<LANGUAGES>} currentLang Current language
   * @param {enum<CASES>} currentCase Current char case
   */
  constructor(
    { attributes },
    currentLang = LANGUAGES.eng,
    currentCase = CASES.caseDown,
  ) {
    this.attributes = attributes;
    this.currentLang = currentLang;
    this.currentCase = currentCase;
    this.#updateChar();
    this.key = null;
  }

  /**
   * Render initial key DOM structure
   * @public
   * @returns {Key} A Key object
   */
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
            && this.currentCase === CASES.caseDown
            ? [CASES.caseDown]
            : [CASES.caseDown, 'hidden'],
          innerText: langSettings.caseDown,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === CASES.caseUp
            ? [CASES.caseUp]
            : [CASES.caseUp, 'hidden'],
          innerText: langSettings.caseUp,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === CASES.caps
            ? [CASES.caps]
            : [CASES.caps, 'hidden'],
          innerText: langSettings.caps ?? langSettings.caseUp,
        }),
        DomBuilder.createElement({
          element: 'span',
          classList: this.currentLang === lang
          && this.currentCase === CASES.shiftCaps
            ? [CASES.shiftCaps]
            : [CASES.shiftCaps, 'hidden'],
          innerText: langSettings.shiftCaps ?? langSettings.caseUp,
        }),
      ];

      keyNode.append(...keyChildNodes);
      key.append(keyNode);
    }

    this.key = key;
    return key;
  }

  /**
   * Update current state
   * @public
   * @returns {void}
   */
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

  /**
   * Get current char
   * @public
   * @returns {string} char
   */
  getChar() {
    return this.char;
  }

  /**
   * Update current char
   * @private
   * @returns {void}
   */
  #updateChar() {
    switch (this.currentCase) {
      case (CASES.caps):
        this.char = this.attributes.lang[this.currentLang][CASES.caps]
          ?? this.attributes.lang[this.currentLang][CASES.caseUp];
        break;
      case (CASES.shiftCaps):
        this.char = this.attributes.lang[this.currentLang][CASES.shiftCaps]
          ?? this.attributes.lang[this.currentLang][CASES.caseDown];
        break;
      default:
        this.char = this.attributes.lang[this.currentLang][this.currentCase];
        break;
    }
  }

  /**
   * Get current keyCode
   * @public
   * @returns {string} keyCode
   */
  getCode() {
    return this.attributes.className;
  }

  /**
   * Update current case
   * @public
   * @param {enum<CASES>} newCase
   * @returns {void}
   */
  changeCase(newCase) {
    this.currentCase = newCase;

    this.#updateChar();
    this.rerender();
  }

  /**
   * Update current language
   * @public
   * @param {enum<LANGUAGES>} lang
   * @returns {void}
   */
  changeLanguage(lang) {
    this.currentLang = lang;

    this.#updateChar();
    this.rerender();
  }

  /**
   * Toggle active state
   * @public
   * @returns {void}
   */
  toggleActive() {
    this.key.classList.toggle('active');
  }

  /**
   * Set active state
   * @public
   * @returns {void}
   */
  setActive() {
    this.key.classList.add('active');
  }

  /**
   * Remove active state
   * @public
   * @returns {void}
   */
  unsetActive() {
    this.key.classList.remove('active');
  }

  /**
   * Check active state
   * @public
   * @returns {void}
   */
  isActive() {
    return this.key.classList.contains('active');
  }
}
