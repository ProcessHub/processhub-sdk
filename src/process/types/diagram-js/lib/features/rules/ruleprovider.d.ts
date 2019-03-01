declare module "diagram-js/lib/features/rules/RuleProvider" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import { IBounds, IPoint } from "diagram-js";
  import { Base, Connection, Shape } from "diagram-js/lib/model";

  /**
   * A basic provider that may be extended to implement modeling rules.
   *
   * Extensions should implement the init method to actually add their custom
   * modeling checks. Checks may be added via the #addRule(action, fn) method.
   *
   * @param {EventBus} eventBus
   */
  export default class RuleProvider {

    /**
     * A basic provider that may be extended to implement modeling rules.
     *
     * Extensions should implement the init method to actually add their custom
     * modeling checks. Checks may be added via the #addRule(action, fn) method.
     *
     * @param {EventBus} eventBus
     */
    constructor(eventBus: EventBus);

    /**
     * Adds a modeling rule for the given action, implemented through
     * a callback function.
     *
     * The function will receive the modeling specific action context
     * to perform its check. It must return `false` to disallow the
     * action from happening or `true` to allow the action.
     *
     * A rule provider may pass over the evaluation to lower priority
     * rules by returning return nothing (or <code>undefined</code>).
     *
     * @example
     *
     * ResizableRules.prototype.init = function() {
     *
     *   \/**
     *    * Return `true`, `false` or nothing to denote
     *    * _allowed_, _not allowed_ and _continue evaluating_.
     *    *\/
     *   this.addRule('shape.resize', function(context) {
     *
     *     var shape = context.shape;
     *
     *     if (!context.newBounds) {
     *       // check general resizability
     *       if (!shape.resizable) {
     *         return false;
     *       }
     *
     *       // not returning anything (read: undefined)
     *       // will continue the evaluation of other rules
     *       // (with lower priority)
     *       return;
     *     } else {
     *       // element must have minimum size of 10*10 points
     *       return context.newBounds.width > 10 && context.newBounds.height > 10;
     *     }
     *   });
     * };
     *
     * @param {String|Array<String>} actions the identifier for the modeling action to check
     * @param {Number} [priority] the priority at which this rule is being applied
     * @param {Function} fn the callback function that performs the actual check
     */
    public addRule(actions: "connection.create", fn: (context: IConnectionCreateContext) => boolean): void;
    public addRule(actions: "connection.start", fn: (context: IConnectionStartContext) => boolean): void;
    public addRule(actions: "elements.move", fn: (context: IElementsMoveContext) => boolean): void;
    public addRule(actions: "shape.resize", fn: (context: IShapeResizeContext) => boolean): void;
    public addRule(actions: ModelingAction | ModelingAction[], fn: (context: Object) => boolean): void;
    public addRule(actions: ModelingAction | ModelingAction[], priority: number, fn: (context: Object) => boolean): void;
    public addRule(actions: "connection.reconnectEnd", fn: (context: IConnectionReconnectEndContext) => boolean): void;
    public addRule(actions: "connection.reconnectStart", fn: (context: IConnectionReconnectStartContext) => boolean): void;
    public addRule(actions: "shape.create", fn: (context: IShapeCreateContext) => boolean): void;
    public addRule(actions: "shape.append", fn: (context: IShapeAppendContext) => boolean): void;
    public addRule(actions: "elements.delete", fn: (context: IElementsDeleteContext) => boolean): void;

    /**
     * Implement this method to add new rules during provider initialization.
     */
    public init(): void;

  }

  export type ModelingAction = "elements.move";

  export interface IElementsMoveContext {
    delta: IPoint;
    position: IPoint;
    shapes: Shape[];
    target: Shape;
  }

  export interface IConnectionReconnectContext {
    allowed: boolean;
    bendpointIndex: number;
    connection: Connection;
    draggerGfx: SVGGElement;
    hover: Shape;
    insert: boolean;
    newWaypoints: IPoint[];
    originalWaypoints: IPoint[];
    snapPoints: Object;
  }

  export interface IConnectionReconnectStartContext extends IConnectionReconnectContext {
    type: "connection.reconnectStart";
  }

  export interface IConnectionReconnectEndContext extends IConnectionReconnectContext {
    type: "connection.reconnectEnd";
  }

  export interface IConnectionStartContext {
    source: Base;
  }

  export interface IConnectionCreateContext {
    source: Base;
    target: Base;
  }

  export interface IShapeResizeContext {
    shape: Shape;
    newBounds: IBounds;
  }

  export interface IShapeCreateContext {
    position: IPoint;
    shape: Shape;
    target: Shape;
  }

  export interface IElementsDeleteContext {
    elements: Base[];
  }

  export interface IShapeAppendContext {
    position: IPoint;
    shape: Shape;
    source: Shape;
    target: Shape;
  }

}
