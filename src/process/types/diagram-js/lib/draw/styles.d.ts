declare module "diagram-js/lib/draw/Styles" {
  /**
   * A component that manages shape styles
   */
  export default class Styles {
    constructor();

    /**
     * Builds a style definition from a className, a list of traits and an object of additional attributes.
     *
     * @param  {String} className
     * @param  {Array<String>} traits
     * @param  {Object} additionalAttrs
     *
     * @return {Object} the style defintion
     */
    public cls(className: string, traits: string[], additionalAttrs: Object): Object;

    /**
     * Builds a style definition from a list of traits and an object of additional attributes.
     *
     * @param  {Array<String>} traits
     * @param  {Object} additionalAttrs
     *
     * @return {Object} the style defintion
     */
    public style(traits: string[], additionalAttrs: Object): Object;

    public computeStyle(custom: {}, traits: string[], defaultStyles: {}): {};
  }
}
