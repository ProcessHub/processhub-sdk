declare module "diagram-js/lib/features/space-tool/SpaceTool" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Dragging = require("diagram-js/lib/features/dragging/Dragging");
  import Modeling = require("diagram-js/lib/features/modeling/Modeling");
  import Rules = require("diagram-js/lib/features/rules/Rules");
  import { IPoint } from "diagram-js";
  import { Base, Shape } from "diagram-js/lib/model";

  export = SpaceTool;

  class SpaceTool {
    constructor(eventBus: EventBus, dragging: Dragging, modeling: Modeling, rules: Rules, toolManager: {});

    /**
     * Activate space tool selection
     *
     * @param  {MouseEvent} event
     * @param  {Boolean} autoActivate
     */
    public activateSelection(event: Event, autoActivate?: boolean): void;

    /**
     * Activate make space
     *
     * @param  {MouseEvent} event
     */
    public activateMakeSpace(event: MouseEvent): void;

    /**
     * Actually make space on the diagram
     *
     * @param  {Array<Shape>} movingShapes
     * @param  {Array<Shape>} resizingShapes
     * @param  {Point} delta
     * @param  {String} direction
     */
    public makeSpace(movingShapes: Shape[], resizingShapes: Shape[], delta: IPoint, direction: string): void;

    /**
     * Initialize make space and return true if that was successful.
     *
     * @param {Event} event
     * @param {Object} context
     *
     * @return {Boolean} true, if successful
     */
    public initializeMakeSpace(event: Event, context: Object): boolean;

    /**
     * Calculate adjustments needed when making space
     *
     * @param  {Array<Shape>} elements
     * @param  {String} axis
     * @param  {Number} offset
     * @param  {Number} spacePos
     *
     * @return {Object}
     */
    public calculateAdjustments(elements: Shape[], axis: "y" | "x", offset: number, spacePos: number): Object;
  }
}