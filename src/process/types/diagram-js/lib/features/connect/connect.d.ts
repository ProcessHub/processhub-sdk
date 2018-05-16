
declare module "diagram-js/lib/features/connect/Connect" {
  import { Base } from "diagram-js/lib/model";
  import EventBus from "diagram-js/lib/core/EventBus";
  import Dragging from "diagram-js/lib/features/dragging/Dragging";
  import Modeling from "diagram-js/lib/features/modeling/Modeling";
  import Rules from "diagram-js/lib/features/rules/Rules";
  import Canvas from "diagram-js/lib/core/Canvas";
  import GraphicsFactory from "diagram-js/lib/core/GraphicsFactory";

  export default class Connect {
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

