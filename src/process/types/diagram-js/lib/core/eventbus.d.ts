// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
declare module "diagram-js/lib/core/EventBus" {
  export = EventBus;

  import { IBounds, IPoint } from "diagram-js";
  import { Base, Connection, Shape } from "diagram-js/lib/model";
  import SnapContext = require("diagram-js/lib/features/snapping/SnapContext");

  /**
   * A general purpose event bus.
   *
   * This component is used to communicate across a diagram instance.
   * Other parts of a diagram can use it to listen to and broadcast events.
   *
   *
   * ## Registering for Events
   *
   * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
   * methods to register for events. {@link EventBus#off} can be used to
   * remove event registrations. Listeners receive an instance of {@link Event}
   * as the first argument. It allows them to hook into the event execution.
   *
   * ```javascript
   *
   * // listen for event
   * eventBus.on('foo', function(event) {
   *
   *   // access event type
   *   event.type; // 'foo'
   *
   *   // stop propagation to other listeners
   *   event.stopPropagation();
   *
   *   // prevent event default
   *   event.preventDefault();
   * });
   *
   * // listen for event with custom payload
   * eventBus.on('bar', function(event, payload) {
   *   console.log(payload);
   * });
   *
   * // listen for event returning value
   * eventBus.on('foobar', function(event) {
   *
   *   // stop event propagation + prevent default
   *   return false;
   *
   *   // stop event propagation + return custom result
   *   return {
   *     complex: 'listening result'
   *   };
   * });
   *
   *
   * // listen with custom priority (default=1000, higher is better)
   * eventBus.on('priorityfoo', 1500, function(event) {
   *   console.log('invoked first!');
   * });
   *
   *
   * // listen for event and pass the context (`this`)
   * eventBus.on('foobar', function(event) {
   *   this.foo();
   * }, this);
   * ```
   *
   *
   * ## Emitting Events
   *
   * Events can be emitted via the event bus using {@link EventBus#fire}.
   *
   * ```javascript
   *
   * // false indicates that the default action
   * // was prevented by listeners
   * if (eventBus.fire('foo') === false) {
   *   console.log('default has been prevented!');
   * };
   *
   *
   * // custom args + return value listener
   * eventBus.on('sum', function(event, a, b) {
   *   return a + b;
   * });
   *
   * // you can pass custom arguments + retrieve result values.
   * var sum = eventBus.fire('sum', 1, 2);
   * console.log(sum); // 3
   * ```
   */
  class EventBus {
    constructor();

    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {String|Array<String>} events
     * @param {Number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    public on(events: EventBus.EventType, priority: number, callback: (Event: EventBus.EventBusEvent<Object>) => void, that: Object): void;
    public on(events: EventBus.EventType, callback: (event: EventBus.EventBusEvent<Object>) => void): void;

    public on(events: "bendpoint.move.ended", priority: number, callback: (Event: EventBus.BEndpointMoveEndedEvent) => void): void;
    public on(events: "bendpoint.move.ended", callback: (Event: EventBus.BEndpointMoveEndedEvent) => void): void;

    public on(events: "canvas.init", callback: (event: EventBus.EventBusEvent<Object>) => void): void;

    public on(events: "create.canceled", callback: (event: EventBus.CreateCanceledEvent) => void): void;
    
    public on(events: "create.ended", callback: (event: EventBus.CreateEndedEvent) => void): void;

    public on(events: "commandStack.changed", callback: () => void): void;

    public on(events: "connection.added", callback: (event: EventBus.ConnectionAddedEvent) => void): void;

    public on(events: "connectionSegment.move.ended", callback: (event: EventBus.ConnectionSegmentMoveEndedEvent) => void): void;

    public on(events: "drag.start", callback: (event: EventBus.EventBusEvent<Object>) => void): void;

    public on(events: "drag.ended", callback: (event: EventBus.DragEndedEvent) => void): void;

    public on(events: "element.click", callback: (event: EventBus.ElementClickEvent) => void): void;

    public on(events: "element.dblclick", callback: (event: EventBus.ElementDblClickEvent) => void): void;

    public on(events: "resize.end", callback: (event: EventBus.ResizeEndEvent) => void): void;
    public on(events: "resize.end", priority: number, callback: (event: EventBus.ResizeEndEvent) => void): void;
    public on(events: "resize.ended", callback: (event: EventBus.EventBusEvent<EventBus.IResizeEndedContext>) => void): void;

    public on(events: "shape.added", priority: number, callback: (Event: EventBus.ShapeAddedEvent) => void): void;
    public on(events: "shape.added", callback: (Event: EventBus.ShapeAddedEvent) => void): void;

    public on(events: "shape.move.end", priority: number, callback: (Event: EventBus.EventBusEvent<Object>) => void, that: Object): void;

    public on(events: "shape.move.ended", priority: number, callback: (Event: EventBus.EventBusEvent<EventBus.IShapeMoveEndContext>) => void): void;
    public on(events: "shape.move.ended", callback: (Event: EventBus.EventBusEvent<EventBus.IShapeMoveEndContext>) => void): void;

    public on(events: "shape.removed", callback: (Event: EventBus.ShapeRemovedEvent) => void): void;

    public on(events: "spaceTool.ended", priority: number, callback: () => void): void;
    public on(events: "spaceTool.ended", callback: () => void): void;
    public on(events: "spaceTool.ended", callback: (event: EventBus.SpaceToolEndedEvent) => void): void;

    /**
     * Register an event listener that is executed only once.
     *
     * @param {String} event the event name to register for
     * @param {Function} callback the callback to execute
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    public once(event: "element.click", priority: number, callback: (Event: EventBus.EventBusEvent<Object>) => void, that?: Object): void;

    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     *
     * @param {String} event
     * @param {Function} [callback]
     */
    public off(event: string, callback?: (Event: Event) => void): void;

    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
     *   alert(bar);
     * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param {String} [name] the optional event name
     * @param {Object} [event] the event object
     * @param {...Object} additional arguments to be passed to the callback functions
     *
     * @return {Boolean} the events return value, if specified or false if the
     *                   default action was prevented by listeners
     */
    public fire(type: EventBus.EventType, data: Object): boolean;
    public fire(type: "shape.move.end", data: EventBus.IShapeMoveEndData): boolean;
    /**
     * Clear the diagram, removing all contents.
     */
    public fire(type: "diagram.clear" | "diagram.init"): void;
    public fire(type: "render.shape", data: { gfx: SVGElement, element: Shape }): SVGElement;
    public fire(type: "render.connection", data: { gfx: SVGElement, element: Connection }): SVGElement;

    /*
     * Add new listener with a certain priority to the list
     * of listeners (for the given event).
     *
     * The semantics of listener registration / listener execution are
     * first register, first serve: New listeners will always be inserted
     * after existing listeners with the same priority.
     *
     * Example: Inserting two listeners with priority 1000 and 1300
     *
     *    * before: [ 1500, 1500, 1000, 1000 ]
     *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
     *
     * @param {String} event
     * @param {Object} listener { priority, callback }
     */
    public _addListener(event: string, newListener: Object): void;
  }

  namespace EventBus {

    export type ResizeEndedDirection = "se" | "sw" | "ne" | "nw";

    export interface IResizeEndedContext {
      canExecute: boolean;
      delta: IPoint;
      direction: ResizeEndedDirection;
      frame: SVGRectElement;
      newBounds: IBounds;
      resizeConstraints: Object;
      shape: Shape;
    }

    export interface IShapeMoveEndContext {
      delta: IPoint;
      canExecute: boolean | string;
      shape: Base;
      shapes: Base[];
    }

    export interface IShapeMoveEndData {
      context: IShapeMoveEndContext;
    }

    type EventType = "lasso.selection.ended";

    /**
     * A event that is emitted via the event bus.
     */
    export class EventBusEvent<ContextType> {
      public context: ContextType;

      public stopPropagation(): void;
      public preventDefault(): void;
      public init(data: Object): void;
    }

    export class ElementDblClickEvent extends ElementClickEvent {
    }

    export class ElementClickEvent extends EventBusEvent<void> {
      public element: Base;
      public gfx: SVGGElement;
      public originalEvent: MouseEvent;
    }

    export class ShapeAddedEvent extends EventBusEvent<void> {
      public element: Shape;
      public gfx: SVGGElement;
      public type: "shape.added";
    }

    export class ConnectionSegmentMoveEndedEvent extends EventBusEvent<Object> {
      public connection: Connection;
      public connectionGfx: SVGGElement;
      public hoverGfx: SVGGElement;
      public originalEvent: MouseEvent;
    }

    export class BEndpointMoveEndedEvent extends EventBusEvent<Object> {
      public connection: Connection;
      public connectionGfx: SVGGElement;
      public hoverGfx: SVGGElement;
      public originalEvent: MouseEvent;
    }

    export class ShapeRemovedEvent extends EventBusEvent<void> {
      public element: Shape;
    }

    export class CreateEndedEvent extends EventBusEvent<void> {
      public shape: Shape;
      public originalEvent: Event;
    }

    export interface ICreateCanceledContext {
      canExecute: boolean;
      shape: Shape;
      snapContext: SnapContext;
      source: {};
      target: Shape;
      visual: SVGGElement;
    }

    export class CreateCanceledEvent extends EventBusEvent<ICreateCanceledContext> {
      dx: number;
      dy: number;
      hover: Shape;
      hoverGfx: SVGGElement;
      originalEvent: MouseEvent;
      previousSelection: {}[];
      shape: Shape;
      x: number;
      y: number;
    }

    export interface ISpaceToolEndedContext {
      axis: "x" | "y";
      direction: "e" | "w" | "s" | "n";
      dragGroup: SVGGElement;
      frameGroup: SVGGElement;
      frames: {}[];
      initialized: boolean;
      line: SVGPathElement;
      movingConnections: Connection[];
      movingShapes: Shape[];
      resizingShapes: Shape[];
    }

    export class SpaceToolEndedEvent extends EventBusEvent<ISpaceToolEndedContext> {
      dx: number;
      dy: number;
      hover: Shape;
      hoverGfx: SVGGElement;
      originalEvent: MouseEvent;
      previousSelection: {}[];
      x: number;
      y: number;
    }

    export interface IDragEndedEventContext {
      allDraggedElements: Base[];
      canExecute: boolean;
      delta: IPoint;
      differentParents: boolean;
      dragGroup: SVGGElement;
      shape: Shape;
      shapes: Shape[];
      snapContext: SnapContext;
      target: Shape;
      validatedShapes: Shape[];
    }

    export class DragEndedEvent extends EventBusEvent<IDragEndedEventContext> {
      dx: number;
      dy: number;
      hover: Shape;
      hoverGfx: SVGGElement;
      originalEvent: MouseEvent;
      previousSelection: {}[];
      shape: Shape;
      x: number;
      y: number;
    }

    export class ConnectionAddedEvent extends EventBusEvent<void> {
      element: Connection;
      gfx: SVGGElement;
    }

    export interface IResizeEndContext {
      canExecute: true;
      delta: IPoint;
      direction: "se" | "sw" | "ne" | "nw";
      frame: SVGRectElement;
      newBounds: IBounds;
      resizeConstraints: {};
      shape: Shape;      
    }

    export class ResizeEndEvent  extends EventBusEvent<IResizeEndContext> {
      dx: number;
      dy: number;
      hover: Shape;
      hoverGfx: SVGGElement;
      originalEvent: MouseEvent;
      previousSelection: Shape;
      shape: Shape;
      x: number;
      y: number;
    }
  }
}
