declare module "diagram-js/lib/features/keyboard/Keyboard" {
  export = Keyboard;

  import EventBus = require("diagram-js/lib/core/EventBus");

  /**
   * A keyboard abstraction that may be activated and
   * deactivated by users at will, consuming key events
   * and triggering diagram actions.
   *
   * The implementation fires the following key events that allow
   * other components to hook into key handling:
   *
   *  - keyboard.bind
   *  - keyboard.unbind
   *  - keyboard.init
   *  - keyboard.destroy
   *
   * All events contain the fields (node, listeners).
   *
   * A default binding for the keyboard may be specified via the
   * `keyboard.bindTo` configuration option.   
   */
  class Keyboard {
    /**
     * A keyboard abstraction that may be activated and
     * deactivated by users at will, consuming key events
     * and triggering diagram actions.
     *
     * The implementation fires the following key events that allow
     * other components to hook into key handling:
     *
     *  - keyboard.bind
     *  - keyboard.unbind
     *  - keyboard.init
     *  - keyboard.destroy
     *
     * All events contain the fields (node, listeners).
     *
     * A default binding for the keyboard may be specified via the
     * `keyboard.bindTo` configuration option.
     *
     * @param {Config} config
     * @param {EventBus} eventBus
     * @param {EditorActions} editorActions
     */
    constructor(config: Keyboard.IConfig, eventBus: EventBus, editorActions: {});

    /**
     * Add a listener function that is notified with (key, modifiers) whenever
     * the keyboard is bound and the user presses a key.
     *
     * @param {Function} listenerFn
     */
    public addListener(listenerFn: Function): void;

    public hasModifier(modifiers: Object): boolean;
    public isCmd(modifiers: Object): boolean;
    public isShift(modifiers: Object): boolean;
  }

  namespace Keyboard {
    export interface IConfig {
      bindTo?: Element;
      invertY?: boolean;
      speed?: number;
    }
  }
}