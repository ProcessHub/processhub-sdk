// tslint:disable:max-classes-per-file
declare module "diagram-js/lib/features/snapping/SnapContext" {
  export = SnapContext;

  import { IPoint } from "diagram-js";

  /**
   * A snap context, containing the (possibly incomplete)
   * mappings of drop targets (to identify the snapping)
   * to computed snap points.
   */
  class SnapContext {
    /**
     * Map<String, SnapPoints> mapping drop targets to
     * a list of possible snappings.
     *
     * @type {Object}
     */
    protected _targets: { [location: string]: SnapContext.SnapPoints };

    /**
     * Map<String, Point> initial positioning of element
     * regarding various snap directions.
     *
     * @type {Object}
     */
    protected _snapOrigins: { [location: string]: IPoint };

    /**
     * List of snap locations
     *
     * @type {Array<String>}
     */
    protected _snapLocations: string[];

    /**
     * Map<String, Array<Point>> of default snapping locations
     *
     * @type {Object}
     */
    protected _defaultSnaps: {};

    public getSnapOrigin(snapLocation: string): IPoint;

    public setSnapOrigin(snapLocation: string, initialValue: IPoint): void;

    public addDefaultSnap(type: string, point: IPoint): void;

    /**
     * Return a number of initialized snaps, i.e. snap locations such as
     * top-left, mid, bottom-right and so forth.
     *
     * @return {Array<String>} snapLocations
     */
    public getSnapLocations(): string[];

    /**
     * Set the snap locations for this context.
     *
     * The order of locations determines precedence.
     *
     * @param {Array<String>} snapLocations
     */
    public setSnapLocations(snapLocations: string[]): void;

    /**
     * Get snap points for a given target
     *
     * @param {Element|String} target
     */
    public pointsForTarget(target: Element | String): SnapContext.SnapPoints[];
  }

  namespace SnapContext {
    export class SnapPoints {

      /**
       * Map<String, Map<(x|y), Array<Number>>> mapping snap locations,
       * i.e. top-left, bottom-right, center to actual snap values.
       *
       * @type {Object}
       */
      protected _snapValues: Object;

      /**
       * Creates the snap points and initializes them with the
       * given default values.
       *
       * @param {Object<String, Array<Point>>} [defaultPoints]
       */
      constructor(defaultPoints: {});

      public add(snapLocation: string, point: IPoint): void;
    }

  }
}

// SnapPoints.prototype.snap = function (point, snapLocation, axis, tolerance) {
//   var snappingValues = this._snapValues[snapLocation];

//   return snappingValues && snapTo(point[axis], snappingValues[axis], tolerance);
// };

// /**
//  * Initialize a number of default snapping points.
//  *
//  * @param  {Object} defaultSnaps
//  */
// SnapPoints.prototype.initDefaults = function (defaultSnaps) {

//   var self = this;

//   forEach(defaultSnaps || {}, function (snapPoints, snapLocation) {
//     forEach(snapPoints, function (point) {
//       self.add(snapLocation, point);
//     });
//   });
// };
//   }
// }
