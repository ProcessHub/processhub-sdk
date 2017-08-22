import BpmnModdle = require("bpmn-moddle");
import * as PH from "../../";
import { BpmnProcess } from "./bpmnprocess";
import * as BpmnProcessDiagramFile from "./bpmnprocessdiagram";
import * as BpmnProcessFile from "./bpmnprocess";
import { Processhub, Bpmn, Dc } from "../bpmn";

export type ModdleElementType = Bpmn.bpmnType;

export type BpmnModdleTask = Bpmn.Task;
export type BpmnModdleUserTask = Bpmn.UserTask;
export type BpmnModdleSendTask = Bpmn.SendTask;
export type BpmnModdleExtensionElements = Bpmn.ExtensionElements;
export type BpmnModdleEndEvent = Bpmn.EndEvent;
export type BpmnModdleIntermediateThrowEvent = Bpmn.IntermediateThrowEvent;
export type BpmnModdleIntermediateCatchEvent = Bpmn.IntermediateCatchEvent;
export type BpmnModdleBoundaryEvent = Bpmn.BoundaryEvent;
export type BpmnModdleProcess = Bpmn.Process;
export type BpmnModdleLaneSet = Bpmn.LaneSet;
export type BpmnModdleSequenceFlow = Bpmn.SequenceFlow;
export type BpmnFormalExpresion = Bpmn.FormalExpression;
export type BpmnModdleLane = Bpmn.Lane;
export type BpmnModdleCollaboration = Bpmn.Collaboration;
export type BpmndiModdleBounds = Dc.Bounds;
export type BpmnModdleParticipant = Bpmn.Participant;
export type BpmnModdleStartEvent = Bpmn.StartEvent;

const processhubNs = "http://processhub.com/schema/1.0/bpmn";

export function createTaskExtensionTemplate(): BpmnModdleExtensionElements {
  let moddle = new BpmnModdle([], {});

  let inputOutput: Processhub.InputOutput = moddle.createAny("processhub:inputOutput", processhubNs, {
    $children: []
  });

  let extensionElements: BpmnModdleExtensionElements = moddle.create("bpmn:ExtensionElements", {
    values: [inputOutput]
  });

  return extensionElements;
}

export function addTaskExtensionInputText(extensions: BpmnModdleExtensionElements, key: PH.Process.TaskSettings, value: string) {
  let moddle = new BpmnModdle();

  let inputParameter: Processhub.InputParameter = moddle.createAny("processhub:inputParameter", processhubNs, {
    name: key,
    $body: value
  });

  if (extensions.values[0].$children == null) {
    extensions.values[0].$children = [];
  }
  extensions.values[0].$children.push(inputParameter);
}

// Basis-Bpmn-Prozess erzeugen
export async function createBpmnTemplate(moddle: any): Promise<PH.Process.LoadTemplateReply> {
  let xmlStr =
    "<?xml version='1.0' encoding='UTF-8'?>" +
    "<bpmn:definition xmlns:bpmn='http://www.omg.org/spec/BPMN/20100524/MODEL' id='Definition_" + PH.Tools.createId() + "'>" +
    "</bpmn:definition>";

  let promise = new Promise<PH.Process.LoadTemplateReply>(function (resolve, reject) {
    moddle.fromXML(xmlStr, (err: any, bpmnXml: any, bpmnContext: any): void => {
      // Basisknoten anlegen - gleichzeitig ein gutes Beispiel für den Umgang mit moddle

      // Beispiele für Zugriffe auf Xml siehe
      // https://github.com/bpmn-io/bpmn-moddle/tree/master/test/spec/xml

      // 1 Prozessknoten mit 1 unbenannten Teilnehmer (=Lane)
      let processId = BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_PROCESS);
      let startEventObject = moddle.create(BpmnProcessFile.BPMN_STARTEVENT, { id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_STARTEVENT), outgoing: [], incoming: [] });
      let endEventObject = moddle.create(BpmnProcessFile.BPMN_ENDEVENT, { id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_ENDEVENT), outgoing: [], incoming: [] });
      let initSequenceFlow = moddle.create(BpmnProcessFile.BPMN_SEQUENCEFLOW, {
        id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_SEQUENCEFLOW),
        sourceRef: startEventObject,
        targetRef: endEventObject
      });
      endEventObject.incoming.push(initSequenceFlow);
      startEventObject.outgoing.push(initSequenceFlow);

      let bpmnProcessElement = moddle.create(BpmnProcessFile.BPMN_PROCESS, {
        id: processId,
        laneSets: [
          moddle.create(BpmnProcessFile.BPMN_LANESET, { /*id: createId() ,*/
            // ACHTUNG! Wenn hier einmal standardmäßig der "Teilnehmer 1" nicht mehr steht, dann müssen Tests angepasst werden
            lanes: [/*moddle.create(BpmnProcessFile.BPMN_LANE, 
              { id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_LANE), name: "Teilnehmer 1", flowNodeRef: [] }
            )*/]
          })
        ],
        isExecutable: true,
        flowElements: [
          startEventObject,
          endEventObject,
          initSequenceFlow
        ]
      });

      // 1 unbenannter Pool
      let bpmnParticipant = moddle.create(BpmnProcessFile.BPMN_PARTICIPANT, {
        id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_PARTICIPANT),
        processRef: bpmnProcessElement,
        name: "ProcessHub",
      });

      let bpmnCollaboration = moddle.create(BpmnProcessFile.BPMN_COLLABORATION, {
        id: BpmnProcess.getBpmnId(BpmnProcessFile.BPMN_COLLABORATION),
        participants: [bpmnParticipant]
      });

      let bpmnDiagram = moddle.create(BpmnProcessDiagramFile.DiagramShapeTypes.BPMNDI_DIAGRAM, {
        name: BpmnProcess.getBpmnId(BpmnProcessDiagramFile.DiagramShapeTypes.BPMNDI_DIAGRAM),
        plane: moddle.create("bpmndi:BPMNPlane", {
          bpmnElement: bpmnCollaboration,
          planeElement: []
        })
      });
      // Moddle erzeugt 2 Objekte: Erstens ein Xml-Objekt, das vermutlich auf der Sax Xml Engine basiert.
      // Außerdem einen Context, der sich verhält wie ein Json-Objekt. Beide Objekte werden beim Ändern
      // synchronisiert, wie und warum das so ist, weiß ich nicht.
      // Scheinbar ist der Context besser (einfacher) geeignet für Zugriffe, während das Xml-Objekt
      // auf alle Fälle für die spätere Rückkonvertierung in einen Xml-String benötigt wird??

      // Variante 1: Knoten an Xml anhängen
      // bpmnXml.get("rootElements").push(bpmnCollaboration);
      // bpmnXml.get("rootElements").push(bpmnProcessElement);

      // Variante 2: Erzeugte Knoten in Context einhängen
      bpmnContext.rootHandler.element.rootElements = [bpmnCollaboration, bpmnProcessElement];

      bpmnContext.rootHandler.element.diagrams = [bpmnDiagram];

      resolve(
        {
          result: PH.Process.ProcessResult.Ok,
          bpmnContext: bpmnContext,
          bpmnXml: bpmnXml
        } as PH.Process.LoadTemplateReply
      );
    });
    // callback(err, bpmnXml, bpmnContext);
  });

  return promise;
}

