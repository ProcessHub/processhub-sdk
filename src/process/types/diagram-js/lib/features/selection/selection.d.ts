declare module "diagram-js/lib/features/selection/Selection" {
  export = Selection;

  import EventBus = require("diagram-js/lib/core/EventBus");

  class Selection {
    /**
     * A service that offers the current selection in a diagram.
     * Offers the api to control the selection, too.
     *
     * @class
     *
     * @param {EventBus} eventBus the event bus
     */
    constructor(eventBus: EventBus);

    public deselect(element: Object): void;
    public get(): {}[];
    public isSelected(element: Object): boolean;

    /**
     * This method selects one or more elements on the diagram.
     *
     * By passing an additional add parameter you can decide whether or not the element(s)
     * should be added to the already existing selection or not.
     *
     * @method Selection#select
     *
     * @param  {Object|Object[]} elements element or array of elements to be selected
     * @param  {boolean} [add] whether the element(s) should be appended to the current selection, defaults to false
     */
    public select(elements: Object[], add?: boolean): void;

  }
}