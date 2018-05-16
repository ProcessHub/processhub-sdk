declare module "diagram-js/lib/features/resize/Resize" {

  import EventBus from "diagram-js/lib/core/EventBus";
  import Rules from "diagram-js/lib/features/rules/Rules";
  import Modeling from "diagram-js/lib/features/modeling/Modeling";
  import Dragging from "diagram-js/lib/features/dragging/Dragging";
  import { Shape } from "diagram-js/lib/model";

  /**
   * A component that provides resizing of shapes on the canvas.
   *
   * The following components are part of shape resize:
   *
   *  * adding resize handles,
   *  * creating a visual during resize
   *  * checking resize rules
   *  * committing a change once finished
   *
   *
   * ## Customizing
   *
   * It's possible to customize the resizing behaviour by intercepting 'resize.start'
   * and providing the following parameters through the 'context':
   *
   *   * minDimensions ({ width, height }): minimum shape dimensions
   *
   *   * childrenBoxPadding ({ left, top, bottom, right } || number):
   *     gap between the minimum bounding box and the container
   *
   * f.ex:
   *
   * ```javascript
   * eventBus.on('resize.start', 1500, function(event) {
   *   var context = event.context,
   *
   *  context.minDimensions = { width: 140, height: 120 };
   *
   *  // Passing general padding
   *  context.childrenBoxPadding = 30;
   *
   *  // Passing padding to a specific side
   *  context.childrenBoxPadding.left = 20;
   * });
   * ```
   */
  export default class Resize {

    constructor(eventBus: EventBus, rules: Rules, modeling: Modeling, dragging: Dragging);

    public canResize(context: Object): boolean;

    /**
     * Activate a resize operation
     *
     * You may specify additional contextual information and must specify a
     * resize direction during activation of the resize event.
     *
     * @param {MouseEvent} event
     * @param {djs.model.Shape} shape
     * @param {Object|String} contextOrDirection
     */
    public activate(event: MouseEvent, shape: Shape, contextOrDirection: string | Object): void;

    public computeMinResizeBox(context: Object): void;

  }
}