// tslint:disable:max-classes-per-file
declare module "diagram-js/lib/features/snapping/SnapContext" {

  import { IPoint } from "diagram-js";

  /**
   * A snap context, containing the (possibly incomplete)
   * mappings of drop targets (to identify the snapping)
   * to computed snap points.
   */
  export default class SnapContext {
    /**
     * Map<String, SnapPoints> mapping drop targets to
     * a list of possible snappings.
     *
     * @type {Object}
     */
    protected _targets: { [location: string]: SnapPoints };

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
    public pointsForTarget(target: Element | String): SnapPoints[];
  }

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