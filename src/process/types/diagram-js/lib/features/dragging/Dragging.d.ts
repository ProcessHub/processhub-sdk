declare module "diagram-js/lib/features/dragging/Dragging" {
  export = Dragging;

  import Canvas = require("diagram-js/lib/core/Canvas");
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { IPoint } from "diagram-js";
  /**
   * A helper that fires canvas localized drag events and realizes
   * the general "drag-and-drop" look and feel.
   *
   * Calling {@link Dragging#activate} activates dragging on a canvas.
   *
   * It provides the following:
   *
   *   * emits life cycle events, namespaced with a prefix assigned
   *     during dragging activation
   *   * sets and restores the cursor
   *   * sets and restores the selection
   *   * ensures there can be only one drag operation active at a time
   *
   * Dragging may be canceled manually by calling {@link Dragging#cancel}
   * or by pressing ESC.
   *
   *
   * ## Life-cycle events
   *
   * Dragging can be in three different states, off, initialized
   * and active.
   *
   * (1) off: no dragging operation is in progress
   * (2) initialized: a new drag operation got initialized but not yet
   *                  started (i.e. because of no initial move)
   * (3) started: dragging is in progress
   *
   * Eventually dragging will be off again after a drag operation has
   * been ended or canceled via user click or ESC key press.
   *
   * To indicate transitions between these states dragging emits generic
   * life-cycle events with the `drag.` prefix _and_ events namespaced
   * to a prefix choosen by a user during drag initialization.
   *
   * The following events are emitted (appropriately prefixed) via
   * the {@link EventBus}.
   *
   * * `init`
   * * `start`
   * * `move`
   * * `end`
   * * `ended` (dragging already in off state)
   * * `cancel` (only if previously started)
   * * `canceled` (dragging already in off state, only if previously started)
   * * `cleanup`
   *
   *
   * @example
   *
   * function MyDragComponent(eventBus, dragging) {
   *
   *   eventBus.on('mydrag.start', function(event) {
   *     console.log('yes, we start dragging');
   *   });
   *
   *   eventBus.on('mydrag.move', function(event) {
   *     console.log('canvas local coordinates', event.x, event.y, event.dx, event.dy);
   *
   *     // local drag data is passed with the event
   *     event.context.foo; // "BAR"
   *
   *     // the original mouse event, too
   *     event.originalEvent; // MouseEvent(...)
   *   });
   *
   *   eventBus.on('element.click', function(event) {
   *     dragging.init(event, 'mydrag', {
   *       cursor: 'grabbing',
   *       data: {
   *         context: {
   *           foo: "BAR"
   *         }
   *       }
   *     });
   *   });
   * }
   */
  class Dragging {
    constructor(eventBus: EventBus, canvas: Canvas, selection: Selection);
    /**
     * Initialize a drag operation.
     *
     * If `localPosition` is given, drag events will be emitted
     * relative to it.
     *
     * @param {MouseEvent|TouchEvent} [event]
     * @param {Point} [localPosition] actual diagram local position this drag operation should start at
     * @param {String} prefix
     * @param {Object} [options]
     */
    public init(event: MouseEvent | TouchEvent, relativeTo: IPoint, prefix: string, options: Object): void;

    public move(event: {}, activate: {}): void;
    public hover(event: {}): void;
    public out(event: {}): void;
    public end(event: {}): void;
    public cancel(restore: {}): void;
    public context(): Dragging.IContext;
    public setOptions(options: Object): void;
  }

  namespace Dragging {
    export interface IContext {
      prefix: string;
    }
  }
}