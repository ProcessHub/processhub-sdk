declare module "diagram-js-direct-editing/lib/DirectEditing" {
  export = DirectEditing;

  import Canvas = require("diagram-js/lib/core/Canvas");
  import EventBus = require("diagram-js/lib/core/EventBus");
  import { Base } from "diagram-js/lib/model";
  import { IBounds } from "diagram-js";

  /**
   * A direct editing component that allows users
   * to edit an elements text directly in the diagram
   */
  class DirectEditing {
    /**
     * A direct editing component that allows users
     * to edit an elements text directly in the diagram
     *
     * @param {EventBus} eventBus the event bus
     */
    constructor(eventBus: EventBus, canvas: Canvas);

    /**
     * Register a direct editing provider
     * @param {Object} provider the provider, must expose an #activate(element) method that returns
     *                          an activation context ({ bounds: {x, y, width, height }, text }) if
     *                          direct editing is available for the given element.
     *                          Additionally the provider must expose a #update(element, value) method
     *                          to receive direct editing updates.
     */
    public registerProvider(provider: DirectEditing.DirectEditingProvider): void;

    /**
     * Returns true if direct editing is currently active
     *
     * @return {Boolean}
     */
    public isActive(): boolean;

    /**
     * Cancel direct editing, if it is currently active
     */
    public cancel(): void;

    public close(): void;
    public complete(): void;

    public getValue(): {};

    /**
     * Activate direct editing on the given element
     *
     * @param {Object} ElementDescriptor the descriptor for a shape or connection
     * @return {Boolean} true if the activation was possible
     */
    public activate(element: Base): void;

  }

  namespace DirectEditing {
    export interface Context {
      bounds: {
        x: number,
        y: number,
        width: number,
        height: number,
      };
      text: string;
      options?: {
        centerVertically: boolean;
      };
    }

    export interface DirectEditingProvider {
      activate(element: Base): Context;
      update(element: Base, value: string, oldValue: string, bounds: IBounds): void;
    }
  }
}
