declare module "diagram-js/lib/i18n/translate/translate" {
  /**
   * A simple translation stub to be used for multi-language support
   * in diagrams. Can be easily replaced with a more sophisticated
   * solution.
   *
   * @example
   *
   * // use it inside any diagram component by injecting `translate`.
   *
   * function MyService(translate) {
   *   alert(translate('HELLO {you}', { you: 'You!' }));
   * }
   *
   * @param {String} template to interpolate
   * @param {Object} [replacements] a map with substitutes
   *
   * @return {String} the translated string
   */
  const translate: translate.ITranslateFunction;
  export default translate;

  namespace translate {
    type ITranslateFunction = (template: string, replacements?: Object) => string;
  }
}
