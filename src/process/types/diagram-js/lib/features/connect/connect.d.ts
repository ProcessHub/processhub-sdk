
declare module "diagram-js/lib/features/connect/Connect" {
  import { Base } from "diagram-js/lib/model";
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Dragging = require("diagram-js/lib/features/dragging/Dragging");
  import Modeling = require("diagram-js/lib/features/modeling/Modeling");
  import Rules = require("diagram-js/lib/features/rules/Rules");
  import Canvas = require("diagram-js/lib/core/Canvas");
  import GraphicsFactory = require("diagram-js/lib/core/GraphicsFactory");

  export = Connect;

  class Connect {
    constructor(eventBus: EventBus, dragging: Dragging, modeling: Modeling, rules: Rules, canvas: Canvas, graphicsFactory: GraphicsFactory);

    /**
     * Start connect operation.
     *
     * @param {DOMEvent} event
     * @param {djs.model.Base} source
     * @param {Point} [sourcePosition]
     * @param {Boolean} [autoActivate=false]
     */
    public start(event: MouseEvent, source: Base): void;
  }
}

