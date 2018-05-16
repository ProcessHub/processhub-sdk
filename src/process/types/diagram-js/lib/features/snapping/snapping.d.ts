declare module "diagram-js/lib/features/snapping/Snapping" {

  import Canvas from "diagram-js/lib/core/Canvas";
  import EventBus from "diagram-js/lib/core/EventBus";
  import { Base, Shape } from "diagram-js/lib/model";
  import SnapContext, { SnapPoints } from "diagram-js/lib/features/snapping/SnapContext";

  export default class Snapping {
    /**
     * A general purpose snapping component for diagram elements.
     *
     * @param {EventBus} eventBus
     * @param {Canvas} canvas
     */
    constructor(eventBus: EventBus, canvas: Canvas);

    public initSnap(event: Snapping.InitSnapEvent): void;
    public snap(event: {}): void;

    public showSnapLine(orientation: {}, position: {}): void;
    public getSnapLine(orientation: {}): {};
    public hide(): void;
    public addTargetSnaps(snapPoints: SnapPoints, shape: Shape, target: Base): void;
    public getSiblings(element: {}, target: {}): {};
  }

  namespace Snapping {

    export interface InitSnapEvent {
      context: {
        canExecute: boolean;
        shape: Shape;
        snapContext: SnapContext;
        target: Object;
        visual: SVGGElement;
      };
      dx: number;
      dy: number;
      originalEvent: MouseEvent;
      shape: Shape;
      x: number;
      y: number;
    }
  }
}
