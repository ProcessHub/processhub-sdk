declare module "diagram-js/lib/features/create/Create" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import { Base } from "diagram-js/lib/model";
  import Canvas from "diagram-js/lib/core/Canvas";

  export default class Create {
    constructor(eventBus: EventBus, dragging: {}, rules: {}, modeling: {}, canvas: Canvas, styles: {}, graphicsFactory: {});

    public start(event: Event, shape: Base, source?: Base): void;
  }
}
