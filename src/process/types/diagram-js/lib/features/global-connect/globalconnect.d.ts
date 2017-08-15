declare module "diagram-js/lib/features/global-connect/GlobalConnect" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { Base } from "diagram-js/lib/model";
  import Canvas = require("diagram-js/lib/core/Canvas");
  import Dragging = require("diagram-js/lib/features/dragging/Dragging");

  export = GlobalConnect;

  class GlobalConnect {
    public _dragging: Dragging;

    constructor(eventBus: EventBus, dragging: {}, connect: {}, canvas: Canvas, toolManager: {});

    public registerProvider(provider: GlobalConnect.IGlobalConnectProvider): void;
    public isActive(): boolean;
    public toggle(): void;

    /**
     * Initiates tool activity.
     */
    public start(): void;

    /**
     * Check if source shape can initiate connection.
     *
     * @param  {Base} startTarget
     * @return {Boolean}
     */
    public canStartConnect(startTarget: Base): boolean;
  }

  namespace GlobalConnect {
    export interface IGlobalConnectProvider {
      /**
       * Check if source shape can initiate connection.
       *
       * @param  {Base} startTarget
       * @return {Boolean}
       */
      canStartConnect(startTarget: Base): boolean;
    }
  }
}
