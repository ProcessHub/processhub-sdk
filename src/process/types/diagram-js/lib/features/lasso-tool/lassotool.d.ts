declare module "diagram-js/lib/features/lasso-tool/LassoTool" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Canvas = require("diagram-js/lib/core/Canvas");

  export = LassoTool;

  class LassoTool {
    constructor(eventBus: EventBus, canvas: Canvas, dragging: {}, elementRegistry: {}, selection: {}, toolManager: {});

    public activateLasso(event: Event): void;
    public activateSelection(event: Event): void;
    public select(elemnts: {}, bbox: {}): void;
    public toggle(): void;
    public isActive(): boolean;
  }

}
