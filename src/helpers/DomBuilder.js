export default class DomBuilder {
  /**
   * @param {string} element tag to be created
   * @param {array} classList array of classes
   * @param {string} innerText inner text
   * @param {object} attributes object of attributes should be set
   * @return {HTMLElement}
   */
  static createElement({
    element, classList, innerText = null, attributes = {},
  }) {
    const el = document.createElement(element);
    classList.forEach((className) => el.classList.add(className));

    el.innerText = innerText ?? '';

    if (Object.keys(attributes).length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [attribute, value] of Object.entries(attributes)) {
        el.setAttribute(attribute, value);
      }
    }

    return el;
  }
}
