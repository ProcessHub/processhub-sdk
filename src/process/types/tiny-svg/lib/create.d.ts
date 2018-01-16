declare module "tiny-svg/lib/create" {
  export = create;

  /**
   * Create a specific type from name or SVG markup.
   *
   * @param {String} name the name or markup of the element
   * @param {Object} [attrs] attributes to set on the element
   *
   * @returns {SVGElement}
   */
  function create(name: "defs"): SVGDefsElement;
  function create(name: "g"): SVGGElement;
  function create(name: "g", attrs: create.ISVGGAttrib): SVGGElement;
  function create(name: "svg"): SVGSVGElement;
  function create(name: "marker", attrs: create.ISVGMarkerAttrib): SVGMarkerElement;
  function create(name: "rect", attrs: create.ISVGRectAttrib): SVGRectElement;
  function create(name: "circle", attrs: create.ISVGCircleAttrib): SVGCircleElement;
  function create(name: "ellipse", attrs: create.ISVGEllipseAttrib): SVGEllipseElement;
  function create(name: "polyline", attrs: create.ISVGPolylineAttrib): SVGPolylineElement;
  function create(name: "tspan", attrs: create.ISVGTSpanAttrib): SVGTSpanElement;
  function create(name: "text", attrs: create.ISVGTextAttrib): SVGTextElement;
  function create(name: "polygon", attrs: create.ISVGPolygonAttrib): SVGPolygonElement;
  function create(name: "image", attrs: create.ISVGImageAttrib): SVGImageElement;
  function create(name: "path", attrs: create.ISVGPathAttrib): SVGPathElement;

  namespace create {
    // https://www.w3.org/TR/SVG/types.html#ColorKeywords
    export type SVGColor = string | "black" | "red" | "white";

    // https://www.w3.org/TR/SVG/painting.html#SpecifyingPaint
    export type SVGPaint = "none" | "currentColor" | "inherit" | SVGColor;
    
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#Presentation_attributes
    export interface ISVGPresentationAttrib {
      fill: SVGPaint;
      stroke: SVGPaint;
      strokeWidth: number;
      markerEnd?: string;
      strokeDasharray?: string | number[];
      strokeLinecap?: "round";
    }
    
    export interface ISVGPathAttrib extends ISVGPresentationAttrib {
      d: string;
      transform?: string;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle
    export interface ISVGCircleAttrib extends ISVGPresentationAttrib {
      cx: number;
      cy: number;
      r: number;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute#Core_attributes
    export interface ISVGCoreAttrib {
      id: string;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
    export interface ISVGMarkerAttrib extends ISVGCoreAttrib {
      markerWidth: number;
      markerHeight: number;
      orient: "auto";
    }

    export interface ISVGRectAttrib extends ISVGPresentationAttrib {
      x: number;
      y: number;
      width: number;
      height: number;
      rx: number;
      ry: number;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline
    export interface ISVGPolylineAttrib extends ISVGPresentationAttrib {
      points: string;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text
    export interface ISVGTextAttrib extends ISVGPresentationAttrib {
      transform?: string;
      x?: number;
      y?: number;
      fontFamily?: "Arial, sans-serif";
      fontSize?: string;
      fill: SVGPaint;
      textAnchor?: "start" | "middle" | "end" | "inherit";
      alignmentBaseline?: "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit";
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan
    export interface ISVGTSpanAttrib {
      x?: number;
      y?: number;
      textAnchor: "start" | "middle" | "end" | "inherit";
      alignmentBaseline?: "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit";
      stroke: SVGPaint;
      strokeWidth: number;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon
    export interface ISVGPolygonAttrib extends ISVGPresentationAttrib {
      points: string;
    }

    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image
    export interface ISVGImageAttrib {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    // https://developer.mozilla.org/de/docs/Web/SVG/Element/ellipse
    export interface ISVGEllipseAttrib extends ISVGPresentationAttrib {
      cx: number;
      cy: number;
      rx: number;
      ry: number;
    }

    // https://developer.mozilla.org/de/docs/Web/SVG/Element/g
    export interface ISVGGAttrib extends ISVGPresentationAttrib {
      transform?: string;
    }
  }
}