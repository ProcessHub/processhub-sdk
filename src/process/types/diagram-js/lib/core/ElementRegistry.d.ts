declare module "diagram-js/lib/core/ElementRegistry" {
  export = ElementRegistry;

  import { Base } from "diagram-js/lib/model";

  /**
   * @class
   *
   * A registry that keeps track of all shapes in the diagram.
   */
  class ElementRegistry {
    constructor();

    /**
     * Register a pair of (element, gfx, (secondaryGfx)).
     *
     * @param {Base} element
     * @param {SVGElement} gfx
     * @param {SVGElement} [secondaryGfx] optional other element to register, too
     */
    public add(element: Base, gfx: SVGElement, secondaryGfx?: SVGElement): void;

    /**
     * Removes an element from the registry.
     *
     * @param {Base} element
     */
    public remove(element: Base): void;

    /**
     * Update the id of an element
     *
     * @param {Base} element
     * @param {string} newId
     */
    public updateId(element: Base, newId: string): void;

    /**
     * Return the model element for a given id or graphics.
     *
     * @example
     *
     * elementRegistry.get('SomeElementId_1');
     * elementRegistry.get(gfx);
     *
     *
     * @param {string|SVGElement} filter for selecting the element
     *
     * @return {Base}
     */
    public get(filter: string | SVGElement): Base;

    /**
     * Return all elements that match a given filter function.
     *
     * @param {Function} fn
     *
     * @return {Array<Base>}
     */
    public filter(fn: (element: Base) => boolean): Base[];

    /**
     * Return all rendered model elements.
     *
     * @return {Array<Base>}
     */
    public getAll(): Base[];

    /**
     * Iterate over all diagram elements.
     *
     * @param {Function} fn
     */
    public forEach(fn: (element: Base, gfx: SVGElement) => void): void;

    /**
     * Return the graphical representation of an element or its id.
     *
     * @example
     * elementRegistry.getGraphics('SomeElementId_1');
     * elementRegistry.getGraphics(rootElement); // <g ...>
     *
     * elementRegistry.getGraphics(rootElement, true); // <svg ...>
     *
     *
     * @param {string|Base} filter
     * @param {boolean} [secondary=false] whether to return the secondary connected element
     *
     * @return {SVGElement}
     */
    public getGraphics(filter: Base | string, secondary?: boolean): SVGElement;

    /**
     * Validate the suitability of the given id and signals a problem
     * with an exception.
     *
     * @param {string} id
     *
     * @throws {Error} if id is empty or already assigned
     */
    public _validateId(id: string): void;
  }
}