declare module "diagram-js/lib/draw/BaseRenderer" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { Connection, Shape } from "diagram-js/lib/model";

  export = BaseRenderer;

  /**
   * The base implementation of shape and connection renderers.
   */
  class BaseRenderer {
    /**
     * The base implementation of shape and connection renderers.
     *
     * @param {EventBus} eventBus
     * @param {Number} [renderPriority=1000]
     */
    constructor(eventBus: EventBus, renderPriority: number);

    /**
     * Should check whether *this* renderer can render
     * the element/connection.
     *
     * @param {Base} element
     *
     * @returns {Boolean}
     */
    public canRender(element: Object): boolean;

    /**
     * Provides the shape's snap svg element to be drawn on the `canvas`.
     *
     * @param {SVGGElement} visuals
     * @param {Shape} shape
     *
     * @returns {SVGElement} [returns a Snap.svg paper element ]
     */
    public drawShape(visuals: SVGGElement, shape: Shape): SVGElement;

    /**
     * Provides the shape's snap svg element to be drawn on the `canvas`.
     *
     * @param {SVGGElement} visuals
     * @param {Connection} connection
     *
     * @returns {SVGGElement} [returns a Snap.svg paper element ]
     */
    public drawConnection(visuals: SVGGElement, connection: Connection): SVGElement;

    /**
     * Gets the SVG path of a shape that represents it's visual bounds.
     *
     * @param {Shape} shape
     *
     * @return {string} svg path
     */
    public getShapePath(shape: Shape): string;

    /**
     * Gets the SVG path of a connection that represents it's visual bounds.
     *
     * @param {Connection} connection
     *
     * @return {string} svg path
     */
    public getConnectionPath(connection: Connection): string;
  }
}
