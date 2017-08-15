declare module "diagram-js/lib/features/interaction-events/InteractionEvents" {
  import EventBus = require("diagram-js/lib/core/EventBus");
  import ElementRegistry = require("diagram-js/lib/core/ElementRegistry");
  import Styles = require("diagram-js/lib/draw/Styles");
  import { Base } from "diagram-js/lib/model";

  export = InteractionEvents;

  class InteractionEvents {
    /**
     * A plugin that provides interaction events for diagram elements.
     *
     * It emits the following events:
     *
     *   * element.hover
     *   * element.out
     *   * element.click
     *   * element.dblclick
     *   * element.mousedown
     *
     * Each event is a tuple { element, gfx, originalEvent }.
     *
     * Canceling the event via Event#preventDefault() prevents the original DOM operation.
     *
     * @param {EventBus} eventBus
     */
    constructor(eventBus: EventBus, elementRegistry: ElementRegistry, styles: Styles);

    /**
     * Fire an interaction event.
     *
     * @param {String} type local event name, e.g. element.click.
     * @param {DOMEvent} event native event
     * @param {djs.model.Base} [element] the diagram element to emit the event on;
     *                                   defaults to the event target
     */
    public fire(type: string, event: Event, element: Base): void;

    /**
     * Trigger an interaction event (based on a native dom event)
     * on the target shape or connection.
     *
     * @param {String} eventName the name of the triggered DOM event
     * @param {MouseEvent} event
     * @param {djs.model.Base} targetElement
     */
    public triggerMouseEvent(eventName: string, event: MouseEvent, targetElement: Base): void;

    /**
     * An event indicating that the mouse hovered over an element
     *
     * @event element.hover
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has left an element
     *
     * @event element.out
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has clicked an element
     *
     * @event element.click
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has double clicked an element
     *
     * @event element.dblclick
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has gone down on an element.
     *
     * @event element.mousedown
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

    /**
     * An event indicating that the mouse has gone up on an element.
     *
     * @event element.mouseup
     *
     * @type {Object}
     * @property {djs.model.Base} element
     * @property {SVGElement} gfx
     * @property {Event} originalEvent
     */

  }
}
