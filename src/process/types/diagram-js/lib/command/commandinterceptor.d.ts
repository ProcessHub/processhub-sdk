declare module "diagram-js/lib/command/CommandInterceptor" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { IBounds } from "diagram-js";
  import { Shape } from "diagram-js/lib/model";

  export = CommandInterceptor;

  /**
   * A utility that can be used to plug-in into the command execution for
   * extension and/or validation.
   *
   * @param {EventBus} eventBus
   *
   * @example
   *
   * var inherits = require('inherits');
   *
   * var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
   *
   * function CommandLogger(eventBus) {
   *   CommandInterceptor.call(this, eventBus);
   *
   *   this.preExecute(function(event) {
   *     console.log('command pre-execute', event);
   *   });
   * }
   *
   * inherits(CommandLogger, CommandInterceptor);
   *
   */
  class CommandInterceptor {
    /**
     * A utility that can be used to plug-in into the command execution for
     * extension and/or validation.
     *
     * @param {EventBus} eventBus
     *
     * @example
     *
     * var inherits = require('inherits');
     *
     * var CommandInterceptor = require('diagram-js/lib/command/CommandInterceptor');
     *
     * function CommandLogger(eventBus) {
     *   CommandInterceptor.call(this, eventBus);
     *
     *   this.preExecute(function(event) {
     *     console.log('command pre-execute', event);
     *   });
     * }
     *
     * inherits(CommandLogger, CommandInterceptor);
     *
     */
    constructor(eventBus: EventBus);

    /**
     * Register an interceptor for a command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {String} [hook] command hook, i.e. preExecute, executed to listen on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} unwrap if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public on(
      events: string | string[],
      hook: "canExecute" | "preExecute" | "preExecuted" | "execute" | "executed" | "postExecute" | "postExecuted" | "revert" | "reverted",
      priority: number,
      handlerFn: Function,
      unwrap: boolean,
      that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public canExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public preExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public preExecuted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public execute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public executed(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public postExecute(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;
    public postExecute(events: "shape.resize", callback: (event: CommandInterceptor.ShapeResizeEvent) => void): void;
    public postExecute(events: "shape.delete", callback: (event: CommandInterceptor.ShapeDeleteEvent) => void): void;
    public postExecute(events: "shape.resize", callback: (event: CommandInterceptor.ShapeResizeEvent) => void, unwrap: boolean): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public postExecuted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;
    public postExecuted(events: "shape.resize", callback: (event: CommandInterceptor.ShapeResizeEvent) => void): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public revert(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

    /**
     * A named hook for plugging into the command execution
     *
     * @param {String|Array<String>} [events] list of commands to register on
     * @param {Number} [priority] the priority on which to hook into the execution
     * @param {Function} handlerFn interceptor to be invoked with (event)
     * @param {Boolean} [unwrap=false] if true, unwrap the event and pass (context, command, event) to the
     *                          listener instead
     * @param {Object} [that] Pass context (`this`) to the handler function
     */
    public reverted(events: string | string[], priority: number, handlerFn: Function, unwrap: boolean, that: Object): void;

  }

  namespace CommandInterceptor {
    export interface ShapeResizeEvent {
      minBounds: IBounds;
      newBounds: IBounds;
      oldBounds: IBounds;
      shape: Shape;
    }

    export interface ShapeDeleteEvent {
      context: {
        hints: {},
        oldParent: Shape,
        oldParentIndex: number,
        shape: Shape,
      }
    }
  }
}
