import * as BpmnProcess from "./bpmnprocess";
import { Bpmn, Bpmndi } from "../bpmn";
import { isTrue } from "../../tools";
import { BpmnModdleStartEvent } from "./bpmnmoddlehelper";
import { RowDetails } from "..";

// bpmn Diagram
export const DiagramShapeTypes = {
  BPMNDI_DIAGRAM: "bpmndi:BPMNDiagram",
  BPMNDI_SHAPE: "bpmndi:BPMNShape",
  BPMNDI_EDGE: "bpmndi:BPMNEdge"
};
export type DiagramShapeTypes = keyof typeof DiagramShapeTypes;
// export const BPMNDI_DIAGRAM = "bpmndi:BPMNDiagram";
// export const BPMNDI_SHAPE = "bpmndi:BPMNShape";
// export const BPMNDI_EDGE = "bpmndi:BPMNEdge";

export class Waypoint {
  x: number;
  y: number;

  constructor(xParam: number, yParam: number) {
    this.x = xParam;
    this.y = yParam;
  }
}

export interface LaneDictionary {
  rowNumber: number;
  laneId: string;
  ObjectIdsInLane: string[];
}

export class BpmnProcessDiagram {

  public static readonly SPACE_BETWEEN_TASKS: number = 62;
  public static readonly TASK_WIDTH: number = 100;
  public static readonly GATEWAY_WIDTH: number = 45;


  public static readonly SPACE_TO_LOWER_JUMP_SF: number = 20;

  private bpmnProcess: BpmnProcess.BpmnProcess;

  constructor(process: BpmnProcess.BpmnProcess) {
    this.bpmnProcess = process;
  }

  // Diagram properties
  private diagramLaneHeight: number = 125;
  private diagramXStartParam: number = 400;
  private diagramYStartParam: number = 0;

  // Gibt erstes Diagram Element aus XML zurück
  private getDiagramElement(): Bpmndi.BPMNDiagram {
    let diagrams = this.bpmnProcess.bpmnXml.diagrams.filter((e: any) => e.$type === DiagramShapeTypes.BPMNDI_DIAGRAM);
    return diagrams[0];
  }

  public getShapeFromDiagram(shapeId: string): Bpmndi.BPMNShape {
    let diagram = this.getDiagramElement();
    for (let planeElement of diagram.plane.planeElement) {
      if (planeElement.$type === DiagramShapeTypes.BPMNDI_SHAPE && (planeElement as Bpmndi.BPMNShape).bpmnElement != null && (planeElement as Bpmndi.BPMNShape).bpmnElement.id === shapeId) {
        return planeElement as Bpmndi.BPMNShape;
      }
    }
    return null;
  }

  public getEndEventShapes(): Bpmndi.BPMNShape[] {
    const res: Bpmndi.BPMNShape[] = [];
    const diagram = this.getDiagramElement();
    for (const planeElement of diagram.plane.planeElement) {
      if (planeElement.$type === DiagramShapeTypes.BPMNDI_SHAPE && (planeElement as Bpmndi.BPMNShape).bpmnElement.$type === "bpmn:EndEvent") {
        res.push(planeElement as Bpmndi.BPMNShape);
      }
    }
    return res;
  }

  public generateBPMNDiagram(processId: string, rowDetails: RowDetails[]): void {
    let copyTaskIdsOrderFromTable: RowDetails[] = JSON.parse(JSON.stringify(rowDetails));
    let diagram = this.getDiagramElement();
    // für die Berechnung der gesamt Breite
    let process = this.bpmnProcess.getProcess(processId);
    let amountOfProcesses = process.flowElements.filter((e: any) => e.$type === BpmnProcess.BPMN_USERTASK || e.$type === BpmnProcess.BPMN_SENDTASK).length;
    let amountOfSequences = process.flowElements.filter((e: any) => e.$type === BpmnProcess.BPMN_SEQUENCEFLOW).length;


    let allGateways = this.bpmnProcess.getAllExclusiveGateways();

    let amountOfOutgoingsOnGateways: number = 0;
    let amountOfOutgoingsOnTasksUnderpass: number = 0;

    let sortedTasks: Bpmn.FlowNode[] = [];
    if (copyTaskIdsOrderFromTable != null && copyTaskIdsOrderFromTable.length > 0) {
      let tmp = this.bpmnProcess.getExistingActivityObject(copyTaskIdsOrderFromTable[0].taskId);
      if (tmp != null && tmp.$type == BpmnProcess.BPMN_STARTEVENT) {
        copyTaskIdsOrderFromTable.splice(0, 1);
      }
    }

    sortedTasks = copyTaskIdsOrderFromTable.map(row => this.bpmnProcess.getExistingTask(this.bpmnProcess.processId(), row.taskId));

    copyTaskIdsOrderFromTable.forEach(row => {
      if (row.jumpsTo != null && row.jumpsTo.length > 0) {
        amountOfOutgoingsOnTasksUnderpass += (row.jumpsTo.length - 1);
      }
    });

    // Anzahl der Prozesse + anzahl der seuqenzen + feste werte für anfang und ende
    let poolWidth: number = (amountOfProcesses * BpmnProcessDiagram.TASK_WIDTH)
      + ((amountOfSequences - amountOfOutgoingsOnGateways) * BpmnProcessDiagram.SPACE_BETWEEN_TASKS)
      + (allGateways.length * 36)
      // - (amountOfProcessesWithMultipleOutgoing * BpmnProcessDiagram.SPACE_BETWEEN_TASKS)
      + 200;
    // die lane ist genau 30 pixel kürzer wie der Pool wegen der Beschriftung!
    let laneWidth: number = poolWidth - 30;
    // Diagramm Elements entfernen bevor man sie erneut hinzufügt
    diagram.plane.planeElement = [];

    // lanesets vom Prozess ins Diagramm
    let lanes = this.bpmnProcess.getSortedLanesWithTasks(processId);

    let laneDictionaries: LaneDictionary[] = [];
    // 20 => buffer and 10 is multiply factor for each extra flow
    let extraFlowFactor: number = allGateways.length === 0 && amountOfOutgoingsOnTasksUnderpass === 0 ? 0 : BpmnProcessDiagram.SPACE_TO_LOWER_JUMP_SF + (amountOfOutgoingsOnGateways * 10) + (amountOfOutgoingsOnTasksUnderpass * 10);
    let lastLaneHeight: number = this.diagramLaneHeight + extraFlowFactor;
    if (lanes.length > 0) {
      // Zeichnen der Lanes
      let tmpYParam: number = this.diagramYStartParam;
      for (let i = 0; i < lanes.length; i++) {
        let laneObject = lanes[i];

        // 30 weniger breit und 30 weiter nach rechts, da lange nicht so breit wie der Pool!
        let tmpLaneObj = this.createShape(laneObject, (this.diagramXStartParam + 30), tmpYParam, laneWidth, ((i + 1) === lanes.length) ? lastLaneHeight : this.diagramLaneHeight);
        diagram.plane.planeElement.push(tmpLaneObj);
        tmpYParam += this.diagramLaneHeight;

        // von Jedem Objekt in einer Lane wird die ID hier gespeichert
        let objectsForLane: string[] = [];
        for (let object of laneObject.flowNodeRef) {
          objectsForLane.push(object.id);
        }

        let laneDictionary: LaneDictionary = {
          laneId: laneObject.id,
          rowNumber: i,
          ObjectIdsInLane: objectsForLane
        };

        laneDictionaries.push(laneDictionary);
      }

      // Zeichnen des Pools
      for (let object of this.bpmnProcess.getCollaborationElements()) {
        let participants = object.participants;

        // mit der Anzahl der Lanes kann die Gesamtpool Höhe berechnet werden
        let lanes = this.bpmnProcess.getSortedLanesWithTasks(processId);

        for (let t = 0; t < participants.length; t++) {
          let poolHeight: number = this.diagramLaneHeight * lanes.length;
          poolHeight += extraFlowFactor;
          let shape = this.createShape(participants[t], this.diagramXStartParam, this.diagramYStartParam, poolWidth, poolHeight);
          diagram.plane.planeElement.push(shape);
        }
      }

      // Zechnen aller Objekte im Diagramm
      let process = this.bpmnProcess.getProcess(processId);

      let flowElements = process.flowElements;
      let drawObjectList: Bpmn.FlowNode[] = [];
      let startElementObject = flowElements.filter((e: any) => e.$type === BpmnProcess.BPMN_STARTEVENT);
      startElementObject = startElementObject.sort((a, b) => {
        if ((a as BpmnModdleStartEvent).eventDefinitions == null)
          return -1;

        if ((b as BpmnModdleStartEvent).eventDefinitions == null)
          return 1;
        return 0;
      });
      drawObjectList = drawObjectList.concat(startElementObject);

      drawObjectList = drawObjectList.concat(sortedTasks);

      let gates: Bpmn.FlowNode[] = this.bpmnProcess.getAllExclusiveGateways();
      // drawObjectList = drawObjectList.concat(gats);

      // this.recursiveGenerateDiagramTasks(diagram, laneDictionaries, startElementObject[0], (this.diagramXStartParam + 100));
      let ends = this.bpmnProcess.getEndEvents(this.bpmnProcess.processId());
      drawObjectList = drawObjectList.concat(ends);

      for (let i = 0; i < drawObjectList.length; i++) {
        let task = drawObjectList[i];
        if (task != null && task.$type !== BpmnProcess.BPMN_ENDEVENT && task.outgoing.find(out => out.targetRef.$type === BpmnProcess.BPMN_EXCLUSIVEGATEWAY)) {
          let gate = gates.find(g => g.incoming.find(inc => inc.sourceRef.id === task.id) != null);
          if (drawObjectList.find(obj => obj.id === gate.id) == null) {
            drawObjectList.splice((i + 1), 0, gate);
          }
        }
      }

      // filter undefined
      drawObjectList = drawObjectList.filter(elem => elem != null);

      this.drawAllTasks(diagram, laneDictionaries, drawObjectList, (this.diagramXStartParam + 100));

      // sequenceFlows vom Prozess ins Diagramm
      let sequenceFlows: Bpmn.SequenceFlow[] = this.bpmnProcess.getSequenceFlowElements();

      // get all "normal" sf's
      let normalSequenceFlows: Bpmn.SequenceFlow[] = [];

      for (let i = 0; i < drawObjectList.length; i++) {
        let thisObj = drawObjectList[i];
        let nextObj = drawObjectList[(i + 1)];
        let tmpSf = sequenceFlows.find(sf => sf.sourceRef.id === thisObj.id && sf.targetRef.id === nextObj.id);
        if (tmpSf != null || thisObj.$type === BpmnProcess.BPMN_STARTEVENT) {
          if (thisObj.$type === BpmnProcess.BPMN_STARTEVENT) {
            tmpSf = sequenceFlows.find(sf => sf.sourceRef.id === thisObj.id);
          }
          if (tmpSf != null) {
            normalSequenceFlows.push(tmpSf);
          }
        }
      }

      let jumpSequenceFlows = sequenceFlows.filter(sf => normalSequenceFlows.indexOf(sf) === -1);

      for (let flowObject of normalSequenceFlows) {
        this.generateSequenceFlow(diagram, flowObject, false);
      }

      let numberOfJumpEdge: number = 0;
      for (let flowObject of jumpSequenceFlows) {
        this.generateSequenceFlow(diagram, flowObject, true, numberOfJumpEdge, laneDictionaries);
        numberOfJumpEdge++;
      }
    }
  }

  private drawAllTasks(diagram: any, laneDictionaries: LaneDictionary[], taskList: Bpmn.FlowNode[], xParam: number) {
    for (let workingObject of taskList) {
      let iconWidth = BpmnProcessDiagram.TASK_WIDTH;
      let sizeStartAndEndEvent: number = 36;
      let iconHeight: number = 80;
      // Jedes element MUSS in einer Lane sein! Wenn hier null returned wird, dann ist das ein FEHLER       
      let laneNumber: number = this.bpmnProcess.getLaneNumberOfElement(workingObject, laneDictionaries);
      if (laneNumber == null) {
        console.log("Error: Element has no lane assignment.");
      }

      // Berechnung der Y-Koordinate für jedes Element (Task)
      // 30 ist hier der optimal eingerückte wert für die LaneHöhe
      let yParam = (this.diagramYStartParam + 23) + laneNumber * this.diagramLaneHeight;

      // weil größe des icons anders
      if (workingObject.$type === BpmnProcess.BPMN_STARTEVENT || workingObject.$type === BpmnProcess.BPMN_ENDEVENT || workingObject.$type === BpmnProcess.BPMN_EXCLUSIVEGATEWAY) {
        // let amountOfStartEvents = taskList.filter(obj => obj.$type === BpmnProcess.BPMN_STARTEVENT);

        // let startEventHeightShift = amountOfStartEvents.length == 2 ? 20 : 40;
        iconWidth = sizeStartAndEndEvent;
        iconHeight = sizeStartAndEndEvent;

        yParam = (this.diagramYStartParam + BpmnProcessDiagram.GATEWAY_WIDTH) + laneNumber * this.diagramLaneHeight;

        let standardStartEvent = taskList.filter(t => t.$type === BpmnProcess.BPMN_STARTEVENT && (t as BpmnModdleStartEvent).eventDefinitions == null);
        let startEvents = taskList.filter(t => t.$type === BpmnProcess.BPMN_STARTEVENT);

        let startEvent = (workingObject as BpmnModdleStartEvent);
        if (startEvent.eventDefinitions != null && startEvent.eventDefinitions.length > 0) {
          if (standardStartEvent.length > 0 || (startEvents.length > 1 && startEvents.last().id == workingObject.id)) {
            xParam -= iconWidth + BpmnProcessDiagram.SPACE_BETWEEN_TASKS;
          }

          let isMessageStartEvent = startEvent.eventDefinitions.last().$type === BpmnProcess.BPMN_MESSAGEEVENTDEFINITION;
          isMessageStartEvent ?
            yParam -= 40 :
            yParam += 40;
        }
      }

      let shape = this.createShape(workingObject, xParam, yParam, iconWidth, iconHeight);

      diagram.plane.planeElement.push(shape);

      // Über den xParam wird gesteuert wie viel weiter rechts das der nächste Task Liegt
      // Sollte sich ergeben aus der Taskbreite + einem gewissen Raum für den Pfeil (optimal sind 30px)
      xParam += iconWidth + BpmnProcessDiagram.SPACE_BETWEEN_TASKS;
    }
  }

  private recursiveGenerateDiagramTasks(diagram: any, laneDictionaries: LaneDictionary[], workingObject: any, xParam: number) {

    let iconWidth = BpmnProcessDiagram.TASK_WIDTH;
    let sizeStartAndEndEvent: number = 36;
    let iconHeight: number = 80;

    // Jedes element MUSS in einer Lane sein! Wenn hier null returned wird, dann ist das ein FEHLER       
    let laneNumber: number = this.bpmnProcess.getLaneNumberOfElement(workingObject, laneDictionaries);
    if (laneNumber == null) {
      console.log("Error: Element has no lane assignment.");
    }

    // Berechnung der Y-Koordinate für jedes Element (Task)
    // 30 ist hier der optimal eingerückte wert für die LaneHöhe
    let yParam = (this.diagramYStartParam + 23) + laneNumber * this.diagramLaneHeight;

    // weil größe des icons anders
    if (workingObject.$type === BpmnProcess.BPMN_STARTEVENT || workingObject.$type === BpmnProcess.BPMN_ENDEVENT) {
      iconWidth = sizeStartAndEndEvent;
      iconHeight = sizeStartAndEndEvent;

      yParam = (this.diagramYStartParam + 45) + laneNumber * this.diagramLaneHeight;
    }

    let shape = this.createShape(workingObject, xParam, yParam, iconWidth, iconHeight);

    diagram.plane.planeElement.push(shape);

    // Über den xParam wird gesteuert wie viel weiter rechts das der nächste Task Liegt
    // Sollte sich ergeben aus der Taskbreite + einem gewissen Raum für den Pfeil (optimal sind 30px)
    xParam += iconWidth + BpmnProcessDiagram.SPACE_BETWEEN_TASKS;

    if (workingObject.outgoing != null) {
      for (let outgoingSF of workingObject.outgoing) {
        this.recursiveGenerateDiagramTasks(diagram, laneDictionaries, outgoingSF.targetRef, xParam);
      }
    }
  }

  private generateSequenceFlow(diagram: any, flowObject: Bpmn.SequenceFlow, drawJumpFlow: boolean, numberOfJumpEdge: number = 0, laneDictionaries: LaneDictionary[] = null) {
    let waypoints: Waypoint[] = [];
    // hole die beiden Diagramm Objekte von Quell und Ziel Objekt
    let sourceRef = flowObject.sourceRef;
    let sourceDiagramObject = this.getShapeFromDiagram(sourceRef.id);
    let targetRef = flowObject.targetRef;
    let targetDiagramObject = this.getShapeFromDiagram(targetRef.id);
    isTrue(sourceRef != null, "Missing Ref Source: " + flowObject.sourceRef);
    isTrue(sourceDiagramObject != null, "Missing Object Source with ID: " + sourceRef.id);
    isTrue(targetRef != null, "Missing Target Source: " + flowObject.targetRef);
    isTrue(targetDiagramObject != null, "Missing Object Target with ID: " + targetRef.id);

    if (drawJumpFlow) {
      waypoints = this.getWaypointsBetweenObjectsUnderpass(sourceDiagramObject, targetDiagramObject, numberOfJumpEdge, laneDictionaries);
    } else {
      waypoints = this.getWaypointsBetweenObjects(sourceDiagramObject, targetDiagramObject);
    }

    let edgeObj = this.createEdge(flowObject, flowObject.sourceRef, flowObject.targetRef, waypoints);
    /*
        let firstX = waypoints[0].x;
        let lastX  = waypoints.last().x;
        let firstY = waypoints[0].y;
        let lastY  = waypoints.last().y;
    
        let xDiff = firstX > lastX ? firstX - lastX : lastX - firstX;
        xDiff = xDiff / 2;
        let yDiff = firstY > lastY ? firstY - lastY : lastY - firstY;
        yDiff = yDiff / 2;
    
        let finalX = firstX > lastX ? lastX + xDiff : firstX + xDiff;
        let finalY = firstY > lastY ? lastY + yDiff : firstY + yDiff;
        
        if (drawJumpFlow) {
          finalX = firstX;
          finalY = firstY + yDiff;
        }
    
        let bounds = this.bpmnProcess.moddle.create("dc:Bounds", { x: finalX, y: finalY, width: 1, height: 1 });
        let label = this.bpmnProcess.moddle.create("bpmndi:BPMNLabel", {
          id: BpmnProcess.BpmnProcess.getBpmnId(DiagramShapeTypes.BPMNDI_EDGE),
          bounds: bounds
        });
        edgeObj.label = label;*/

    diagram.plane.planeElement.push(edgeObj);
  }

  private createShape(bpmnElement: any, xParam: number, yParam: number, widthParam: number, heightParam: number): any {
    let bounds = this.bpmnProcess.moddle.create("dc:Bounds", { x: xParam, y: yParam, width: widthParam, height: heightParam });
    let shape = this.bpmnProcess.moddle.create("bpmndi:BPMNShape", {
      id: BpmnProcess.BpmnProcess.getBpmnId(DiagramShapeTypes.BPMNDI_SHAPE),
      bounds: bounds,
      bpmnElement: bpmnElement
    });
    return shape;
  }

  private createEdge(bpmnElement: any, sourceElement: any, targetElement: any, waypoints: Waypoint[]): Bpmndi.BPMNEdge {

    let resultWaypoint: any[] = [];
    // waypoint einfügen
    for (let waypoint of waypoints) {
      let tmpWaypoint = this.bpmnProcess.moddle.create("dc:Point", { x: waypoint.x, y: waypoint.y });
      resultWaypoint.push(tmpWaypoint);
    }

    let edge = this.bpmnProcess.moddle.create("bpmndi:BPMNEdge", {
      id: BpmnProcess.BpmnProcess.getBpmnId(DiagramShapeTypes.BPMNDI_EDGE),
      bpmnElement: bpmnElement,
      sourceElement: sourceElement,
      targetElement: targetElement,
      waypoint: resultWaypoint
    });
    return edge;
  }

  private getWaypointsBetweenObjects(sourceObject: Bpmndi.BPMNShape, targetObject: Bpmndi.BPMNShape): Waypoint[] {

    let result: Waypoint[] = [];

    let sourceBounds = sourceObject.bounds;
    let targetBounds = targetObject.bounds;

    // Der erste Waypoint (Start) startet immer auf der RECHTEN SEITE und in der MITTE des Shapes
    let sourceX: number = sourceBounds.x + sourceBounds.width;
    let sourceY: number = sourceBounds.y + (sourceBounds.height / 2);
    let sourceWaypoint = new Waypoint(sourceX, sourceY);
    result.push(sourceWaypoint);

    // Der zweite Waypoint (Ziel) endet immer auf der LINKEN SEITE und in der MITTE des Shapes
    let targetX: number = targetBounds.x;
    let targetY: number = targetBounds.y + (targetBounds.height / 2);
    let targetWaypoint = new Waypoint(targetX, targetY);

    let midBetweenObjects: number = sourceX + ((targetX - sourceX) / 2);
    // 2 mittlere Waypoints für S-artige Kurve
    let upperWaypoint = new Waypoint(midBetweenObjects, sourceY);
    result.push(upperWaypoint);

    let lowerWaypoint = new Waypoint(midBetweenObjects, targetY);
    result.push(lowerWaypoint);

    // Letzter Waypoint darf erst hier in die Liste eingefügt werden, da die Waypoints nacheinander gezeichnet werden!
    result.push(targetWaypoint);

    return result;
  }

  private getWaypointsBetweenObjectsUnderpass(sourceObject: Bpmndi.BPMNShape, targetObject: Bpmndi.BPMNShape, numberOfJumpEdge: number, laneDictionaries: LaneDictionary[]): Waypoint[] {

    let result: Waypoint[] = [];

    let sourceBounds = sourceObject.bounds;
    let targetBounds = targetObject.bounds;

    // Der erste Waypoint (Start) startet immer auf der RECHTEN SEITE und in der MITTE des Shapes
    let sourceX: number = sourceBounds.x + sourceBounds.width / 2;
    let sourceY: number = sourceBounds.y + sourceBounds.height;
    let sourceWaypoint = new Waypoint(sourceX, sourceY);
    result.push(sourceWaypoint);

    // Der zweite Waypoint (Ziel) endet immer auf der LINKEN SEITE und in der MITTE des Shapes
    let targetX: number = targetBounds.x + (targetBounds.width / 2);

    let targetY: number = targetBounds.y + targetBounds.height;
    let targetWaypoint = new Waypoint(targetX, targetY);

    let lowEdge = (10) + this.diagramLaneHeight * laneDictionaries.length; //  targetY > sourceY ? targetY : sourceY;
    // lowEdge += BpmnProcessDiagram.SPACE_TO_LOWER_JUMP_SF;

    lowEdge += 10 * numberOfJumpEdge;

    // let midBetweenObjects: number = sourceX + ((targetX - sourceX) / 2);
    // 2 mittlere Waypoints für S-artige Kurve
    // let upperWaypoint = new Waypoint(midBetweenObjects, sourceY);
    // result.push(upperWaypoint);

    let lowerWaypoint2 = new Waypoint(sourceX, lowEdge);
    result.push(lowerWaypoint2);

    let lowerWaypoint = new Waypoint(targetX, lowEdge);
    result.push(lowerWaypoint);

    // Letzter Waypoint darf erst hier in die Liste eingefügt werden, da die Waypoints nacheinander gezeichnet werden!
    result.push(targetWaypoint);

    return result;
  }
}