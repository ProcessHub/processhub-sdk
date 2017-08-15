declare module "diagram-js/lib/layout/ManhattanLayout" {
  import { IBounds, IPoint } from "diagram-js";

  /**
   * Returns the mid points for a manhattan connection between two points.
   *
   * @example
   *
   * [a]----[x]
   *         |
   *        [x]----[b]
   *
   * @example
   *
   * [a]----[x]
   *         |
   *        [b]
   *
   * @param  {Point} a
   * @param  {Point} b
   * @param  {String} directions
   *
   * @return {Array<Point>}
   */
  export function getBendpoints(a: IPoint, b: IPoint, directions: string): IPoint[];

  /**
   * Create a connection between the two points according
   * to the manhattan layout (only horizontal and vertical) edges.
   *
   * @param {Point} a
   * @param {Point} b
   *
   * @param {String} [directions='h:h'] specifies manhattan directions for each point as {adirection}:{bdirection}.
   *                  A directionfor a point is either `h` (horizontal) or `v` (vertical)
   *
   * @return {Array<Point>}
   */
  export function connectPoints(a: IPoint, b: IPoint, directions: string): IPoint[];

  /**
   * Connect two rectangles using a manhattan layouted connection.
   *
   * @param {Bounds} source source rectangle
   * @param {Bounds} target target rectangle
   * @param {Point} [start] source docking
   * @param {Point} [end] target docking
   *
   * @param {Object} [hints]
   * @param {String} [hints.preserveDocking=source] preserve docking on selected side
   * @param {Array<String>} [hints.preferredLayouts]
   * @param {Point|Boolean} [hints.connectionStart] whether the start changed
   * @param {Point|Boolean} [hints.connectionEnd] whether the end changed
   *
   * @return {Array<Point>} connection points
   */
  export function connectRectangles(source: IBounds, target: IBounds, start: IPoint, end: IPoint, hints: Object): IPoint[];

  /**
   * Repair the connection between two rectangles, of which one has been updated.
   *
   * @param {Bounds} source
   * @param {Bounds} target
   * @param {Point} [start]
   * @param {Point} [end]
   * @param {Array<Point>} waypoints
   * @param {Object} [hints]
   * @param {Array<String>} [hints.preferredLayouts] list of preferred layouts
   * @param {Boolean} [hints.connectionStart]
   * @param {Boolean} [hints.connectionEnd]
   *
   * @return {Array<Point>} repaired waypoints
   */
  export function repairConnection(source: IBounds, target: IBounds, start: IPoint, end: IPoint, waypoints: IPoint[], hints: IManhattanLayoutOptions): IPoint[];

  /**
   * Layout a straight connection
   *
   * @param {Bounds} source
   * @param {Bounds} target
   * @param {Point} start
   * @param {Point} end
   * @param {Object} [hints]
   *
   * @return {Array<Point>} waypoints if straight layout worked
   */
  export function layoutStraight(source: IBounds, target: IBounds, start: IPoint, end: IPoint, hints: Object): IPoint[];

  /**
   * Repair a connection from one side that moved.
   *
   * @param {Bounds} moved
   * @param {Bounds} other
   * @param {Point} newDocking
   * @param {Array<Point>} points originalPoints from moved to other
   *
   * @return {Array<Point>} the repaired points between the two rectangles
   */
  export function _repairConnectionSide(moved: IBounds, other: IBounds, newDocking: IPoint, points: IPoint[]): IPoint[];

  export type ManhattanLayoutType = "h:h" | "h:v" | "v:h" | "v:v";

  export interface IManhattanLayoutOptions {
    preferredLayouts: ManhattanLayoutType[];
    connectionEnd: IPoint;
    connectionStart: IPoint;
  }
}