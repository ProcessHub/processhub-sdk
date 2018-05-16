declare module "diagram-js/lib/command/CommandStack" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import { IBounds } from "diagram-js";
  import { Shape } from "diagram-js/lib/model";

  /**
   * A service that offers un- and redoable execution of commands.
   *
   * The command stack is responsible for executing modeling actions
   * in a un- and redoable manner. To do this it delegates the actual
   * command execution to {@link CommandHandler}s.
   *
   * Command handlers provide {@link CommandHandler#execute(ctx)} and
   * {@link CommandHandler#revert(ctx)} methods to un- and redo a command
   * identified by a command context.
   *
   *
   * ## Life-Cycle events
   *
   * In the process the command stack fires a number of life-cycle events
   * that other components to participate in the command execution.
   *
   *    * preExecute
   *    * preExecuted
   *    * execute
   *    * executed
   *    * postExecute
   *    * postExecuted
   *    * revert
   *    * reverted
   *
   * A special event is used for validating, whether a command can be
   * performed prior to its execution.
   *
   *    * canExecute
   *
   * Each of the events is fired as `commandStack.{eventName}` and
   * `commandStack.{commandName}.{eventName}`, respectively. This gives
   * components fine grained control on where to hook into.
   *
   * The event object fired transports `command`, the name of the
   * command and `context`, the command context.
   *
   *
   * ## Creating Command Handlers
   *
   * Command handlers should provide the {@link CommandHandler#execute(ctx)}
   * and {@link CommandHandler#revert(ctx)} methods to implement
   * redoing and undoing of a command.
   *
   * A command handler _must_ ensure undo is performed properly in order
   * not to break the undo chain. It must also return the shapes that
   * got changed during the `execute` and `revert` operations.
   *
   * Command handlers may execute other modeling operations (and thus
   * commands) in their `preExecute` and `postExecute` phases. The command
   * stack will properly group all commands together into a logical unit
   * that may be re- and undone atomically.
   *
   * Command handlers must not execute other commands from within their
   * core implementation (`execute`, `revert`).
   *
   *
   * ## Change Tracking
   *
   * During the execution of the CommandStack it will keep track of all
   * elements that have been touched during the command's execution.
   *
   * At the end of the CommandStack execution it will notify interested
   * components via an 'elements.changed' event with all the dirty
   * elements.
   *
   * The event can be picked up by components that are interested in the fact
   * that elements have been changed. One use case for this is updating
   * their graphical representation after moving / resizing or deletion.
   *
   * @see CommandHandler
   */
  export default class CommandStack {

    /**
     * A map of all registered command handlers.
     *
     * @type {Object}
     */
    public _handlerMap: Object;

    /**
     * A stack containing all re/undoable actions on the diagram
     *
     * @type {Array<Object>}
     */
    public _stack: Object[];

    /**
     * The current index on the stack
     *
     * @type {Number}
     */
    public _stackIdx: number;

    /**
     * Current active commandStack execution
     *
     * @type {Object}
     */
    public _currentExecution: Object;

    public _eventBus: EventBus;

    /**
     * @param {EventBus} eventBus
     * @param {Injector} injector
     */
    constructor(eventBus: EventBus, injector: {});

    /**
     * Execute a command
     *
     * @param {String} command the command to execute
     * @param {Object} context the environment to execute the command in
     */
    public execute(command: string, context: Object): void;
    public execute(command: "shape.resize", context: CommandStack.IShapeResizeContext): void;

    /**
     * Ask whether a given command can be executed.
     *
     * Implementors may hook into the mechanism on two ways:
     *
     *   * in event listeners:
     *
     *     Users may prevent the execution via an event listener.
     *     It must prevent the default action for `commandStack.(<command>.)canExecute` events.
     *
     *   * in command handlers:
     *
     *     If the method {@link CommandHandler#canExecute} is implemented in a handler
     *     it will be called to figure out whether the execution is allowed.
     *
     * @param  {String} command the command to execute
     * @param  {Object} context the environment to execute the command in
     *
     * @return {Boolean} true if the command can be executed
     */
    public canExecute(command: string, context: Object): boolean;

    /**
     * Clear the command stack, erasing all undo / redo history
     */
    public clear(): void;

    /**
     * Undo last command(s)
     */
    public undo(): void;

    /**
     * Redo last command(s)
     */
    public redo(): void;

    /**
     * Register a handler instance with the command stack
     *
     * @param {String} command
     * @param {CommandHandler} handler
     */
    public register(command: string, handler: {}): void;

    /**
     * Register a handler type with the command stack
     * by instantiating it and injecting its dependencies.
     *
     * @param {String} command
     * @param {Function} a constructor for a {@link CommandHandler}
     */
    public registerHandler(command: string, handlerCls: Function): void;

    public canUndo(): boolean;

    public canRedo(): boolean;

    public _getRedoAction(): Object;

    public _getUndoAction(): Object;
  }

  namespace CommandStack {
    export interface IShapeResizeContext {
      shape: Shape;
      newBounds: IBounds;
      minBounds?: IBounds;
    }
  }
}
