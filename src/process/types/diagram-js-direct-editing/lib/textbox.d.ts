declare module "diagram-js-direct-editing/lib/TextBox" {
  export = TextBox;

  /**
   * Initializes a container for a content editable div.
   *
   * Structure:
   *
   * container
   *   parent
   *     content
   *     handle
   */
  class TextBox {
    /**
     * Initializes a container for a content editable div.
     *
     * Structure:
     *
     * container
     *   parent
     *     content
     *     handle
     *
     * @param {object} options
     * @param {DOMElement} options.container The DOM element to append the contentContainer to
     * @param {Function} options.keyHandler Handler for key events
     * @param {Function} options.resizeHandler Handler for resize events
     */
    constructor(options: {
      container: HTMLElement,
      keyHandler: Function,
      resizeHandler: Function
    });

    /**
     * Create a text box with the given position, size, style and text content
     *
     * @param {Object} bounds
     * @param {Number} bounds.x absolute x position
     * @param {Number} bounds.y absolute y position
     * @param {Number} [bounds.width] fixed width value
     * @param {Number} [bounds.height] fixed height value
     * @param {Number} [bounds.maxWidth] maximum width value
     * @param {Number} [bounds.maxHeight] maximum height value
     * @param {Number} [bounds.minWidth] minimum width value
     * @param {Number} [bounds.minHeight] minimum height value
     * @param {Object} [style]
     * @param {String} value text content
     *
     * @return {DOMElement} The created content DOM element
     */
    public create(bounds: {}, style: {}, value: string, options: {}): HTMLElement;

    /**
     * Automatically resize element vertically to fit its content.
     */
    public autoResize(): void;


    /**
     * Make an element resizable by adding a resize handle.
     */
    public resizable(): void;


    /**
     * Clear content and style of the textbox, unbind listeners and
     * reset CSS style.
     */
    public destroy(): void;

    public getValue(): string;


    /**
     * Set the cursor to the end of the text
     */
    public setCursor(): void;
  }
}