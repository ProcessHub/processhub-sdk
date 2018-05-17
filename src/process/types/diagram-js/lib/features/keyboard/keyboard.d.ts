declare module "diagram-js/lib/features/keyboard/Keyboard" {

  import EventBus from "diagram-js/lib/core/EventBus";

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
  export default class Keyboard {
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
    constructor(config: IKeyboardConfig, eventBus: EventBus, editorActions: {});

    public bind(node: Element): void;
    public getBinding(): Element;
    public unbind(): void;

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

  export interface IKeyboardConfig {
    bindTo?: Element;
    invertY?: boolean;
    speed?: number;
  }

}