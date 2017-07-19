declare module "moddle/lib/moddle" {
  export = Moddle;

  /**
   * @class Moddle
   *
   * A model that can be used to create elements of a specific type.
   *
   * @example
   *
   * var Moddle = require('moddle');
   *
   * var pkg = {
   *   name: 'mypackage',
   *   prefix: 'my',
   *   types: [
   *     { name: 'Root' }
   *   ]
   * };
   *
   * var moddle = new Moddle([pkg]);
   *
   * @param {Array<Package>} packages the packages to contain
   */
  class Moddle {

    public constructor(packages: {}[]);

    /**
     * Create an instance of the specified type.
     *
     * @method Moddle#create
     *
     * @example
     *
     * var foo = moddle.create('my:Foo');
     * var bar = moddle.create('my:Bar', { id: 'BAR_1' });
     *
     * @param  {String|{}} descriptor the type descriptor or name know to the model
     * @param  {{}} attrs   a number of attributes to initialize the model instance with
     * @return {{}}         model instance
     */
    public create(descriptor: string | {}, attrs: {}): {};

    /**
     * Returns the type representing a given descriptor
     *
     * @method Moddle#getType
     *
     * @example
     *
     * var Foo = moddle.getType('my:Foo');
     * var foo = new Foo({ 'id' : 'FOO_1' });
     *
     * @param  {String|{}} descriptor the type descriptor or name know to the model
     * @return {{}}         the type representing the descriptor
     */
    public getType(descriptor: string | {}): {};

    /**
     * Creates an any-element type to be used within model instances.
     *
     * This can be used to create custom elements that lie outside the meta-model.
     * The created element contains all the meta-data required to serialize it
     * as part of meta-model elements.
     *
     * @method Moddle#createAny
     *
     * @example
     *
     * var foo = moddle.createAny('vendor:Foo', 'http://vendor', {
     *   value: 'bar'
     * });
     *
     * var container = moddle.create('my:Container', 'http://my', {
     *   any: [ foo ]
     * });
     *
     * // go ahead and serialize the stuff
     *
     *
     * @param  {String} name  the name of the element
     * @param  {String} nsUri the namespace uri of the element
     * @param  {{}} [properties] a map of properties to initialize the instance with
     * @return {{}} the any type instance
     */
    public createAny(name: string, nsUri: string, properties: {}): {};

    /**
     * Returns a registered package by uri or prefix
     *
     * @return {{}} the package
     */
    public getPackage(uriOrPrefix: string): {};

    /**
     * Returns a snapshot of all known packages
     *
     * @return {{}} the package
     */
    public getPackages(): {};

    /**
     * Returns the descriptor for an element
     */
    public getElementDescriptor(element: {}): {};

    /**
     * Returns true if the given descriptor or instance
     * represents the given type.
     *
     * May be applied to this, if element is omitted.
     */
    public hasType(element: {}, type: string): boolean;

    /**
     * Returns the descriptor of an elements named property
     */
    public getPropertyDescriptor(element: {}, property: string): {};

    /**
     * Returns a mapped type's descriptor
     */
    public getTypeDescriptor(type: {}): {};

  }
}