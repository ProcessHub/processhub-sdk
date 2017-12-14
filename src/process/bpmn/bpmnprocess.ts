import * as BpmnModdleHelper from "./bpmnmoddlehelper";
import * as Todo from "../../todo";
import { FieldDefinition } from "../../data/datainterfaces";
import { updateLegacyFieldDefinitions } from "../../data/datatools";
import { LaneDictionary } from "./bpmnprocessdiagram";
import { BpmnProcessDiagram } from "./bpmnprocessdiagram";
import BpmnModdle = require("bpmn-moddle");
import { Bpmn, Bpmndi } from "../bpmn";
import { Processhub } from "modeler/bpmn/processhub";
import { ModdleElementType } from "./bpmnmoddlehelper";
import { RunningTaskLane, TaskToLaneMapEntry, TaskExtensions, TaskSettings, TaskSettingsValueType } from "../processinterfaces";
import { isTrue, equal } from "../../tools/assert";
import { tl } from "../../tl";
import { createId } from "../../tools/guid";
import { InstanceDetails } from "../../instance/instanceinterfaces";
import { DecisionTask, DecisionTaskTypes, filterTodosForInstance } from "../../todo";
import { LoadTemplateReply } from "../legacyapi";
import { RowDetails } from "../phclient";

export const BPMN_PROCESS = "bpmn:Process";
export const BPMN_COLLABORATION = "bpmn:Collaboration";
export const BPMN_PARTICIPANT = "bpmn:Participant";
export const BPMN_USERTASK = "bpmn:UserTask";
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
      } else if (exGat.outgoing != null && exGat.outgoing.length == 1) {
        exGat.outgoing[exGat.outgoing.length - 1].conditionExpression = null;
      }
    }
  }

  public getFieldDefinitions(): FieldDefinition[] {
    let fieldDefinitions: FieldDefinition[] = [];

    let process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === BPMN_PROCESS) as Bpmn.Process;
    process.flowElements.map(flowElement => {
      let extVals = BpmnProcess.getExtensionValues(flowElement);
      if (extVals) {
        let taskFields = BpmnProcess.getExtensionValues(flowElement).fieldDefinitions;
        if (taskFields && taskFields.length > 0) {
          // currently all tasks have their own fieldDefinitions. It might happen that they have different configs
          // -> add the first one we find to the result set
          taskFields.map(taskField => {
            if (fieldDefinitions.find(fieldDefinition => fieldDefinition.name == taskField.name) == null)
              fieldDefinitions.push(taskField);
          });
        }
      }
    });

    return fieldDefinitions;
  }

  public getFieldDefinitionsForTask(taskObject: Bpmn.Task | Bpmn.Activity): FieldDefinition[] {
    let extVals = BpmnProcess.getExtensionValues(taskObject);
    if (extVals)
      return extVals.fieldDefinitions;
    else
      return null;
  }

  public static getExtensionValues(taskObject: Bpmn.Task | Bpmn.Activity): TaskExtensions {
    let returnValue: TaskExtensions = {
      description: null,
      fieldDefinitions: null,
      sendTaskReceiver: null,
      sendTaskInstanceLink: true,
      sendTaskSubject: null,
      sendTaskWithFieldContents: true,
      allFieldsEditable: true
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
            case TaskSettings.Description:
              returnValue.description = child.$body;
              break;
            case TaskSettings.SendTaskSubject:
              returnValue.sendTaskSubject = child.$body;
              break;
            case TaskSettings.SendTaskInstanceLink:
              returnValue.sendTaskInstanceLink = child.$body == "true";
              break;
            case TaskSettings.SendTaskWithFieldContents:
              returnValue.sendTaskWithFieldContents = child.$body != "false";
              break;
            case TaskSettings.AllFieldsEditable:
              returnValue.allFieldsEditable = child.$body != "false";
              break;
            case TaskSettings.SendTaskReceiver: {
              try {
                returnValue.sendTaskReceiver = JSON.parse(child.$body);
              } catch (ex) {
                console.log(ex);

                returnValue.sendTaskReceiver = [];
              }
            }
              break;
            case TaskSettings.UserForm:
              returnValue.fieldDefinitions = updateLegacyFieldDefinitions(JSON.parse(child.$body));
              break;
            default:
              return;
          }
        }
      }
    }
    return returnValue;
  }

  public async loadXml(processXmlStr: string): Promise<void> {
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

          for (let t of boundaryEvents) {
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

        isTrue(processXmlStr != null, "XML string of process should not be null/undefined!");
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

    let tmpList: Bpmn.FlowNode[] = [];

    if (currentTask == null) {
      console.error("getNextActivities: currentTask may not be null");
      return tmpList;
    }
    if (currentTask.outgoing == null) {
      if (currentTask.$type !== "bpmn:EndEvent") {
        console.warn("getNextActivities: currentTask.outgoing should not be null");
      }
      return tmpList;
    }

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

  public getDecisionTasksAfterGateway(gat: Bpmn.ExclusiveGateway, rootTaskId: string = null): Todo.DecisionTask[] {
    let decisionTasks: Todo.DecisionTask[] = [];
    for (let processObject of gat.outgoing) {
      let tmpRes = null;
      // let tmpRouteStack = routeStack == null ? [] : _.cloneDeep(routeStack);
      if (processObject.targetRef.$type == BPMN_EXCLUSIVEGATEWAY && processObject.targetRef.outgoing.length == 1) {
        // if (processObject.targetRef.outgoing.length == 1)
        tmpRes = this.getDecisionTasksAfterGateway(processObject.targetRef as Bpmn.ExclusiveGateway, processObject.targetRef.id);
        //   tmpRouteStack.push(processObject.targetRef.id);
        //   tmpRes = getDecisionTasksAfterGateway(processObject.targetRef as Bpmn.ExclusiveGateway, tmpRouteStack);
      }

      // wenn es kein gateway ist dann füge zusammen
      if (tmpRes != null) {
        decisionTasks = decisionTasks.concat(tmpRes);
      } else {
        let taskId: string = processObject.targetRef.id;
        if (rootTaskId != null)
          taskId = rootTaskId;

        let nameValue: string = processObject.targetRef.name;
        if (nameValue == null) {
          switch (processObject.targetRef.$type) {
            case BPMN_ENDEVENT:
              nameValue = tl("Ende");
              break;
            case BPMN_EXCLUSIVEGATEWAY:
              nameValue = tl("Gateway");
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

  public async loadFromTemplate(): Promise<LoadTemplateReply> {
    let result: LoadTemplateReply = await BpmnModdleHelper.createBpmnTemplate(this.moddle);

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

    newId += createId();
    return newId;
  }

  public getProcesses(): Bpmn.RootElement[] {
    return this.bpmnXml.rootElements.filter((e) => e.$type === BPMN_PROCESS);
  }

  public getProcess(processId: string): Bpmn.Process {
    return this.bpmnXml.rootElements.find((e) => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
  }

  /**
   * Get the StartEvents of the process
   * @param processId process id
   * @returns {Bpmn.StartEvent[]} the start events of the process
   */
  public getStartEvents(processId: string): Bpmn.StartEvent[] {
    return this.getEvents(processId, BPMN_STARTEVENT) as Bpmn.StartEvent[];
  }

  public getEndEvents(processId: string): BpmnModdleHelper.BpmnModdleEndEvent[] {
    return this.getEvents(processId, BPMN_ENDEVENT) as BpmnModdleHelper.BpmnModdleEndEvent[];
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
        e.$type === BPMN_USERTASK
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
    let flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === BPMN_STARTEVENT || e.$type === BPMN_ENDEVENT || e.$type === BPMN_USERTASK || e.$type === BPMN_SENDTASK));
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

  public getTaskToLaneMap(): TaskToLaneMapEntry[] {
    let resultMap: TaskToLaneMapEntry[] = [];
    let lanes = this.getProcessLanes(this.processId());

    for (let lane of lanes) {
      let mapForLane = lane.flowNodeRef ? lane.flowNodeRef.filter(node => (node.$type == BPMN_USERTASK || node.$type == BPMN_SENDTASK || node.$type == BPMN_EXCLUSIVEGATEWAY)) : null;
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

  public static addOrUpdateExtension(task: Bpmn.Task | Bpmn.Activity, key: TaskSettings, value: any, extensionValueType: TaskSettingsValueType): void {

    if (extensionValueType === "List") {
      value = JSON.stringify(value);
    }

    if (extensionValueType === "Boolean") {
      value = Boolean(value).toString();
    }

    if (value == null)
      value = "";

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
    // add an additional lane (=role)
    let lane = this.moddle.create(BPMN_LANE, { id: id, name: name, flowNodeRef: [] });

    let processContext: Bpmn.Process = this.getProcess(processId);
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
  public deleteTask(processId: string, rowDetails: RowDetails): void {
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
    isTrue(objectToDelete_B.incoming.length == 1, "SequenceFlow Länge muss hier 1 sein!");
    let sequenceFlow_AB: Bpmn.SequenceFlow = objectToDelete_B.incoming[0];
    let object_A: Bpmn.FlowNode = sequenceFlow_AB.sourceRef;
    isTrue(objectToDelete_B.outgoing.length == 1, "SequenceFlow Länge muss hier 1 sein!");
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
    isTrue(object_A != null);
    sequenceFlow_BC.sourceRef = object_A;

    // 4.
    // Array zuerst leeren! Da hier nur ein Element im Array sein darf!
    object_A.outgoing = [];
    object_A.outgoing.push(sequenceFlow_BC);

    isTrue(object_A.outgoing.length === 1, "A darf hier nur einen outgoing Flow haben!");

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
    }

    this.processDiagram.generateBPMNDiagram(processId);
  }

  // damit die Komplexität der Methode nicht zu groß wird beschränken wir uns hier auf das Wechseln des Tasks "nach vorne"
  // TODO PP check method and test
  public switchTaskWithNextTask(processId: string, rowDetails: RowDetails): void {

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
    isTrue(objectToSwitch_A.outgoing.length === 1, "A darf vor dem Start nur 1 outgoing haben!");
    let objectToSwitch_B: Bpmn.FlowNode = objectToSwitch_A.outgoing[0].targetRef;

    isTrue(objectToSwitch_A.incoming.length === 1, "A darf vor dem Start nur 1 incoming haben!");
    isTrue(objectToSwitch_B.outgoing.length === 1, "B darf vor dem Start nur 1 outgoing haben!");
    let sequenceFlow_RA: Bpmn.SequenceFlow = objectToSwitch_A.incoming[0];
    let sequenceFlow_AB: Bpmn.SequenceFlow = objectToSwitch_A.outgoing[0];
    let sequenceFlow_BS: Bpmn.SequenceFlow = objectToSwitch_B.outgoing[0];

    // 1.
    sequenceFlow_RA.targetRef = objectToSwitch_B;
    // 2.
    // muss geleert werden, da sonst mehrere incomings
    objectToSwitch_A.incoming = [];
    objectToSwitch_A.incoming.push(sequenceFlow_AB);
    isTrue(objectToSwitch_A.incoming.length === 1, "A darf nur 1 incoming haben!");
    // 3.
    // muss geleert werden, da sonst mehrere outgoings
    objectToSwitch_A.outgoing = [];
    objectToSwitch_A.outgoing.push(sequenceFlow_BS);
    isTrue(objectToSwitch_A.outgoing.length === 1, "A darf nur 1 outgoing haben!");
    // 4.
    sequenceFlow_AB.sourceRef = objectToSwitch_B;
    sequenceFlow_AB.targetRef = objectToSwitch_A;
    // 5.
    sequenceFlow_BS.sourceRef = objectToSwitch_A;
    // 6.
    // muss geleert werden, da sonst mehrere incomings
    objectToSwitch_B.incoming = [];
    objectToSwitch_B.incoming.push(sequenceFlow_RA);
    isTrue(objectToSwitch_B.incoming.length === 1, "B darf nur 1 incoming haben!");
    // 7.
    // muss geleert werden, da sonst mehrere outgoings
    objectToSwitch_B.outgoing = [];
    objectToSwitch_B.outgoing.push(sequenceFlow_AB);
    isTrue(objectToSwitch_B.outgoing.length === 1, "B darf nur 1 outgoing haben!");

    this.processDiagram.generateBPMNDiagram(processId);
  }

  // in erster Implementierung wird jeder Weitere Prozess an den letzten angelegten angehängt!
  public addOrModifyTask(processId: string, rowDetails: RowDetails): string {
    // Weiteren Prozess einfügen
    let id: string;
    if (rowDetails.taskId == null) {
      id = BpmnProcess.getBpmnId(BPMN_USERTASK);
      rowDetails.taskId = id;
    }

    let lastCreatedTask = this.getLastCreatedTask(processId);

    let focusedTask: Bpmn.UserTask = this.getExistingTask(processId, rowDetails.taskId) as Bpmn.UserTask;
    let processContext: Bpmn.Process = this.getProcess(processId);

    let isNewTask: boolean = false;

    if (focusedTask == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      focusedTask = this.moddle.create(BPMN_USERTASK, { id: rowDetails.taskId, name: rowDetails.task, extensionElements: extensions, incoming: [], outgoing: [] });
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
      // TR: getEndEvent changed to getEndEvents and [0] added in following line - does that make sense?
      let endEventObject = this.getEndEvents(processId)[0];

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
      isTrue(sourceReference.outgoing.length == 1, "Das Start EVENT darf nur 1 Verbindung (outgoing) haben!" + sourceReference.outgoing.length);
    }
    sourceReference.outgoing.splice(0, 1);
    if (targetReference.$type === BPMN_ENDEVENT) {
      isTrue(targetReference.incoming.length == 1, "Das End EVENT darf nur 1 Verbindung (incoming) haben! " + targetReference.incoming.length);
    }
    targetReference.incoming.splice(0, 1);

    targetReference.incoming.push(sequenceFlow);
    sourceReference.outgoing.push(sequenceFlow);

    return sequenceFlow;
  }

  public async toXmlString(): Promise<string> {

    this.removeLanesWithoutShape();

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
    let laneElementsList: Bpmn.Lane[] = this.getLanes(processId, true);

    let sortedLaneElementsList = [];

    // include start element
    let sortedTaskIds: string[] = [this.getStartEvents(processId)[0].id];
    this.getSortedTasks(processId).map(t => sortedTaskIds.push(t.id));

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
    this.removeTaskObjectFromLanes(processId, this.getStartEvents(processId)[0]);
    this.removeTaskObjectFromLanes(processId, this.getEndEvents(processId)[0]);

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

    if (laneOfStartEvent != null)
      this.addTaskToLane(processId, laneOfStartEvent.id, this.getStartEvents(processId)[0]);
    if (laneOfEndEvent != null)
      this.addTaskToLane(processId, laneOfEndEvent.id, this.getEndEvents(processId)[0]);

    return sortedLaneElementsList;
  }

  /**
   * Gets the lanes of the process
   * @param processId id of process
   * @param onlyLanesWithTasks if true, only lanes containing a task are returned
   * @return {Bpmn.Lane} the lanes of the process - if onlyLanesWithTasks is true, only the lanes containing a task are returned
   */
  public getLanes(processId: string, onlyLanesWithTasks: boolean): Bpmn.Lane[] {
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

  public getLaneOfFlowNode(flowNodeId: string): Bpmn.Lane {
    let laneElement: Bpmn.Lane = null;
    let processes: Bpmn.Process[] = this.bpmnXml.rootElements.filter((e: any) => e.$type === BPMN_PROCESS) as Bpmn.Process[];

    for (let i = 0; i < processes.length; i++) {
      let laneSetElements: Bpmn.LaneSet[] = processes[i].laneSets.filter((e: any) => e.$type === BPMN_LANESET);
      for (let t = 0; t < laneSetElements.length; t++) {

        if (laneSetElements[t].lanes != null) {
          laneElement = laneSetElements[t].lanes.find(lane => {
            if (lane.flowNodeRef != null) {
              let flowObj = lane.flowNodeRef.find(fo => fo.id === flowNodeId);
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

  /**
   * Gets the lane ids containing a start event
   * @return {string[]} the ids of the lanes containig a start event
   */
  public getStartLaneIds(): string[] {
    const laneIds: string[] = [];

    const startEvents: Bpmn.StartEvent[] = this.getStartEvents(this.processId());
    if (startEvents) {
      for (const startEvent of startEvents) {
        const startLane: Bpmn.Lane = this.getLaneOfFlowNode(startEvent.id);
        if (startLane != null) {
          laneIds.push(startLane.id);
        }
      }
    }

    return laneIds;
  }

  public getSortedTasks(processId: string): Bpmn.Task[] {
    let startEventObject: Bpmn.StartEvent = this.getStartEvents(processId)[0];
    if (startEventObject == null || startEventObject.outgoing == null || startEventObject.outgoing.length == 0)
      return [];  // process definition is not correct, but function should be fault tolerant

    let taskObject = startEventObject.outgoing[0].targetRef;

    let sortedTasks: Bpmn.Task[] = [];

    // taskObject wird zuerst auf Start event gesetzt!
    while (taskObject != null && taskObject.$type !== BPMN_ENDEVENT) {
      if ((taskObject.$type === "bpmn:UserTask" || taskObject.$type === "bpmn:SendTask") && sortedTasks.find(e => e.id == taskObject.id) == null) {
        sortedTasks.push(taskObject as Bpmn.Task);
      } else if (sortedTasks.find(e => e.id == taskObject.id) != null) {
        break; // Vermeidung Endlosschleife
      }
      if (taskObject.outgoing != null && taskObject.outgoing[0] != null)
        taskObject = taskObject.outgoing[0].targetRef;
      else
        taskObject = null;
    }

    // Liste enthält nur einen Pfad nach Gateways und ist daher nicht unbedingt vollständig
    // Nochmals alle Tasks iterieren und fehlende Tasks anfügen
    let tasks = this.getEvents(processId, BPMN_USERTASK);
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
      if (processes[i].flowElements) {
        let flowElements: Bpmn.FlowElement[] = processes[i].flowElements.filter((e) => {
          return e.$type === type;
        });
        // Jeder SeqenceFlow soll direkt in der Liste sein
        for (let i = 0; i < flowElements.length; i++) {
          let element = flowElements[i] as T;
          elements.push(element);
        }
      }
    }

    return elements;
  }

  public getSequenceFlowElements(): Bpmn.SequenceFlow[] {
    return this.getFlowElementsOfType<Bpmn.SequenceFlow>("bpmn:SequenceFlow");

  }

  public getFollowingSequenceFlowName(bpmnTaskId: string): string {
    let taskObj = this.getExistingTask(this.processId(), bpmnTaskId);
    // fix for multiple outgoings at the moment or no outgoings
    if (taskObj == null || taskObj.outgoing == null || taskObj.outgoing.length > 1) {
      return null;
    }
    // sure that taskObj has only 1 outgoing
    let seqFlow = taskObj.outgoing[taskObj.outgoing.length - 1];
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) // ignore empty flow names
      return seqFlow.name;
    else
      return null;
  }

  public getPreviousSequenceFlowName(bpmnTaskId: string): string {
    let taskObj = this.getExistingTask(this.processId(), bpmnTaskId);
    // fix for multiple outgoings at the moment or no outgoings
    if (taskObj == null || taskObj.incoming == null || taskObj.incoming.length > 1) {
      return null;
    }
    // sure that taskObj has only 1 outgoing
    let seqFlow = taskObj.incoming[taskObj.incoming.length - 1];
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) // ignore empty flow names
      return seqFlow.name;
    else
      return null;
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

  private static getExtensionBody(flowNode: Bpmn.FlowNode, settingsName: string): string {
    if (flowNode.extensionElements && flowNode.extensionElements.values) {
      const phInOut = flowNode.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
      if (phInOut && phInOut.$children) {
        const descriptionElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === settingsName);
        if (descriptionElement && descriptionElement.$body) {
          return descriptionElement.$body;
        }
      }
    }
    return null;
  }

  public static getSetSenderAsRoleOwner(startEvent: Bpmn.StartEvent): boolean {
    const valueAsString: string = BpmnProcess.getExtensionBody(startEvent, TaskSettings.SetSenderAsRoleOwner);
    if (valueAsString) {
      return valueAsString === "true";
    } else {
      // default value is true 
      return true;
    }
  }

  public static getFlowNodeDescription(flowNode: Bpmn.FlowNode): string {
    return BpmnProcess.getExtensionBody(flowNode, TaskSettings.Description);
  }

  private static setExtensionBody(flowNode: Bpmn.FlowNode, settingsName: string, value: string): void {
    const bpmnModdle = new BpmnModdle([], {});
    if (!flowNode.extensionElements) {
      flowNode.extensionElements = bpmnModdle.create("bpmn:ExtensionElements", { values: [] });
    }
    let phInOut = flowNode.extensionElements.values.find(e => e.$type === "processhub:inputOutput") as Processhub.InputOutput;
    if (!phInOut) {
      phInOut = bpmnModdle.createAny("processhub:inputOutput", "http://processhub.com/schema/1.0/bpmn", { $children: [] });
      flowNode.extensionElements.values.push(phInOut);
    }
    let settingsElement = phInOut.$children.find(c => (c as Processhub.InputParameter).name === settingsName);
    if (!settingsElement) {
      settingsElement = bpmnModdle.createAny("processhub:inputParameter", "http://processhub.com/schema/1.0/bpmn", { name: settingsName });
      phInOut.$children.push(settingsElement);
    }

    if (value != null)
      settingsElement.$body = value;
    else
      settingsElement.$body = "";
  }

  public static setTaskDescription(task: Bpmn.Task, description: string): void {
    BpmnProcess.setExtensionBody(task, TaskSettings.Description, description);
  }

  public static setSetSenderAsRoleOwner(startEvent: Bpmn.StartEvent, setSetSenderAsRoleOwner: boolean): void {
    BpmnProcess.setExtensionBody(startEvent, TaskSettings.SetSenderAsRoleOwner, setSetSenderAsRoleOwner.toString());
  }

  public async checkCompatibilityOfChangedProcess(runningInstances: InstanceDetails[], userInstances: InstanceDetails[]) {

    let actualRunningTasks: RunningTaskLane[] = [];
    for (let runInstance of runningInstances) {
      let todos = filterTodosForInstance(userInstances, runInstance.instanceId);
      let value = todos.map((t): RunningTaskLane => {
        return { bpmnLaneId: t.bpmnLaneId, bpmnTaskId: t.bpmnTaskId } as RunningTaskLane;
      });
      actualRunningTasks = actualRunningTasks.concat(value);
    }

    let allTasksAndLanesAreThere: boolean = true;

    for (let runningTask of actualRunningTasks) {
      let tmpTaskObj = this.getExistingTask(this.processId(), runningTask.bpmnTaskId);
      let tmpLaneObj = this.getLaneOfFlowNode(runningTask.bpmnTaskId);
      if (tmpTaskObj == null || tmpLaneObj == null || runningTask.bpmnLaneId != tmpLaneObj.id) {
        allTasksAndLanesAreThere = false;
        break;
      }
    }

    return allTasksAndLanesAreThere;
  }


  public getDecisionTasksForTask(bpmnTaskId: string): DecisionTask[] {
    let decisionTasks: DecisionTask[] = [];

    let processObject = this.getExistingActivityObject(bpmnTaskId);

    if (processObject.$type === BPMN_EXCLUSIVEGATEWAY) {
      return this.getTaskIdsAfterGateway(bpmnTaskId);
    }

    if (this.isOneOfNextActivityOfType(bpmnTaskId, BPMN_EXCLUSIVEGATEWAY)) {
      // taskTitle = todo != null ? todo.displayName : tl("Entscheidung");
      let nextActivites = this.getNextActivities(bpmnTaskId);

      for (let tmp of nextActivites) {
        if (tmp.$type == BPMN_EXCLUSIVEGATEWAY) {
          let list = this.getTaskIdsAfterGateway(tmp.id);
          decisionTasks = decisionTasks.concat(list);
        }
      }
    }

    return decisionTasks;
  }

  public getBoundaryDecisionTasksForTask(bpmnTaskId: string): DecisionTask {
    let boundaryDecisionTask: DecisionTask = null;

    let taskObject = this.getExistingActivityObject(bpmnTaskId);

    if (taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      let tmpBoundary = taskObject.boundaryEventRefs[taskObject.boundaryEventRefs.length - 1];
      equal(tmpBoundary.eventDefinitions.length, 1, "Nur eine Boundary Definition ist erlaubt!");
      boundaryDecisionTask = {
        bpmnTaskId: tmpBoundary.id,
        name: tmpBoundary.name,
        isBoundaryEvent: true,
        type: DecisionTaskTypes.Boundary,
        boundaryEventType: tmpBoundary.eventDefinitions[tmpBoundary.eventDefinitions.length - 1].$type.toString()
      } as DecisionTask;
    }

    return boundaryDecisionTask;
  }

  private removeLanesWithoutShape(): void {
    const process: Bpmn.Process = this.getProcess(this.processId());
    const diagram = this.bpmnXml.diagrams[0];
    const laneSet = process.laneSets[0];

    laneSet.lanes = laneSet.lanes.filter(lane => {
      for (const planeElement of diagram.plane.planeElement) {
        if (planeElement.$type === "bpmndi:BPMNShape") {
          const bpmndiBPMNShape: Bpmndi.BPMNShape = planeElement as Bpmndi.BPMNShape;
          if (bpmndiBPMNShape.bpmnElement && bpmndiBPMNShape.bpmnElement.id === lane.id) {
            return true;
          }
        }
      }
      return false;
    });
  }

}