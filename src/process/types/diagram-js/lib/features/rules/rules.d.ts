declare module "diagram-js/lib/features/rules/Rules" {
  import Injector = require("didi/lib/injector");

  /**
   * A service that provides rules for certain diagram actions.
   *
   * The default implementation will hook into the {@link CommandStack}
   * to perform the actual rule evaluation. Make sure to provide the
   * `commandStack` service with this module if you plan to use it.
   *
   * Together with this implementation you may use the {@link RuleProvider}
   * to implement your own rule checkers.
   *
   * This module is ment to be easily replaced, thus the tiny foot print.
   *
   * @param {Injector} injector
   */
  export default class Rules {
    constructor(injector: Injector);

    /**
     * Returns whether or not a given modeling action can be executed
     * in the specified context.
     *
     * This implementation will respond with allow unless anyone
     * objects.
     *
     * @param {String} action the action to be checked
     * @param {Object} [context] the context to check the action in
     *
     * @return {Boolean} returns true, false or null depending on whether the
     *                   operation is allowed, not allowed or should be ignored.
     */
    public allowed(action: string, context: Object): boolean;
  }
}