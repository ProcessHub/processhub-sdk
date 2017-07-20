/// <reference path="./bpmn.d.ts" />
/// <reference path="./dc.d.ts" />
/// <reference path="./di.d.ts" />

// tslint:disable:interface-name
declare module "modeler/bpmn/bpmndi" {
  import { Bpmn } from "modeler/bpmn/bpmn";
  import { Dc } from "modeler/bpmn/dc";
  import { Di } from "modeler/bpmn/di";

  namespace Bpmndi {

    enum ParticipantBandKind { }
    enum MessageVisibleKind { }

    export interface BPMNDiagram extends Di.Diagram {
      readonly $type: "bpmndi:BPMNDiagram";
      plane: BPMNPlane;
      labelStyle?: BPMNLabelStyle[];
    }

    export interface BPMNPlane extends Di.Plane {
      readonly $type: "bpmndi:BPMNPlane";
      bpmnElement: Bpmn.BaseElement;
    }

    export interface BPMNShape extends Di.LabeledShape {
      readonly $type: "bpmndi:BPMNShape";
      bpmnElement: Bpmn.BaseElement;
      isHorizontal: boolean;
      isExpanded: boolean;
      isMarkerVisible: boolean;
      label: BPMNLabel;
      isMessageVisible: boolean;
      participantBandKind: ParticipantBandKind;
      choreographyActivityShape: BPMNShape;
    }

    export interface BPMNEdge extends Di.LabeledEdge {
      readonly $type: "bpmndi:BPMNEdge";
      label: BPMNLabel;
      bpmnElement: Bpmn.BaseElement;
      sourceElement: Di.DiagramElement;
      targetElement: Di.DiagramElement;
      messageVisibleKind: MessageVisibleKind;
    }

    export interface BPMNLabel extends Di.Label {
      readonly $type: "bpmndi:BPMNLabel";
      labelStyle: BPMNLabelStyle;
    }

    export interface BPMNLabelStyle extends Di.Style {
      readonly $type: "bpmndi:BPMNLabelStyle";
      font: Dc.Font;
    }

    export type bpmndiType = "bpmndi:BPMNDiagram" | "bpmndi:BPMNPlane" | "bpmndi:BPMNShape" | "bpmndi:BPMNEdge" | "bpmndi:BPMNLabel" | "bpmndi:BPMNLabelStyle";
  }
}
