declare module "diagram-js/lib/core/GraphicsFactory" {
  export = GraphicsFactory;
  import EventBus = require("diagram-js/lib/core/EventBus");
  import ElementRegistry = require("diagram-js/lib/core/ElementRegistry");

  /**
   * A factory that creates graphical elements
   */
  class GraphicsFactory {
    /**
     * A factory that creates graphical elements
     *
     * @param {EventBus} eventBus
     * @param {ElementRegistry} elementRegistry
     */
    constructor(eventBus: EventBus, elementRegistry: ElementRegistry);

    public _getChildren(element: {}): {};

    /**
     * Clears the graphical representation of the element and returns the
     * cleared visual (the <g class="djs-visual" /> element).
     */
    public _clear(gfx: {}): {};

    /**
     * Creates a gfx container for shapes and connections
     *
     * The layout is as follows:
     *
     * <g class="djs-group">
     *
     *   <!-- the gfx -->
     *   <g class="djs-element djs-(shape|connection)">
     *     <g class="djs-visual">
     *       <!-- the renderer draws in here -->
     *     </g>
     *
     *     <!-- extensions (overlays, click box, ...) goes here
     *   </g>
     *
     *   <!-- the gfx child nodes -->
     *   <g class="djs-children"></g>
     * </g>
     *
     * @param {Object} parent
     * @param {String} type the type of the element, i.e. shape | connection
     */
    public _createContainer(type: string, parentGfx: Object): {};

    public create(type: {}, element: {}): {};

    public updateContainments(elements: {}): {};

    public drawShape(visual: {}, element: {}): {};

    public getShapePath(element: {}): {};

    public drawConnection(visual: {}, element: {}): {};

    public getConnectionPath(waypoints: {}): {};

    public update(type: {}, element: {}, gfx: {}): {};
    public remove(element: {}): {};
  }
}