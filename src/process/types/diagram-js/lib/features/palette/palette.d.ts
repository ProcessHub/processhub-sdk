declare module "diagram-js/lib/features/palette/Palette" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import Canvas = require("diagram-js/lib/core/Canvas");

  export = Palette;

  /**
   * A palette containing modeling elements.
   */
  class Palette {
    public static HTML_MARKUP: string;

    public _entries: { [name: string]: Palette.IPaletteEntryDescriptor };
    public _canvas: Canvas;
    public _container: HTMLElement;
    public _toolsContainer: HTMLElement;

    constructor(eventBus: EventBus, canvas: Canvas, dragging: {});

    /**
     * Register a provider with the palette
     *
     * @param  {PaletteProvider} provider
     */
    public registerProvider(provider: Palette.IPaletteProvider): void;

    /**
     * Returns the palette entries for a given element
     *
     * @return {[name: string] : Palette.PaletteEntryDescriptor}list of entries
     */
    public getEntries(): { [name: string]: Palette.IPaletteEntryDescriptor };

    /**
     * Initialize
     */
    public _init(): void;

    public _update(): void;

    /**
     * Trigger an action available on the palette
     *
     * @param  {String} action
     * @param  {Event} event
     */
    public trigger(action: string, event: Event, autoActivate: boolean): void;

    /**
     * Close the palette
     */
    public close(): void;

    /**
     * Open the palette
     */
    public open(): void;

    public toggle(): void;

    public isActiveTool(tool: {}): boolean;

    public updateToolHighlight(name: string): void;

    /**
     * Return true if the palette is opened.
     *
     * @example
     *
     * palette.open();
     *
     * if (palette.isOpen()) {
     *   // yes, we are open
     * }
     *
     * @return {boolean} true if palette is opened
     */
    public isOpen(): boolean;
  }

  namespace Palette {
    export interface IPaletteEntryAction {
      click: (event: Event) => void;
      dragstart?: (event: Event) => void;
    }

    export interface IPaletteEntryDescriptor {
      imageUrl?: string;
      action?: IPaletteEntryAction;
      group?: "tools" | "bpmn";
      className?: string;
      title?: string;
      separator?: true;
      html?: string;
    }

    export interface IPaletteProvider {
      getPaletteEntries(): { [name: string]: IPaletteEntryDescriptor };
    }
  }
}
