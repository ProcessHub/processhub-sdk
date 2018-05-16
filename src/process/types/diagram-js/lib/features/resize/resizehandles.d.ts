declare module "diagram-js/lib/features/resize/ResizeHandles" {

  import EventBus from "diagram-js/lib/core/EventBus";
  import Canvas from "diagram-js/lib/core/Canvas";
  import Selection from "diagram-js/lib/features/selection/Selection";
  import Resize from "diagram-js/lib/features/resize/Resize";
  import { Shape } from "diagram-js/lib/model";

  export default class ResizeHandles {
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
