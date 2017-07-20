import * as BpmnModdleHelper from "./bpmnmoddlehelper";
import * as PH from "../../";
import * as Process from "../../process";
import * as Todo from "../../todo";
import { LaneDictionary } from "./bpmnprocessdiagram";
import { BpmnProcessDiagram } from "./bpmnprocessdiagram";
import BpmnModdle = require("bpmn-moddle");
import { Bpmn } from "../";

import { Processhub } from "modeler/bpmn/processhub";
import { ModdleElementType } from "./bpmnmoddlehelper";
import * as _ from "lodash";

export const BPMN_PROCESS = "bpmn:Process";
export const BPMN_COLLABORATION = "bpmn:Collaboration";
export const BPMN_PARTICIPANT = "bpmn:Participant";
export const BPMN_TASK = "bpmn:UserTask";
export const BPMN_SENDTASK = "bpmn:SendTask";
export const BPMN_STARTEVENT = "bpmn:StartEvent";
export const BPMN_ENDEVENT = "bpmn:EndEvent";
export const BPMN_SEQUENCEFLOW = "bpmn:SequenceFlow";
export const BPMN_INTERMEDIATETHROWEVENT = "bpmn:IntermediateThrowEvent";
export const BPMN_INTERMEDIATECATCHEVENT = "bpmn:IntermediateCatchEvent";
export const BPMN_MESSAGEEVENTDEFINITION = "bpmn:MessageEventDefinition";
export const BPMN_ERROREVENTDEFINITION = "bpmn:ErrorEventDefinition";
export const BPMN_BOUNDARYEVENT = "bpmn:BoundaryEvent";
export const BPMN_LANE = "bpmn:Lane";
export const BPMN_LANESET = "bpmn:LaneSet";
export const BPMN_EXCLUSIVEGATEWAY = "bpmn:ExclusiveGateway";
export const BPMN_PARALLELGATEWAY = "bpmn:ParallelGateway";
export const BPMN_FORMALEXPRESSION = "bpmn:FormalExpression";

export class BpmnProcess {

  moddle: BpmnModdle;
  bpmnXml: Bpmn.Definitions;

  private processDiagram: BpmnProcessDiagram;

  constructor() {
    this.moddle = new BpmnModdle([], {});
    this.bpmnXml = null;
    this.processDiagram = new BpmnProcessDiagram(this);
  }

  public definitionId(): string {
    return this.bpmnXml.id;
  }

  public processId(): string {
    return this.getProcesses()[0].id;
  }

  public fixExclusiveGateway(): void {
    let exclusiveGateways: Bpmn.ExclusiveGateway[] = this.getFlowElementsOfType<Bpmn.ExclusiveGateway>(BPMN_EXCLUSIVEGATEWAY);

    for (let exGat of exclusiveGateways) {
      // Wenn nur 1 outgoing von einem xor ist, dann braucht dies keine Bedingung
      if (exGat.outgoing != null && exGat.outgoing.length > 1) {
        for (let seqFlow of exGat.outgoing) {
          // this.variables.choosenTaskId
          seqFlow.conditionExpression = this.moddle.create(BPMN_FORMALEXPRESSION, {
            body: "this.variables.taskInput." + exGat.id + ".userInput.choosenTaskId == '" + seqFlow.targetRef.id + "'", language: "JavaScript"
          });
        }
      }
    }
  }

  public getExtensionValues(taskObject: Bpmn.Task): Process.TaskExtensions {
    let returnValue: Process.TaskExtensions = {
      description: null,
      customFormSchemaString: null,
      sendTaskReceiver: null
    };

    if (taskObject == null || taskObject.extensionElements == null || (taskObject.extensionElements != null && taskObject.extensionElements.values == null)) {
      return returnValue;
    }

    for (let values of taskObject.extensionElements.values) {
      if (values != null && values.$children != null) {
        for (let child of values.$children) {
          switch (child.name) {
            // case Process.TASKSETTINGS_ASSIGNEE:
            //   returnValue.assigneeId = child.$body;
            //   break;
            case Process.TaskSettings.Description:
              returnValue.description = child.$body;
              break;
            case Process.TaskSettings.SendTaskReceiver: {
              try {
                returnValue.sendTaskReceiver = JSON.parse(child.$body);
              } catch (ex) {
                console.log(ex);
                
                returnValue.sendTaskReceiver = [];
              }
            }
              break;

            // case Process.TASKSETTINGS_JUMPSETTING:
            //   returnValue.jumpMode = child.$body as Process.JumpModeType;
            //   break;
            // case Process.TASKSETTINGS_JUMPVALUES: {
            //   let list: string[] = [];
            //   for (let possibleJumpId of child.$body.split(",")) {
            //     list.push(possibleJumpId);
            //   }
            //   returnValue.jumpValues = list;
            // }
            // break;
            case Process.TaskSettings.UserForm:
              returnValue.customFormSchemaString = child.$body;
              break;
            default:
              return;
          }
        }
      }
    }
    return returnValue;
  }

  public async loadProcess(processXmlStr: string): Promise<void> {
    return await new Promise<void>((resolve, reject): void => {
      if (processXmlStr != null) {
        this.moddle.fromXML(processXmlStr, (err: any, bpmnXml: any, bpmnContext: any) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          this.bpmnXml = bpmnXml;

          // fix für startevent
          let sequenceFlows: Bpmn.SequenceFlow[] = this.getSequenceFlowElements();
          for (let sequenceFlow of sequenceFlows) {
            if (sequenceFlow.sourceRef && sequenceFlow.sourceRef.outgoing == null) {
              sequenceFlow.sourceRef.outgoing = [];
            }
            if (sequenceFlow.sourceRef && sequenceFlow.sourceRef.outgoing.indexOf(sequenceFlow) == -1) {
              sequenceFlow.sourceRef.outgoing.push(sequenceFlow);
            }

            if (sequenceFlow.targetRef && sequenceFlow.targetRef.incoming == null) {
              sequenceFlow.targetRef.incoming = [];
            }
            if (sequenceFlow.targetRef && sequenceFlow.targetRef.incoming.indexOf(sequenceFlow) == -1) {
              sequenceFlow.targetRef.incoming.push(sequenceFlow);
            }
          }

          // fixes für boundary events
          let boundaryEvents: Bpmn.BoundaryEvent[] = this.getFlowElementsOfType<Bpmn.BoundaryEvent>(BPMN_BOUNDARYEVENT);
          
          // console.log(boundaryEvents);
          
          for ( let t of boundaryEvents ) {
            // console.log(this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs);
            
            if (this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs == null)
              this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs = [];

            if (!this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs.find(e => e.id == t.id))
              this.getExistingTask(this.processId(), t.attachedToRef.id).boundaryEventRefs.push(t);
          }
            
          // console.log(boundaryEvents);
          
          // fixes ende

          this.processDiagram = new BpmnProcessDiagram(this);

          resolve();
        });
      } else {
        console.log("XML string of process should not be null/undefined!");

        let stack = new Error().stack;
        console.log("PRINTING CALL STACK");
        console.log(stack);

        PH.Assert.isTrue(processXmlStr != null, "XML string of process should not be null/undefined!");
        reject();
      }
    });
  }

  public isOneOfNextActivityOfType(currentTaskId: string, type: ModdleElementType): boolean {
    let elem = this.getNextActivities(currentTaskId);
    for (let el of elem) {
      if (el.$type === type) {
        return true;
      }
    }
    return false;
  }

  public getNextActivities(currentTaskId: string): Bpmn.FlowNode[] {
    let currentTask = this.getExistingActivityObject(currentTaskId);
    PH.Assert.isTrue(currentTask != null, "An dieser Stelle darf currentTask nicht null sein!");
    PH.Assert.isTrue(currentTask != null, "An dieser Stelle darf currentTask nicht null sein!");
    PH.Assert.isTrue(currentTask.outgoing != null, "An dieser Stelle darf outgoing nicht null sein!");
    
    let tmpList = [];
    for (let task of currentTask.outgoing) {
      tmpList.push(task.targetRef);
    }
    return tmpList;
  }

  public getTaskIdsAfterGateway(currentGatewayId: string): Todo.DecisionTask[] {
    let currentObject: Bpmn.Gateway = this.getExistingActivityObject(currentGatewayId);
    let exclusiveGateway: Bpmn.ExclusiveGateway = null;
    if (currentObject.$type == BPMN_EXCLUSIVEGATEWAY)
      exclusiveGateway = currentObject as Bpmn.ExclusiveGateway;
    else
      return null;
    // A -> X -> B & C | A -> X1 -> (X2 -> C) & B

    return this.getDecisionTasksAfterGateway(exclusiveGateway);
  }

  public getDecisionTasksAfterGateway(gat: Bpmn.ExclusiveGateway, routeStack: string[] = null): Todo.DecisionTask[] {
    let decisionTasks: Todo.DecisionTask[] = [];
    for (let processObject of gat.outgoing) {
      let tmpRes = null;
      // let tmpRouteStack = routeStack == null ? [] : _.cloneDeep(routeStack);
      // if (processObject.targetRef.$type == BPMN_EXCLUSIVEGATEWAY) {
      //   tmpRouteStack.push(processObject.targetRef.id);
      //   tmpRes = getDecisionTasksAfterGateway(processObject.targetRef as Bpmn.ExclusiveGateway, tmpRouteStack);
      // }

      // wenn es kein gateway ist dann füge zusammen
      if (tmpRes != null) {
        decisionTasks.concat(tmpRes);
      } else {
        let taskId: string = processObject.targetRef.id;

        let nameValue: string = processObject.targetRef.name;
        if (nameValue == null) {
          switch (processObject.targetRef.$type) {
            case BPMN_ENDEVENT:
              nameValue = PH.tl("Ende");
              break;
            case BPMN_EXCLUSIVEGATEWAY:
              nameValue = PH.tl("Gateway");
              break;
            default:
              nameValue = processObject.targetRef.$type;
          }
        }

        decisionTasks.push({
          bpmnTaskId: taskId,
          name: nameValue,
          type: Todo.DecisionTaskTypes.Normal,
          isBoundaryEvent: false
          // routeStack: tmpRouteStack
        } as Todo.DecisionTask);
      }
    }
    return decisionTasks;
  }

  public async loadFromTemplate(): Promise<Process.LoadTemplateReply> {
    let result: Process.LoadTemplateReply = await BpmnModdleHelper.createBpmnTemplate(this.moddle);

    this.bpmnXml = result.bpmnXml;

    return result;
  }

  public setParticipantsName(name: string): void {
    this.getCollaboration().participants[0].name = name;
  }

  private getCollaboration(): Bpmn.Collaboration {
    return this.bpmnXml.rootElements.find(e => e.$type === "bpmn:Collaboration") as Bpmn.Collaboration;
  }

  // Suchfunktionen, siehe
  // https://github.com/paed01/bpmn-engine/blob/master/lib/context-helper.js
  public static getBpmnId(type: string = "", createdId: string = ""): string {
    let newId: string = "";

    // am Doppelpunkt wird nur gesplittet wenn auch einer vorhanden ist
    if (type !== "" && type.indexOf(":") > -1) {
      let splittedType: string[] = type.split(":");
      newId = splittedType[splittedType.length - 1] + "_";
    }

    if (createdId !== "") {
      newId += createdId;
      return newId;
    }

    newId += PH.Tools.createId();
    return newId;
  }

  public getProcesses(): Bpmn.RootElement[] {
    return this.bpmnXml.rootElements.filter((e) => e.$type === BPMN_PROCESS);
  }

  public getProcess(processId: string): Bpmn.Process {
    return this.bpmnXml.rootElements.find((e) => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
  }

  public getStartEvent(processId: string): BpmnModdleHelper.BpmnModdleStartEvent {
    let events = this.getEvents(processId, BPMN_STARTEVENT);
    if (events != null && events.length >= 1)
      return events[0] as BpmnModdleHelper.BpmnModdleStartEvent;
  }

  public getEndEvent(processId: string): BpmnModdleHelper.BpmnModdleEndEvent {
    let events = this.getEvents(processId, BPMN_ENDEVENT);
    if (events != null && events.length >= 1)
      return events[0] as BpmnModdleHelper.BpmnModdleEndEvent;
  }

  private getEvents(processId: string, eventType: string): Bpmn.FlowElement[] {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowElement[] = process.flowElements.filter((e: Bpmn.FlowElement) => e.$type === eventType);

    return flowElements;
  }

  private getLastCreatedTask(processId: string): Bpmn.Task {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowElement[] = process.flowElements.filter(
      (e: Bpmn.FlowElement) =>
        e.$type === BPMN_TASK
        || e.$type === BPMN_STARTEVENT
      // || e.$type === BPMN_ENDEVENT
    );

    if (flowElements != null && flowElements.length > 0) {
      let tmpObject: Bpmn.FlowElement = flowElements[flowElements.length - 1];

      return tmpObject as Bpmn.Task;
    }
    return null;
  }

  public getProcessDiagram() {
    return this.processDiagram;
  }

  public getExistingTask(processId: string, taskId: string): Bpmn.Task {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === BPMN_TASK || e.$type === BPMN_SENDTASK));
    let task = flowElements.find(element => element.id == taskId);

    return task as Bpmn.Task;
  }

  public getAllExclusiveGateways(): Bpmn.FlowNode[] {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === this.processId()) as Bpmn.Process;
    let flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === BPMN_EXCLUSIVEGATEWAY));
    return flowElements;
  }

  public getExistingActivityObject(objectId: string): Bpmn.Activity {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === this.processId()) as Bpmn.Process;
    let flowElement: Bpmn.Activity = process.flowElements.find((e: Bpmn.Activity) => (e.id === objectId));
    return flowElement;
  }

  private getProcessLanes(processId: string): Bpmn.Lane[] {
    let processContext: Bpmn.Process = this.getProcess(processId);
    return processContext.laneSets[0].lanes;
  }

  public getTaskToLaneMap(): PH.Process.TaskToLaneMapEntry[] {
    let resultMap: PH.Process.TaskToLaneMapEntry[] = [];
    let lanes = this.getProcessLanes(this.processId());

    for (let lane of lanes) {
      let mapForLane = lane.flowNodeRef ? lane.flowNodeRef.filter(node => (node.$type == BPMN_TASK || node.$type == BPMN_SENDTASK || node.$type == BPMN_EXCLUSIVEGATEWAY)) : null;
      let mapForLaneNodes = null;
      if (mapForLane != null) {
        mapForLaneNodes = mapForLane.map(taskNode => {
          return { taskId: taskNode.id, laneId: lane.id };
        });
      }

      if (mapForLaneNodes != null) {
        resultMap = resultMap.concat(mapForLaneNodes);
      }
    }
    return resultMap;
  }

  public getProcessLane(processId: string, laneId: string): Bpmn.Lane {
    let processLanes: Bpmn.Lane[] = this.getProcessLanes(processId);
    if (processLanes) {
      return processLanes.find((lane) => lane.id === laneId);
    } else {
      return null;
    }
  }

  private removeSequenceFlow(processId: string, sequenceFlowObject: Bpmn.SequenceFlow): void {
    let process: Bpmn.Process = this.getProcess(processId);
    let index: number = process.flowElements.indexOf(sequenceFlowObject);

    if (index > -1) {
      process.flowElements.splice(index, 1);
    } else {
      console.log("Error: cannot find SequenceFlow to remove.");
    }
  }

  public static addOrUpdateExtension(task: Bpmn.Task, key: Process.TaskSettings, value: any, extensionValueType: Process.TaskSettingsValueType): void {

    if (extensionValueType === "List") {
      value = JSON.stringify(value);
    }

    let extensionElement;
    if (!task.extensionElements || task.extensionElements.values == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      task.extensionElements = extensions;
    }

    if (task.extensionElements.values.length === 0) {
      BpmnModdleHelper.addTaskExtensionInputText(task.extensionElements, key, value);
      task.extensionElements = task.extensionElements;
    } else {

      for (let extension of task.extensionElements.values) {
        if (extension.$children != null) {
          extensionElement = extension.$children.find(e => e.name === key);
        }
      }

      if (!extensionElement) {
        BpmnModdleHelper.addTaskExtensionInputText(task.extensionElements, key, value);
      } else {
        extensionElement.$body = value;
      }
    }
  }

  public addLane(processId: string, id: string, name: string): string {
    // Weitere Lane (=Rolle) anlegen
    let lane = this.moddle.create(BPMN_LANE, { id: id, name: name, flowNodeRef: [] });

    let processContext: Bpmn.Process = this.getProcess(processId);
    // Check für undefined
    if (processContext.laneSets[0].lanes == null) {
      processContext.laneSets[0].lanes = [];
    }

    processContext.laneSets[0].lanes.push(lane);
    return id;
  }

  public removeTaskObjectFromLanes(processId: string, taskObject: Bpmn.BaseElement): void {
    let lanes: Bpmn.Lane[] = this.getProcessLanes(processId);

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
      let laneObject = lanes[laneIndex];
      if (laneObject.flowNodeRef != null) {
        laneObject.flowNodeRef = laneObject.flowNodeRef.filter((flowObj) => flowObj.id !== taskObject.id);
      }
    }
    lanes = lanes.filter(lane => {
      if (lane.flowNodeRef != null) {
        return lane.flowNodeRef.length > 0;
      } else {
        // Wenn flowNodeRef == null, dann ist die Lane erst hinzugefügt worden und darf nicht gelöscht werden, da im nächsten Schritt die Tasks hinzugefügt werden
        return false;
      }
    });
  }

  private addTaskToLane(processId: string, laneId: string, taskObject: Bpmn.BaseElement): void {
    // task objekt wieder zur neuen rolle hinzufügen
    // process in lane einfügen // ID von selected Role in der UI entspricht der LaneID
    if (laneId != null) {
      let laneObject = this.getProcessLane(processId, laneId);
      if (laneObject.flowNodeRef == null) {
        laneObject.flowNodeRef = [];
      }

      if (laneObject.flowNodeRef.indexOf(taskObject) === -1) {
        laneObject.flowNodeRef.push(taskObject);
      }
    }
  }

  private setRoleForTask(processId: string, laneId: string, taskObject: Bpmn.BaseElement): void {
    // laneId wird mitgegeben, dass eine leere Lane nicht gelöscht wird
    this.removeTaskObjectFromLanes(processId, taskObject);
    this.addTaskToLane(processId, laneId, taskObject);
  }

  // löscht einen Task aus dem XML und dem Diagramm
  public deleteTask(processId: string, rowDetails: Process.RowDetails): void {
    let processContext = this.getProcess(processId);

    // Auch hier wird nach folgendem Beispiel vorgegangen
    // A -[AB]-> B -[BC]-> C
    // B wird gelöscht und dann soll folgendes übrig bleiben: A -[A(B)C]-> C
    // Hierbei wird die ausgehende Verbindung modifiziert und die eingehende ebenfalls gelöscht
    // 1. [AB] löschen
    // 2. B löschen
    // 3. [BC] bekommt als sourceRef A
    // 4. A bekommt als outgoing [BC]
    let objectToDelete_B = this.getExistingTask(processId, rowDetails.taskId);
    PH.Assert.isTrue(objectToDelete_B.incoming.length == 1, "SequenceFlow Länge muss hier 1 sein!");
    let sequenceFlow_AB: Bpmn.SequenceFlow = objectToDelete_B.incoming[0];
    let object_A: Bpmn.FlowNode = sequenceFlow_AB.sourceRef;
    PH.Assert.isTrue(objectToDelete_B.outgoing.length == 1, "SequenceFlow Länge muss hier 1 sein!");
    let sequenceFlow_BC: Bpmn.SequenceFlow = objectToDelete_B.outgoing[0];

    // 1. & 2. Elemente aus flowElements löschen
    for (let index = 0; index < processContext.flowElements.length; index++) {
      let element = processContext.flowElements[index];
      if (element.id === sequenceFlow_AB.id || element.id === objectToDelete_B.id) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }

    // 3.
    PH.Assert.isTrue(object_A != null);
    sequenceFlow_BC.sourceRef = object_A;

    // 4.
    // Array zuerst leeren! Da hier nur ein Element im Array sein darf!
    object_A.outgoing = [];
    object_A.outgoing.push(sequenceFlow_BC);

    PH.Assert.isTrue(object_A.outgoing.length === 1, "A darf hier nur einen outgoing Flow haben!");

    // Task aus lane entfernen
    let processLanes: Bpmn.Lane[] = this.getProcessLanes(processId);

    for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
      let processLane: Bpmn.Lane = processLanes[laneIndex];
      if (processLane.flowNodeRef != null) {
        for (let index = 0; index < processLane.flowNodeRef.length; index++) {
          let flowNode: Bpmn.FlowNode = processLane.flowNodeRef[index];
          if (flowNode.id === rowDetails.taskId) {
            processLane.flowNodeRef.splice(index, 1);
            index--; // Wegen splicen
          }
        }
      }

      // Lane ist komplett leer --> aus laneset entfernen
      // lane soll auch entfernt werden, wenn nur noch start oder endevent in der lane ist. (kommt vom diagram und wird beim nächsten "zeichen" automatisch wieder hinzugefügt!)
      if (processLane.flowNodeRef == null || processLane.flowNodeRef.length === 0 || (processLane.flowNodeRef.length === 1 && (processLane.flowNodeRef[0].$type === BPMN_ENDEVENT || processLane.flowNodeRef[0].$type === BPMN_STARTEVENT))) {
        processLanes.splice(laneIndex, 1);
        laneIndex--; // Wegen splicen
      }
    }

    this.processDiagram.generateBPMNDiagram(processId);
  }

  // damit die Komplexität der Methode nicht zu groß wird beschränken wir uns hier auf das Wechseln des Tasks "nach vorne"
  // TODO PP check method and test
  public switchTaskWithNextTask(processId: string, rowDetails: Process.RowDetails): void {

    // LESEN:
    // Komplexität wird durch einfaches Beispiel versucht zu erklären und umzusetzen
    // R -[RA]-> A -[AB]-> B -[BS]-> S  --- A und B sollen getauscht werden
    // folgende Dinge müssen geändert werden:
    // 1. Im SequenceFlow Object [RA] muss B als targetRef gesetzt werden
    // 2. A bekommt als Incoming SequenceFlow [AB]
    // 3. A bekommt als Outgoing SequenceFlow [BS]
    // 4. SequenceFlow Objekt [AB] bekommt als sourceRef B und als targetRef A
    // 5. SequenceFlow Objekt [BS] bekommt als sourceRef A
    // 6. B bekommt als Incoming SeqenceFlow [RA]
    // 7. B bekommt als Outgoing SeqenceFlow [AB]

    let objectToSwitch_A: Bpmn.UserTask = this.getExistingTask(processId, rowDetails.taskId) as Bpmn.UserTask;
    // über die Referenzen auf den SequenceFlow wird der Ziel Task geholt
    PH.Assert.isTrue(objectToSwitch_A.outgoing.length === 1, "A darf vor dem Start nur 1 outgoing haben!");
    let objectToSwitch_B: Bpmn.FlowNode = objectToSwitch_A.outgoing[0].targetRef;

    PH.Assert.isTrue(objectToSwitch_A.incoming.length === 1, "A darf vor dem Start nur 1 incoming haben!");
    PH.Assert.isTrue(objectToSwitch_B.outgoing.length === 1, "B darf vor dem Start nur 1 outgoing haben!");
    let sequenceFlow_RA: Bpmn.SequenceFlow = objectToSwitch_A.incoming[0];
    let sequenceFlow_AB: Bpmn.SequenceFlow = objectToSwitch_A.outgoing[0];
    let sequenceFlow_BS: Bpmn.SequenceFlow = objectToSwitch_B.outgoing[0];

    // 1.
    sequenceFlow_RA.targetRef = objectToSwitch_B;
    // 2.
    // muss geleert werden, da sonst mehrere incomings
    objectToSwitch_A.incoming = [];
    objectToSwitch_A.incoming.push(sequenceFlow_AB);
    PH.Assert.isTrue(objectToSwitch_A.incoming.length === 1, "A darf nur 1 incoming haben!");
    // 3.
    // muss geleert werden, da sonst mehrere outgoings
    objectToSwitch_A.outgoing = [];
    objectToSwitch_A.outgoing.push(sequenceFlow_BS);
    PH.Assert.isTrue(objectToSwitch_A.outgoing.length === 1, "A darf nur 1 outgoing haben!");
    // 4.
    sequenceFlow_AB.sourceRef = objectToSwitch_B;
    sequenceFlow_AB.targetRef = objectToSwitch_A;
    // 5.
    sequenceFlow_BS.sourceRef = objectToSwitch_A;
    // 6.
    // muss geleert werden, da sonst mehrere incomings
    objectToSwitch_B.incoming = [];
    objectToSwitch_B.incoming.push(sequenceFlow_RA);
    PH.Assert.isTrue(objectToSwitch_B.incoming.length === 1, "B darf nur 1 incoming haben!");
    // 7.
    // muss geleert werden, da sonst mehrere outgoings
    objectToSwitch_B.outgoing = [];
    objectToSwitch_B.outgoing.push(sequenceFlow_AB);
    PH.Assert.isTrue(objectToSwitch_B.outgoing.length === 1, "B darf nur 1 outgoing haben!");

    this.processDiagram.generateBPMNDiagram(processId);
  }

  // in erster Implementierung wird jeder Weitere Prozess an den letzten angelegten angehängt!
  public addOrModifyTask(processId: string, rowDetails: Process.RowDetails): string {
    // Weiteren Prozess einfügen
    let id: string;
    if (rowDetails.taskId == null) {
      id = BpmnProcess.getBpmnId(BPMN_TASK);
      rowDetails.taskId = id;
    }

    let lastCreatedTask = this.getLastCreatedTask(processId);

    let focusedTask: Bpmn.UserTask = this.getExistingTask(processId, rowDetails.taskId) as Bpmn.UserTask;
    let processContext: Bpmn.Process = this.getProcess(processId);

    let isNewTask: boolean = false;

    if (focusedTask == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      focusedTask = this.moddle.create(BPMN_TASK, { id: rowDetails.taskId, name: rowDetails.task, extensionElements: extensions, incoming: [], outgoing: [] });
      processContext.flowElements.push(focusedTask);
      isNewTask = true;
    } else {
      id = focusedTask.id;
      focusedTask.name = rowDetails.task;
    }

    // entfernt den task aus einer lane und fügt ihn der neu angegebenen hinzu (fürs bearbeiten)
    // let laneId: string = BpmnProcess.getBpmnId(BPMN_LANE, rowDetails.selectedRole);    
    this.setRoleForTask(processId, rowDetails.laneId, focusedTask);

    // MUSS nochmal überarbeitet werden, da die Code Komplexität extrem erhöht wird
    if (lastCreatedTask != null && lastCreatedTask.id !== focusedTask.id && isNewTask) {
      // Sequenz wird erstellt -> wird benötigt für vorherigen Prozess und für erstellten Prozess
      // VORSICHT! Hier müssen die "Objekte" übergeben werden anstatt der ID!
      this.addSequenceFlow(processId, lastCreatedTask, focusedTask);

      // lastCreatedTask.outgoing.push(sequenceObject);
      // focusedTask.incoming.push(sequenceObject);

      // füge sequenz zum Endevent hinzu
      let endEventObject = this.getEndEvent(processId);

      // zuerst alten sequenzFlow auf EndEvent löschen
      this.removeSequenceFlow(processId, endEventObject.incoming[0]);

      this.addSequenceFlow(processId, focusedTask, endEventObject);
      // endEventObject.incoming.push(sequenceEndObject);
      // focusedTask.outgoing.push(sequenceEndObject);
    }

    this.processDiagram.generateBPMNDiagram(processId);
    return rowDetails.taskId;
  }

  private addSequenceFlow(processId: string, sourceReference: Bpmn.FlowNode, targetReference: Bpmn.FlowNode): Bpmn.SequenceFlow {
    let processContext = this.getProcess(processId);
    // Weiteren Sequenzfluss einfügen
    let id = BpmnProcess.getBpmnId(BPMN_SEQUENCEFLOW);
    let sequenceFlow = this.moddle.create(BPMN_SEQUENCEFLOW, { id: id, targetRef: targetReference, sourceRef: sourceReference });

    processContext.flowElements.push(sequenceFlow);

    if (sourceReference.$type === BPMN_STARTEVENT) {
      PH.Assert.isTrue(sourceReference.outgoing.length == 1, "Das Start EVENT darf nur 1 Verbindung (outgoing) haben!" + sourceReference.outgoing.length);
    }
    sourceReference.outgoing.splice(0, 1);
    if (targetReference.$type === BPMN_ENDEVENT) {
      PH.Assert.isTrue(targetReference.incoming.length == 1, "Das End EVENT darf nur 1 Verbindung (incoming) haben! " + targetReference.incoming.length);
    }
    targetReference.incoming.splice(0, 1);

    targetReference.incoming.push(sequenceFlow);
    sourceReference.outgoing.push(sequenceFlow);

    return sequenceFlow;
  }

  public async toXmlString(): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      this.moddle.toXML(this.bpmnXml, { format: true }, function (err: any, xmlStr: string) {
        if (err) reject(err);
        resolve(xmlStr);
      });
    }).catch((reason) => {
      console.log(reason);
      return null;
    });
  }

  //  Diagramm Komponente 
  // Gibt die notwendigen Elemente für die Erstellung des Diagram-Pars im XML zurück
  public getCollaborationElements(): BpmnModdleHelper.BpmnModdleCollaboration[] {
    let elements = this.bpmnXml.rootElements.filter((e: any) => e.$type === BPMN_COLLABORATION) as Bpmn.Collaboration[];
    return elements;
  }

  public getSortedLanesWithTasks(processId: string): Bpmn.Lane[] {
    let laneElementsList: Bpmn.Lane[] = this.getLanes(processId);

    // Testweise sortiert
    let sortedLaneElementsList = [];

    let sortedTaskIds: string[] = this.getSortedTasks(processId).map(t => t.id);

    let laneOfLastTask: any;

    for (let taskId of sortedTaskIds) {
      for (let laneElement of laneElementsList) {
        for (let flowNodeRefObject of laneElement.flowNodeRef) {
          if (taskId === flowNodeRefObject.id) {
            // wird hier zwischen gespeichert, dass das end event hinter dem letzten element kommt
            laneOfLastTask = laneElement;
            if (sortedLaneElementsList.indexOf(laneElement) > -1) {
              // console.log("Already in sorted Lanelist.");
            } else {
              sortedLaneElementsList.push(laneElement);
            }
          }
        }
      }
    }

    // Start und Ende aus Lanes entfernen und dann neu hinzufügen
    this.removeTaskObjectFromLanes(processId, this.getStartEvent(processId));
    this.removeTaskObjectFromLanes(processId, this.getEndEvent(processId));

    let laneOfStartEvent: Bpmn.Lane = null;
    let laneOfEndEvent: Bpmn.Lane = null;

    if (sortedLaneElementsList.length === 0) {
      let allLanes: Bpmn.Lane[] = this.getLanes(processId, false);
      if (allLanes.length > 0) {
        laneOfStartEvent = allLanes[0];
        laneOfEndEvent = allLanes[0];
      }
    } else {
      laneOfStartEvent = sortedLaneElementsList[0];
      laneOfEndEvent = laneOfLastTask;
    }

    if (laneOfStartEvent != null && laneOfEndEvent != null) {
      this.addTaskToLane(processId, laneOfStartEvent.id, this.getStartEvent(processId));
      this.addTaskToLane(processId, laneOfEndEvent.id, this.getEndEvent(processId));
    }

    return sortedLaneElementsList;
  }

  // Wenn onlyLanesWithTasks true ist, dann werden nur lanes zurückgegeben die einen Task inne haben
  public getLanes(processId: string, onlyLanesWithTasks: boolean = true): Bpmn.Lane[] {
    let laneElementsList: Bpmn.Lane[] = [];
    let processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e: any) => e.$type === BPMN_PROCESS) as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      let laneSetElements: Bpmn.LaneSet[] = processes[i].laneSets.filter((e: any) => e.$type === BPMN_LANESET);
      for (let t = 0; t < laneSetElements.length; t++) {

        if (laneSetElements[t].lanes != null) {
          laneElementsList = laneSetElements[t].lanes.filter(lane => {
            if (onlyLanesWithTasks) {
              if (lane.flowNodeRef != null && lane.flowNodeRef.length > 0) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          });
        }
      }
    }

    return laneElementsList;
  }

  public getLaneOfTask(taskId: string): Bpmn.Lane {
    let laneElement: Bpmn.Lane = null;
    let processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e: any) => e.$type === BPMN_PROCESS) as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      let laneSetElements: Bpmn.LaneSet[] = processes[i].laneSets.filter((e: any) => e.$type === BPMN_LANESET);
      for (let t = 0; t < laneSetElements.length; t++) {

        if (laneSetElements[t].lanes != null) {
          laneElement = laneSetElements[t].lanes.find(lane => {
            if (lane.flowNodeRef != null) {
              let flowObj = lane.flowNodeRef.find(fo => fo.id === taskId);
              if (flowObj != null)
                return true;
            }
            return false;
          });
        }
      }
    }
    return laneElement;
  }

  public getStartLaneId(): string {
    let startEvent = this.getStartEvent(this.processId());
    if (startEvent != null) {
      let startLane = this.getLaneOfTask(startEvent.id);
      if (startLane != null)
        return startLane.id;
    }

    return null;
  }

  public getSortedTasks(processId: string): Bpmn.Task[] {
    let startEventObject: BpmnModdleHelper.BpmnModdleStartEvent = this.getStartEvent(processId);

    let taskObject = startEventObject.outgoing[0].targetRef;

    let sortedTasks: Bpmn.Task[] = [];

    // taskObject wird zuerst auf Start event gesetzt!
    while (taskObject.$type !== BPMN_ENDEVENT) {
      if ((taskObject.$type === "bpmn:UserTask" || taskObject.$type === "bpmn:SendTask") && sortedTasks.find(e => e.id == taskObject.id) == null) {
        sortedTasks.push(taskObject as Bpmn.Task);
      } else if (sortedTasks.find(e => e.id == taskObject.id) != null) {
        break; // Vermeidung Endlosschleife
      }
      taskObject = taskObject.outgoing[0].targetRef;
    }

    // Liste enthält nur einen Pfad nach Gateways und ist daher nicht unbedingt vollständig
    // Nochmals alle Tasks iterieren und fehlende Tasks anfügen
    let tasks = this.getEvents(processId, BPMN_TASK);
    if (tasks != null) {
      tasks.map(task => {
        if (sortedTasks.find(e => e.id == task.id) == null) {
          sortedTasks.push(task as Bpmn.Task);
        }
      });
    }

    return sortedTasks;
  }

  private getFlowElementsOfType<T extends Bpmn.BaseElement>(type: BpmnModdleHelper.ModdleElementType): T[] {
    let elements: T[] = [];
    let processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e) => e.$type === BPMN_PROCESS) as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      let flowElements: Bpmn.FlowElement[] = processes[i].flowElements.filter((e) => {
        return e.$type === type;
      });
      // Jeder SeqenceFlow soll direkt in der Liste sein
      for (let i = 0; i < flowElements.length; i++) {
        let element = flowElements[i] as T;
        elements.push(element);
      }
    }

    return elements;
  }

  public getSequenceFlowElements(): Bpmn.SequenceFlow[] {
    let sequenceFlows = [];
    let processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter(e => e.$type === BPMN_PROCESS) as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      let flowElements: Bpmn.FlowElement[] = processes[i].flowElements.filter((e) => {
        return e.$type === BPMN_SEQUENCEFLOW;
      });

      // Jeder SeqenceFlow soll direkt in der Liste sein
      for (let seqFlow of flowElements) {
        let s = seqFlow as Bpmn.SequenceFlow;
        sequenceFlows.push(s);
      }
    }

    return sequenceFlows;
  }

  public getLaneNumberOfElement(element: any, laneDictionaries: LaneDictionary[]): number {
    for (let laneDictionary of laneDictionaries) {
      let index: number = laneDictionary.ObjectIdsInLane.indexOf(element.id);
      if (index > -1) {
        return laneDictionary.rowNumber;
      }
    }
    return null;
  }

  public static getTaskDescription(task: Bpmn.Task): string {
    if (task.extensionElements && task.extensionElements.values) {
      const phInOut = task.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
      if (phInOut && phInOut.$children) {
        const descriptionElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === Process.TaskSettings.Description);
        if (descriptionElement && descriptionElement.$body) {
          return descriptionElement.$body;
        }
      }
    }
    return null;
  }

  public static setTaskDescription(task: Bpmn.Task, description: string): void {
    const bpmnModdle = new BpmnModdle([], {});
    if (!task.extensionElements) {
      task.extensionElements = bpmnModdle.create("bpmn:ExtensionElements", { values: [] });
    }
    let phInOut = task.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
    if (!phInOut) {
      phInOut = bpmnModdle.createAny("processhub:inputOutput", "http://processhub.com/schema/1.0/bpmn", { $children: [] });
      task.extensionElements.values.push(phInOut);
    }
    let descriptionElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === Process.TaskSettings.Description);
    if (!descriptionElement) {
      descriptionElement = bpmnModdle.createAny("processhub:inputParameter", "http://processhub.com/schema/1.0/bpmn", { name: Process.TaskSettings.Description });
      phInOut.$children.push(descriptionElement);
    }

    if (description != null)
      descriptionElement.$body = description;
    else
      descriptionElement.$body = "";
  }
}
