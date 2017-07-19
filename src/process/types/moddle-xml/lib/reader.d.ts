// tslint:disable:max-classes-per-file
declare module "moddle-xml/lib/reader" {
  import Factory = require("moddle/lib/factory");

  /**
   * A reader for a meta-model
   *
   * @param {Object} options
   * @param {Model} options.model used to read xml files
   * @param {Boolean} options.lax whether to make parse errors warnings
   */
  export class XMLReader {
    /**
     * A reader for a meta-model
     *
     * @param {Object} options
     * @param {Model} options.model used to read xml files
     * @param {Boolean} options.lax whether to make parse errors warnings
     */
    public constructor(options: Object);

    /**
     * Parse the given XML into a moddle document tree.
     *
     * @param {String} xml
     * @param {ElementHandler|Object} options or rootHandler
     * @param  {Function} done
     */
    public fromXML(xml: string, options: Object, done: (error: Object, rootElement: Factory.ModddleElement, context: Context) => void): void;

    public handler(name: string): ElementHandler;
  }

  class BaseHandler {
    public handleEnd(): void;
    public handleText(text: {}): void;
    public handleNode(node: {}): {};
  }

  class BodyHandler extends BaseHandler {
    public handleText(text: {}): void;
  }

  class BaseElementHandler extends BodyHandler {
    public handleNode(node: {}): {};
  }

  /**
   * @class XMLReader.ElementHandler
   *
   */
  export class ElementHandler extends BaseElementHandler {
    public constructor(model: {}, type: {}, context: Context);

    public addReference(reference: Object): void;

    public handleEnd(): void;
    /**
     * Create an instance of the model from the given node.
     *
     * @param  {Element} node the xml node
     */
    public createElement(node: Element): void;

    public getPropertyForNode(node: Element): {};
    public toString(): string;

    public valueHandler(propertyDesc: {}, element: {}): {};
    public referenceHandler(propertyDesc: {}): {};
    public handler(type: {}): {};

    /**
     * Handle the child element parsing
     *
     * @param  {Element} node the xml node
     */
    public handleChild(node: Element): void;
  }

  /**
   * A parse context.
   *
   * @class
   *
   * @param {Object} options
   * @param {ElementHandler} options.rootHandler the root handler for parsing a document
   * @param {boolean} [options.lax=false] whether or not to ignore invalid elements
   */
  export class Context {
    /**
     * @property {ElementHandler} rootHandler
     */
    public rootHandler: ElementHandler;

    /**
     * @property {Boolean} lax
     */
    public lax: boolean;

    public elementsById: Object;
    public references: {}[];
    public warnings: {}[];

    /**
     * A parse context.
     *
     * @class
     *
     * @param {Object} options
     * @param {ElementHandler} options.rootHandler the root handler for parsing a document
     * @param {boolean} [options.lax=false] whether or not to ignore invalid elements
     */
    public constructor(options: Object);

    /**
     * Add an unresolved reference.
     *
     * @param {Object} reference
     */
    public addReference(reference: Object): void;

    /**
     * Add a processed element.
     *
     * @param {ModdleElement} element
     */
    public addElement(element: Factory.ModddleElement): void;

    /**
     * Add an import warning.
     *
     * @param {Object} warning
     * @param {String} warning.message
     * @param {Error} [warning.error]
     */
    public addWarning(warning: Object): void;
  }
}