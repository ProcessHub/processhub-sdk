declare module "diagram-js/lib/features/overlays/Overlays" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import Canvas from "diagram-js/lib/core/Canvas";
  import ElementRegistry from "diagram-js/lib/core/ElementRegistry";

  import { Base } from "diagram-js/lib/model";

  /**
   * A service that allows users to attach overlays to diagram elements.
   *
   * The overlay service will take care of overlay positioning during updates.
   *
   * @example
   *
   * // add a pink badge on the top left of the shape
   * overlays.add(someShape, {
   *   position: {
   *     top: -5,
   *     left: -5
   *   },
   *   html: '<div style="width: 10px; background: fuchsia; color: white;">0</div>'
   * });
   *
   * // or add via shape id
   *
   * overlays.add('some-element-id', {
   *   position: {
   *     top: -5,
   *     left: -5
   *   }
   *   html: '<div style="width: 10px; background: fuchsia; color: white;">0</div>'
   * });
   *
   * // or add with optional type
   *
   * overlays.add(someShape, 'badge', {
   *   position: {
   *     top: -5,
   *     left: -5
   *   }
   *   html: '<div style="width: 10px; background: fuchsia; color: white;">0</div>'
   * });
   *
   *
   * // remove an overlay
   *
   * var id = overlays.add(...);
   * overlays.remove(id);
   *
   * @param {EventBus} eventBus
   * @param {Canvas} canvas
   * @param {ElementRegistry} elementRegistry
   */
  export default class Overlays {
    constructor(eventBus: EventBus, canvas: Canvas, elementRegistry: ElementRegistry);

    /**
     * Returns the overlay with the specified id or a list of overlays
     * for an element with a given type.
     *
     * @example
     *
     * // return the single overlay with the given id
     * overlays.get('some-id');
     *
     * // return all overlays for the shape
     * overlays.get({ element: someShape });
     *
     * // return all overlays on shape with type 'badge'
     * overlays.get({ element: someShape, type: 'badge' });
     *
     * // shape can also be specified as id
     * overlays.get({ element: 'element-id', type: 'badge' });
     *
     *
     * @param {Object} search
     * @param {String} [search.id]
     * @param {String|djs.model.Base} [search.element]
     * @param {String} [search.type]
     *
     * @return {Object|Array<Object>} the overlay(s)
     */
    public get(search: { id: string, element: Base | string, type: string }): {}[];

    /**
     * Adds a HTML overlay to an element.
     *
     * @param {String|djs.model.Base}   element   attach overlay to this shape
     * @param {String}                  [type]    optional type to assign to the overlay
     * @param {Object}                  overlay   the overlay configuration
     *
     * @param {String|DOMElement}       overlay.html                 html element to use as an overlay
     * @param {Object}                  [overlay.show]               show configuration
     * @param {Number}                  [overlay.show.minZoom]       minimal zoom level to show the overlay
     * @param {Number}                  [overlay.show.maxZoom]       maximum zoom level to show the overlay
     * @param {Object}                  overlay.position             where to attach the overlay
     * @param {Number}                  [overlay.position.left]      relative to element bbox left attachment
     * @param {Number}                  [overlay.position.top]       relative to element bbox top attachment
     * @param {Number}                  [overlay.position.bottom]    relative to element bbox bottom attachment
     * @param {Number}                  [overlay.position.right]     relative to element bbox right attachment
     *
     * @return {String}                 id that may be used to reference the overlay for update or removal
     */
    public add(
      element: string | Base,
      type: string,
      overlay: {
        html: string | Element,
        show: {
          minZoom: number,
          maxZomm: number,
        },
        position: {
          left: number,
          top: number,
          bottom: number,
          right: number,
        },
      }): string;

    /**
     * Remove an overlay with the given id or all overlays matching the given filter.
     *
     * @see Overlays#get for filter options.
     *
     * @param {String} [id]
     * @param {Object} [filter]
     */
    public remove(filter: Object): void;

    public show(): void;

    public clear(): void;

    public _updateOverlayContainer(container: {}): void;

    public _updateOverlay(overlay: {}): void;

    public _createOverlayContainer(element: {}): {};

    public _updateRoot(viewbox: {}): {};

    public _addOverlay(overlay: {}): void;

    public _updateOverlayVisibilty(overlay: {}, viewbox: {}): {};

    public _updateOverlaysVisibilty(viewbox: {}): {};

    public _init(): void;
  }
}