// tslint:disable:max-classes-per-file
declare module "diagram-js/lib/model" {

  import { IPoint } from "diagram-js";

  /**
   * The basic graphical representation
   *
   * @class
   *
   * @abstract
   */
  export class Base {
    public width: number;
    public height: number;
    public x: number;
    public y: number;

    public id?: string;

    /**
     * The object that backs up the shape
     *
     * @name Base#businessObject
     * @type Object
     */
    public businessObject?: Object;

    /**
     * The parent shape
     *
     * @name Base#parent
     * @type Shape
     */
    public parent?: Base;

    /**
     * @name Base#label
     * @type Label
     */
    public label?: Label;

    /**
     * The list of outgoing connections
     *
     * @name Base#outgoing
     * @type Array<Connection>
     */
    public outgoing?: Connection[];

    /**
     * The list of incoming connections
     *
     * @name Base#incoming
     * @type Array<Connection>
     */
    public incoming?: Connection[];

    constructor();
  }

  /**
   * A graphical object
   *
   * @class
   * @constructor
   *
   * @extends Base
   */
  export class Shape extends Base {
    /**
     * The list of children
     *
     * @name Shape#children
     * @type Array<Base>
     */
    public children: Base[];

    /**
     * @name Shape#host
     * @type Shape
     */
    public host: Base;

    /**
     * @name Shape#attachers
     * @type Shape
     */
    public attachers: Base;

    public id: string;

    public constructor();
  }

  /**
   * A root graphical object
   *
   * @class
   * @constructor
   *
   * @extends Shape
   */
  class Root extends Base {

  }

  /**
   * A label for an element
   *
   * @class
   * @constructor
   *
   * @extends Shape
   */
  class Label extends Shape {
    /**
     * The labeled element
     *
     * @name Label#labelTarget
     * @type Base
     */
    public labelTarget: Base;
  }

  /**
   * A connection between two elements
   *
   * @class
   * @constructor
   *
   * @extends Base
   */
  class Connection extends Base {
    public waypoints: IPoint[];

    /**
     * The element this connection originates from
     *
     * @name Connection#source
     * @type Base
     */
    public source: Base;

    /**
     * The element this connection points to
     *
     * @name Connection#target
     * @type Base
     */
    public target: Base;
  }
}
