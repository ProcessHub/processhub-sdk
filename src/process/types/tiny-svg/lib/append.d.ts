declare module "tiny-svg/lib/append" {
  export = append;

  /**
   * Append a node to an element
   *
   * @param  {SVGElement} element
   * @param  {SVGElement} node
   *
   * @return {SVGElement} the element
   */
  function append(element: SVGElement, node: SVGElement): SVGElement;
}