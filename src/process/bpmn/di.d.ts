// tslint:disable:no-empty-interface
// tslint:disable:interface-name
declare module "modeler/bpmn/di" {
  import { Dc } from "modeler/bpmn/dc";
  import Base = require("moddle/lib/base");

  namespace Di {

    export interface DiagramElement extends Base {
      readonly $type: "di:DiagramElement" | "bpmndi:BPMNPlane" | "bpmndi:BPMNShape" | "bpmndi:BPMNEdge" | "bpmndi:BPMNLabel";
      id: string;
      extension?: Extension;
    }

    export interface Edge extends DiagramElement {
      waypoint: Dc.Point[];
    }

    export interface Diagram {
      id: string;
      name: string;
      documentation?: string;
      resolution?: number;
    }

    export interface Node extends DiagramElement {
    }

    export interface Shape extends Node {
      bounds: Dc.Bounds;
    }

    export interface Plane extends Node {
      planeElement: DiagramElement[];
    }

    export interface LabeledEdge extends Edge {
    }

    export interface LabeledShape extends Shape {
    }

    export interface Label extends Node {
      bounds: Dc.Bounds;
    }

    export interface Style {
      id: string;
    }

    export interface Extension {
      readonly $type: "di:Extension";
      values: Element[];
    }

    export type diType = "di:Extension";
  }
}
