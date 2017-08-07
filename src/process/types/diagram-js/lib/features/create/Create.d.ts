declare module "diagram-js/lib/features/create/Create" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { Base } from "diagram-js/lib/model";
  import Canvas = require("diagram-js/lib/core/Canvas");

  export = Create;

  class Create {
    constructor(eventBus: EventBus, dragging: {}, rules: {}, modeling: {}, canvas: Canvas, styles: {}, graphicsFactory: {});

    public start(event: Event, shape: Base, source?: Base): void;
  }
}
