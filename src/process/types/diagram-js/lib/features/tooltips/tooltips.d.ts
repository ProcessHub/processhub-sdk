declare module "diagram-js/lib/features/tooltips/Tooltips" {

  import EventBus from "diagram-js/lib/core/EventBus";
  import Canvas from "diagram-js/lib/core/Canvas";

  export default class Tooltips {
    /**
     * A service that allows users to render tool tips on the diagram.
     *
     * The tooltip service will take care of updating the tooltip positioning
     * during navigation + zooming.
     *
     * @example
     *
     * ```javascript
     *
     * // add a pink badge on the top left of the shape
     * tooltips.add({
     *   position: {
     *     x: 50,
     *     y: 100
     *   },
     *   html: '<div style="width: 10px; background: fuchsia; color: white;">0</div>'
     * });
     *
     * // or with optional life span
     * tooltips.add({
     *   position: {
     *     top: -5,
     *     left: -5
     *   },
     *   html: '<div style="width: 10px; background: fuchsia; color: white;">0</div>',
     *   ttl: 2000
     * });
     *
     * // remove a tool tip
     * var id = tooltips.add(...);
     * tooltips.remove(id);
     * ```
     *
     * @param {EventBus} eventBus
     * @param {Canvas} canvas
     */
    constructor(eventBus: EventBus, canvas: Canvas);

    /**
     * Adds a HTML tooltip to the diagram
     *
     * @param {Object}               tooltip   the tooltip configuration
     *
     * @param {String|DOMElement}    tooltip.html                 html element to use as an tooltip
     * @param {Object}               [tooltip.show]               show configuration
     * @param {Number}               [tooltip.show.minZoom]       minimal zoom level to show the tooltip
     * @param {Number}               [tooltip.show.maxZoom]       maximum zoom level to show the tooltip
     * @param {Number}               [tooltip.timeout=-1]
     *
     * @return {String}              id that may be used to reference the tooltip for update or removal
     */
    public add(tooltip: {
      html: string | Element;
      show?: {
        minZoom: number;
        maxZoom: number;
      };
      position: {
        x: number;
        y: number;
      };
      timeout?: number;
      type: "error";
    }): string;

    public trigger(action: {}, event: {}): void;

    /**
     * Get a tooltip with the given id
     *
     * @param {String} id
     */
    public get(id: string): {};

    public clearTimeout(tooltip: {}): void;

    public setTimeout(tooltip: {}): void;

    /**
     * Remove an tooltip with the given id
     *
     * @param {String} id
     */
    public remove(id: string): {};

    public show(): void;

    public hide(): void;
  }
}