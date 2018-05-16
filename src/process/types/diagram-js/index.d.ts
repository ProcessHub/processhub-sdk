declare module "diagram-js" {

  import Keyboard, { IKeyboardConfig } from "diagram-js/lib/features/keyboard/Keyboard";
  import Canvas, { ICanvasConfig } from "diagram-js/lib/core/Canvas";
  import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
  import EventBus from "diagram-js/lib/core/EventBus";
  import ElementFactory from "diagram-js/lib/core/ElementFactory";
  import Injector = require("didi/lib/injector");

  /**
   * The main diagram-js entry point that bootstraps the diagram with the given
   * configuration.
   */
  export default class Diagram {

    public injector: Injector;

    /**
     * The main diagram-js entry point that bootstraps the diagram with the given
     * configuration.
     *
     * To register extensions with the diagram, pass them as Array<Diagram.IPlugin> to the constructor.
     *
     * @class djs.Diagram
     * @memberOf djs
     * @constructor
     *
     * @example
     *
     * <caption>Creating a plug-in that logs whenever a shape is added to the canvas.</caption>
     *
     * // plug-in implemenentation
     * function MyLoggingPlugin(eventBus) {
     *   eventBus.on('shape.added', function(event) {
     *     console.log('shape ', event.shape, ' was added to the diagram');
     *   });
     * }
     *
     * // export as module
     * module.exports = {
     *   __init__: [ 'myLoggingPlugin' ],
     *     myLoggingPlugin: [ 'type', MyLoggingPlugin ]
     * };
     *
     *
     * // instantiate the diagram with the new plug-in
     *
     * var diagram = new Diagram({ modules: [ require('path-to-my-logging-plugin') ] });
     *
     * diagram.invoke([ 'canvas', function(canvas) {
     *   // add shape to drawing canvas
     *   canvas.addShape({ x: 10, y: 10 });
     * });
     *
     * // 'shape ... was added to the diagram' logged to console
     *
     * @param {Object} options
     * @param {Array<Diagram.IPlugin>} [options.modules] external modules to instantiate with the diagram
     * @param {didi.Injector} [injector] an (optional) injector to bootstrap the diagram with
     */
    constructor(options: IDiagramOptions);

    /**
     * Resolves a diagram service
     *
     * @method Diagram#get
     *
     * @param {String} name the name of the diagram service to be retrieved
     * @param {Boolean} [strict=true] if false, resolve missing services to null
     */
    public get(name: "elementFactory", strict?: boolean): ElementFactory;
    public get(name: "eventBus", strict?: boolean): EventBus;
    public get(name: "renderer", strict?: boolean): BaseRenderer;
    public get(name: "canvas", strict?: boolean): Canvas;
    public get(name: string, strict?: boolean): {};

    /**
     * Executes a function into which diagram services are injected
     *
     * @method Diagram#invoke
     *
     * @param {Function|Object[]} fn the function to resolve
     * @param {Object} locals a number of locals to use to resolve certain dependencies
     */
    public invoke(fn: InvokeFunction, locals: Object): void;

    /**
     * Destroys the diagram
     *
     * @method  Diagram#destroy
     */
    public destroy(): void;

    /**
     * Clear the diagram, removing all contents.
     */
    public clear(): void;
  }

  export interface IConfig {
    keyboard: IKeyboardConfig;
    canvas: ICanvasConfig;
  }

  export type IType = ("type" | Function)[];
  export type IFactory = ("factory" | Function)[];
  export type IValue = ("value" | Object)[];

  // export interface Provider {
  //   [key: string]: Type | Factory | Value | Module[];
  // }

  export interface IPlugin {
    [key: string]: IType | IFactory | IValue | IPlugin[] | string[];
    __depends__: {}[];
    __init__: string[];
  }

  export type InvokeFunction = ((canvas: Canvas, renderer: BaseRenderer) => void) | ((canvas: Canvas) => void);

  export interface ICanvasOptions {
  }

  export interface IDiagramOptions {
    modules?: {}[];
    components: string[];
  }

  export interface IPoint {
    x: number;
    y: number;
  }

  export interface IBounds {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}
