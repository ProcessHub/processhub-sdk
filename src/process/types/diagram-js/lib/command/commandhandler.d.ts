declare module "diagram-js/lib/command/CommandHandler" {
  import { Base } from "diagram-js/lib/model";

  export = CommandHandler;

  /**
   * A command handler that may be registered with the
   * {@link CommandStack} via {@link CommandStack#registerHandler}.
   */
  class CommandHandler {

    /**
     * Execute changes described in the passed action context.
     *
     * @param {Object} context the execution context
     *
     * @return {Array<djs.model.Base>} list of touched (áka dirty) diagram elements
     */
    public execute(context: {}): Base[];


    /**
     * Revert changes described in the passed action context.
     *
     * @param {Object} context the execution context
     *
     * @return {Array<djs.model.Base>} list of touched (áka dirty) diagram elements
     */
    public revert(context: {}): Base[];


    /**
     * Return true if the handler may execute in the given context.
     *
     * @abstract
     *
     * @param {Object} context the execution context
     *
     * @return {Boolean} true if executing in the context is possible
     */
    public canExecute(context: {}): boolean;


    /**
     * Execute actions after the actual command execution but
     * grouped together (for undo/redo) with the action.
     *
     * @param {Object} context the execution context
     */
    public preExecute(context: {}): void;

    /**
     * Execute actions after the actual command execution but
     * grouped together (for undo/redo) with the action.
     *
     * @param {Object} context the execution context
     */
    public postExecute(context: {}): void;
  }
}
