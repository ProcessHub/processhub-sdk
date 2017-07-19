declare module "diagram-js/lib/features/context-pad/ContextPad" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Overlays = require("diagram-js/lib/features/overlays/Overlays");

  import { Base } from "diagram-js/lib/model";

  export = ContextPad;

  class ContextPad {
    /**
     * A context pad that displays element specific, contextual actions next
     * to a diagram element.
     *
     * @param {EventBus} eventBus
     * @param {Overlays} overlays
     */
    constructor(eventBus: EventBus, overlays: Overlays);

    /**
     * Registers events needed for interaction with other components
     */
    public _init(): void;

    /**
     * Register a provider with the context pad
     *
     * @param  {ContextPadProvider} provider
     */
    public registerProvider(provider: ContextPad.ContextPadProvider): void;

    /**
     * Returns the context pad entries for a given element
     *
     * @param {djs.element.Base} element
     *
     * @return {Array<ContextPadEntryDescriptor>} list of entries
     */
    public getEntries(element: Base): ContextPad.ContextPadEntryDescriptor[];

    /**
     * Trigger an action available on the opened context pad
     *
     * @param  {String} action
     * @param  {Event} event
     * @param  {Boolean} [autoActivate=false]
     */
    public trigger(action: string, event: Event, autoActivate?: boolean): {};

    /**
     * Open the context pad for the given element
     *
     * @param {djs.model.Base} element
     * @param {Boolean} force if true, force reopening the context pad
     */
    public open(element: Base, force: boolean): void;

    public _updateAndOpen(element: Base): void;

    public getPad(element: Base): {};

    /**
     * Close the context pad
     */
    public close(): void;

    /**
     * Check if pad is open. If element is given, will check
     * if pad is opened with given element.
     *
     * @param {Element} element
     * @return {Boolean}
     */
    public isOpen(element?: {}): boolean;
  }

  namespace ContextPad {
    export interface ContextPadProvider {
      getContextPadEntries(element: Base): ContextPadEntryDescriptor[];
    }

    export interface ContextPadEntryDescriptor {
      group?: string;
      html?: string;
      className?: string;
      title: string;
      imageUrl?: string;
      action:
      {
        click: (originalEvent: MouseEvent, element: Base, autoActivate: boolean) => void,
        dragStart?: (originalEvent: MouseEvent, element: Base, autoActivate: boolean) => void,
      };
    }
  }
}
