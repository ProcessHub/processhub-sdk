declare module "diagram-js/lib/features/resize/ResizeHandles" {
  export = ResizeHandles;

  import EventBus = require("diagram-js/lib/core/EventBus");
  import Canvas = require("diagram-js/lib/core/Canvas");
  import Selection = require("diagram-js/lib/features/selection/Selection");
  import Resize = require("diagram-js/lib/features/resize/Resize");
  import { Shape } from "diagram-js/lib/model";

  class ResizeHandles {
    /**
     * This component is responsible for adding resize handles.
     *
     * @param {EventBus} eventBus
     * @param {Canvas} canvas
     * @param {Selection} selection
     * @param {Resize} resize
     */
    constructor(eventBus: EventBus, canvas: Canvas, selection: Selection, resize: Resize);

    public makeDraggable(element: {}, gfx: {}, direction: {}): void;
    public createResizer(element: {}, direction: {}): void;

    /**
     * Add resizers for a given element.
     *
     * @param {djs.model.Shape} shape
     */
    public addResizer(shape: Shape): void;

    /**
     * Remove all resizers
     */
    public removeResizers(): void;
  }
}
