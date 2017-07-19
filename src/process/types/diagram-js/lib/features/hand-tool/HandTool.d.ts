declare module "diagram-js/lib/features/hand-tool/HandTool" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Canvas = require("diagram-js/lib/core/Canvas");

  export = HandTool;

  class HandTool {
    constructor(eventBus: EventBus, canvas: Canvas, dragging: {}, toolManager: {});
    public toggle(): void;
    public isActive(): boolean;
    public activateHand(event: Event): void;
  }

}
