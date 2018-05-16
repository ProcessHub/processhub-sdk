declare module "diagram-js/lib/features/hand-tool/HandTool" {
  import EventBus from "diagram-js/lib/core/EventBus";
  import Canvas from "diagram-js/lib/core/Canvas";

  export default class HandTool {
    constructor(eventBus: EventBus, canvas: Canvas, dragging: {}, toolManager: {});
    public toggle(): void;
    public isActive(): boolean;
    public activateHand(event: Event): void;
  }

}
