declare module "diagram-js/lib/core/Canvas" {

  import EventBus from "diagram-js/lib/core/EventBus";
  import GraphicsFactory from "diagram-js/lib/core/GraphicsFactory";
  import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
  import { IBounds, IPoint } from "diagram-js";
  import { Base, Connection, Shape } from "diagram-js/lib/model";

  /**
   * The main drawing canvas.
   *
   * @class
   * @constructor  
   */
  export default class Canvas {

    public static $inject: string[];

    /**
     * The main drawing canvas.
     *
     * @class
     * @constructor
     *
     * @emits Canvas#canvas.init
     *
     * @param {Object} config
     * @param {EventBus} eventBus
     * @param {GraphicsFactory} graphicsFactory
     * @param {ElementRegistry} elementRegistry
     */
    constructor(config: ICanvasConfig, eventBus: EventBus, graphicsFactory: GraphicsFactory, elementRegistry: ElementRegistry);

    /**
     * Returns the default layer on which
     * all elements are drawn.
     *
     * @returns {SVGGElement}
     */
    public getDefaultLayer(): SVGGElement;

    /**
     * Returns a layer that is used to draw elements
     * or annotations on it.
     *
     * @param  {String} name
     *
     * @returns {SVGGElement}
     */
    public getLayer(name: "base" | "resizers"): SVGGElement;

    /**
     * Returns the html element that encloses the
     * drawing canvas.
     *
     * @return {DOMNode}
     */
    public getContainer(): HTMLElement;

    /**
     * Adds a marker to an element (basically a css class).
     *
     * Fires the element.marker.update event, making it possible to
     * integrate extension into the marker life-cycle, too.
     *
     * @example
     * canvas.addMarker('foo', 'some-marker');
     *
     * var fooGfx = canvas.getGraphics('foo');
     *
     * fooGfx; // <g class="... some-marker"> ... </g>
     *
     * @param {String|djs.model.Base} element
     * @param {String} marker
     */
    public addMarker(element: Base, marker: string): void;

    /**
     * Remove a marker from an element.
     *
     * Fires the element.marker.update event, making it possible to
     * integrate extension into the marker life-cycle, too.
     *
     * @param  {String|djs.model.Base} element
     * @param  {String} marker
     */
    public removeMarker(element: Base, marker: string): void;

    /**
     * Check the existence of a marker on element.
     *
     * @param  {String|djs.model.Base} element
     * @param  {String} marker
     */
    public hasMarker(element: Base, marker: string): boolean;

    /**
     * Toggles a marker on an element.
     *
     * Fires the element.marker.update event, making it possible to
     * integrate extension into the marker life-cycle, too.
     *
     * @param  {String|djs.model.Base} element
     * @param  {String} marker
     */
    public toggleMarker(element: Base, marker: string): void;

    public getRootElement(): Shape;

    /**
     * Sets a given element as the new root element for the canvas
     * and returns the new root element.
     *
     * @param {Object|djs.model.Root} element
     * @param {Boolean} [override] whether to override the current root element, if any
     *
     * @return {Object|djs.model.Root} new root element
     */
    public setRootElement(element: Object, override: boolean): Object;

    /**
     * Adds an element to the canvas.
     *
     * This wires the parent <-> child relationship between the element and
     * a explicitly specified parent or an implicit root element.
     *
     * During add it emits the events
     *
     *  * <{type}.add> (element, parent)
     *  * <{type}.added> (element, gfx)
     *
     * Extensions may hook into these events to perform their magic.
     *
     * @param {String} type
     * @param {Object|djs.model.Base} element
     * @param {Object|djs.model.Base} [parent]
     * @param {Number} [parentIndex]
     *
     * @return {Object|djs.model.Base} the added element
     */
    public _addElement(type: string, element: Base, parent: Base, parentIndex: number): Base;

    /**
     * Adds a shape to the canvas
     *
     * @param {Object|djs.model.Shape} shape to add to the diagram
     * @param {djs.model.Base} [parent]
     * @param {Number} [parentIndex]
     *
     * @return {djs.model.Shape} the added shape
     */
    public addShape(shape: Shape, parent?: Base, parentIndex?: number): Shape;

    /**
     * Adds a connection to the canvas
     *
     * @param {Object|djs.model.Connection} connection to add to the diagram
     * @param {djs.model.Base} [parent]
     * @param {Number} [parentIndex]
     *
     * @return {djs.model.Connection} the added connection
     */
    public addConnection(connection: Connection, parent?: Base, parentIndex?: number): Connection;

    /**
     * Removes a shape from the canvas
     *
     * @param {String|djs.model.Shape} shape or shape id to be removed
     *
     * @return {djs.model.Shape} the removed shape
     */
    public removeShape(shape: Shape | string): Shape;

    /**
     * Removes a connection from the canvas
     *
     * @param {String|djs.model.Connection} connection or connection id to be removed
     *
     * @return {djs.model.Connection} the removed connection
     */
    public removeConnection(connection: Connection | string): Connection;

    /**
     * Return the graphical object underlaying a certain diagram element
     *
     * @param {String|djs.model.Base} element descriptor of the element
     * @param {Boolean} [secondary=false] whether to return the secondary connected element
     *
     * @return {SVGElement}
     */
    public getGraphics(element: Base | string, secondary: boolean): SVGElement;

    /**
     * Perform a viewbox update via a given change function.
     *
     * @param {Function} changeFn
     */
    public _changeViewbox(changeFn: Function): void;

    public _clear(): void;

    /**
     * Gets or sets the view box of the canvas, i.e. the
     * area that is currently displayed.
     *
     * The getter may return a cached viewbox (if it is currently
     * changing). To force a recomputation, pass `false` as the first argument.
     *
     * @example
     *
     * canvas.viewbox({ x: 100, y: 100, width: 500, height: 500 })
     *
     * // sets the visible area of the diagram to (100|100) -> (600|100)
     * // and and scales it according to the diagram width
     *
     * var viewbox = canvas.viewbox(); // pass `false` to force recomputing the box.
     *
     * console.log(viewbox);
     * // {
     * //   inner: Dimensions,
     * //   outer: Dimensions,
     * //   scale,
     * //   x, y,
     * //   width, height
     * // }
     *
     * @param  {Object} [box] the new view box to set
     * @param  {Number} box.x the top left X coordinate of the canvas visible in view box
     * @param  {Number} box.y the top left Y coordinate of the canvas visible in view box
     * @param  {Number} box.width the visible width
     * @param  {Number} box.height
     *
     * @return {Object} the current view box
     */
    public viewbox(cached: false): IViewBox;
    public viewbox(): IViewBox;
    public viewbox(box: IBounds): void;

    /**
     * Gets or sets the scroll of the canvas.
     *
     * @param {Object} [delta] the new scroll to apply.
     *
     * @param {Number} [delta.dx]
     * @param {Number} [delta.dy]
     */
    public scroll(delta: Object): Object;

    /**
     * Gets or sets the current zoom of the canvas, optionally zooming
     * to the specified position.
     *
     * The getter may return a cached zoom level. Call it with `false` as
     * the first argument to force recomputation of the current level.
     *
     * @param {String|Number} [newScale] the new zoom level, either a number, i.e. 0.9,
     *                                   or `fit-viewport` to adjust the size to fit the current viewport
     * @param {String|Point} [center] the reference point { x: .., y: ..} to zoom to, 'auto' to zoom into mid or null
     *
     * @return {Number} the current scale
     */
    public zoom(newScale: number | "fit-viewport", center: IPoint | "auto"): number;

    /**
     * Returns the size of the canvas
     *
     * @return {Dimensions}
     */
    public getSize(): Object;

    /**
     * Return the absolute bounding box for the given element
     *
     * The absolute bounding box may be used to display overlays in the
     * callers (browser) coordinate system rather than the zoomed in/out
     * canvas coordinates.
     *
     * @param  {ElementDescriptor} element
     * @return {Bounds} the absolute bounding box
     */
    public getAbsoluteBBox(element: Base): IBounds;

    /**
     * Fires an event in order other modules can react to the
     * canvas resizing
     */
    public resized(): void;

    // display the complete diagram without zooming in.
    // instead of relying on internal zoom, we perform a
    // hard reset on the canvas viewbox to realize this
    //
    // if diagram does not need to be zoomed in, we focus it around
    // the diagram origin instead
    public _fitViewport(): void;
  }

  export interface IViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    inner: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    outer: {
      width: number;
      height: number;
    };
  }

  export interface ICanvasConfig {
    // debounce canvas.viewbox.changed events
    // for smoother diagram interaction
    deferUpdate: boolean;

    container: HTMLElement;

    width: number | string;
    height: number | string;
  }

}
