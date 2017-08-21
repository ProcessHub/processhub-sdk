declare module "diagram-js/lib/features/modeling/Modeling" {
  export = Modeling;

  import EventBus = require("diagram-js/lib/core/EventBus");
  import CommandStack = require("diagram-js/lib/command/CommandStack");
  import CommandHandler = require("diagram-js/lib/command/CommandHandler");
  import ElementFactory = require("diagram-js/lib/core/ElementFactory");
  import { IBounds, IPoint } from "diagram-js";
  import { Base, Connection, Shape, Label } from "diagram-js/lib/model";

  class Modeling {
    /**
     * The basic modeling entry point.
     *
     * @param {EventBus} eventBus
     * @param {ElementFactory} elementFactory
     * @param {CommandStack} commandStack
     */
    constructor(eventBus: EventBus, elementFactory: ElementFactory, commandStack: CommandStack);

    public getHandlers(): { [command: string]: Function };

    /**
     * Register handlers with the command stack
     *
     * @param {CommandStack} commandStack
     */
    public registerHandlers(commandStack: CommandStack): void;

    public moveShape(shape: Base, delta: {}, newParent: {}, newParentIndex: {}, hints: {}): void;

    /**
     * Update the attachment of the given shape.
     *
     * @param  {djs.mode.Base} shape
     * @param  {djs.model.Base} [newHost]
     */
    public updateAttachment(shape: Base, newHost: Base): void;

    /**
     * Move a number of shapes to a new target, either setting it as
     * the new parent or attaching it.
     *
     * @param {Array<djs.mode.Base>} shapes
     * @param {Point} delta
     * @param {djs.model.Base} [target]
     * @param {Boolean} [isAttach=false]
     * @param {Object} [hints]
     */
    public moveElements(shapes: Base[], delta: IPoint, target: Base, isAttach: boolean, hints: Object): void;

    public moveConnection(connection: {}, delta: {}, newParent: {}, newParentIndex: {}, hints: {}): {};

    public layoutConnection(connection: {}, hints: {}): {};

    /**
     * Create connection.
     *
     * @param {djs.model.Base} source
     * @param {djs.model.Base} target
     * @param {Number} [targetIndex]
     * @param {Object|djs.model.Connection} attributs/connection
     * @param {djs.model.Base} parent
     * @param {Object} hints
     *
     * @return {djs.model.Connection} the created connection.
     */
    public createConnection(source: Base, target: Base, attrs: Object, parent: Base, hints: Modeling.IConnectionHints): Connection;
    public createConnection(
      source: Base,
      target: Base,
      targetIndex: number,
      connection: Connection,
      parent: Base,
      hints: Modeling.IConnectionHints): Connection;

    public createShape(shape: Base, position: {}, target: Base, targetIndex: number, isAttach: boolean, hints: Object): {};

    public createLabel(labelTarget: Base, position: IPoint, options: Modeling.ICreateLabelOptions, parent?: Base): Label;

    public appendShape(source: {}, shape: Base, position: {}, parent: {}, connection: {}, connectionParent: {}): {};

    public removeElements(elements: Base[]): void;

    public distributeElements(groups: {}, axis: {}, dimension: {}): {};

    public removeShape(shape: Shape, hints: Modeling.IRemoveShapeHints): void;

    public removeConnection(connection: Connection, hints: Object): void;

    public replaceShape(oldshape: Base, newshape: Base, hints: Object): {};

    public pasteElements(tree: {}, topParent: {}, position: {}): {};
    public alignElements(elements: {}, alignment: {}): {};

    public resizeShape(shape: Base, newBounds: IBounds, minBounds?: IBounds): void;

    public createSpace(movingShapes: {}, resizingShapes: {}, delta: {}, direction: {}): {};
    public updateWaypoints(connection: {}, newWaypoints: {}, hints: {}): {};
    public reconnectStart(connection: {}, newSource: {}, dockingOrPoints: {}): {};
    public reconnectEnd(connection: {}, newTarget: {}, dockingOrPoints: {}): {};

    public connect(source: Base, target: Base, attrs: Object, hints: Modeling.IConnectionHints): Connection;
    public _create(type: {}, attrs: {}): {};

    public toggleCollapse(shape: Base, hints: {}): {};
  }

  namespace Modeling {
    export interface IConnectionHints {
      connectionStart: IPoint;
      connectionEnd: IPoint;
    }

    export interface IRemoveShapeHints {
      nested: boolean;
    }

    export interface ICreateLabelOptions {
      id: string;
      hidden: boolean;
      businessObject?: Object;
      width: number;
      height: number;
    }
  }
}
