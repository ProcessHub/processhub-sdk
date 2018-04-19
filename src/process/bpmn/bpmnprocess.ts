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
export const BPMN_SERVICETASK = "bpmn:ServiceTask";
export const BPMN_STARTEVENT = "bpmn:StartEvent";
export const BPMN_ENDEVENT = "bpmn:EndEvent";
export const BPMN_SEQUENCEFLOW = "bpmn:SequenceFlow";
export const BPMN_INTERMEDIATETHROWEVENT = "bpmn:IntermediateThrowEvent";
export const BPMN_INTERMEDIATECATCHEVENT = "bpmn:IntermediateCatchEvent";
export const BPMN_MESSAGEEVENTDEFINITION = "bpmn:MessageEventDefinition";
export const BPMN_TIMEREVENTDEFINITION = "bpmn:TimerEventDefinition";
export const BPMN_ERROREVENTDEFINITION = "bpmn:ErrorEventDefinition";
export const BPMN_BOUNDARYEVENT = "bpmn:BoundaryEvent";
export const BPMN_LANE = "bpmn:Lane";
export const BPMN_LANESET = "bpmn:LaneSet";
export const BPMN_EXCLUSIVEGATEWAY = "bpmn:ExclusiveGateway";
export const BPMN_PARALLELGATEWAY = "bpmn:ParallelGateway";
export const BPMN_FORMALEXPRESSION = "bpmn:FormalExpression";

interface TmpSavedGateway {
  sourceTaskRowDetails: RowDetails;
  targetBpmnTaskIds: string[];
}

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

  public static getExtensionValues(activityObject: Bpmn.Activity): TaskExtensions {
    let returnValue: TaskExtensions = {
      description: null,
      fieldDefinitions: null,
      sendTaskReceiver: null,
      sendTaskInstanceLink: true,
      sendTaskSubject: null,
      sendTaskWithFieldContents: true,
      allFieldsEditable: false,
      roleOwnersEditable: false,
      viewAllFields: true,
      sendMailNotification: true,
      requiredFieldsNeeded: null,
      saveDecisionInFieldContents: false,
      customFieldContentsValue: null,

      serviceTaskApiUrl: null,
      serviceTaskRequestObjectString: null,
      serviceTaskResponseFieldName: null,

      timerStartConfiguration: null,

      subProcessId: undefined,
    };

    if (activityObject == null || activityObject.extensionElements == null || (activityObject.extensionElements != null && activityObject.extensionElements.values == null)) {
      return returnValue;
    }

    for (let values of activityObject.extensionElements.values) {
      if (values != null && values.$children != null) {
        for (let child of values.$children) {
          switch (child.name) {
            case TaskSettings.SubProcessId:
              returnValue.subProcessId = child.$body;
              break;
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
            case TaskSettings.RoleOwnersEditable:
              returnValue.roleOwnersEditable = child.$body != "false";
            case TaskSettings.AllFieldsEditable:
              returnValue.allFieldsEditable = child.$body != "false";
              break;
            case TaskSettings.SendMailNotification:
              returnValue.sendMailNotification = child.$body != "false";
              break;
            case TaskSettings.ViewAllFields:
              returnValue.viewAllFields = child.$body != "false";
              break;
            case TaskSettings.RequiredFieldsNeeded: {
              try {
                returnValue.requiredFieldsNeeded = JSON.parse(child.$body);
              } catch (ex) {
                console.log(ex);

                returnValue.requiredFieldsNeeded = [];
              }
            }
              break;
            case TaskSettings.SaveDecisionInFieldContents:
              returnValue.saveDecisionInFieldContents = child.$body != "false";
              break;
            case TaskSettings.CustomFieldContentsValue:
              returnValue.customFieldContentsValue = child.$body;
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

            case TaskSettings.ServiceTaskApiUrl:
              returnValue.serviceTaskApiUrl = child.$body;
              break;
            case TaskSettings.ServiceTaskRequestObjectString:
              returnValue.serviceTaskRequestObjectString = child.$body;
              break;
            case TaskSettings.ServiceTaskResponseFieldName:
              returnValue.serviceTaskResponseFieldName = child.$body;
              break;

            case TaskSettings.TimerStartConfiguration:
              returnValue.timerStartConfiguration = JSON.parse(child.$body);
              break;

            default:
              break;
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
          isBoundaryEvent: false,
          // requiredFieldsNeeded: processObject.
          // routeStack: tmpRouteStack
        } as Todo.DecisionTask);
      }
    }
    return decisionTasks;
  }

  public async loadFromTemplate(): Promise<LoadTemplateReply> {
    let result: LoadTemplateReply = await BpmnModdleHelper.createBpmnTemplate(this.moddle);

    this.bpmnXml = result.bpmnXml;

    // add extensions

    // add default fields to start element
    let startElement = this.getStartEvents(this.processId())[0];
    let fieldDefinitions: FieldDefinition[] = [
      {
        rowNumber: 0,
        name: tl("Titel"),
        type: "ProcessHubInstanceTitle",
        isRequired: false,
        config: {}
      },
      {
        rowNumber: 1,
        name: tl("Feld #1"),
        type: "ProcessHubTextInput",
        isRequired: false,
        config: {}
      },
      {
        rowNumber: 2,
        name: tl("Feld #2"),
        type: "ProcessHubTextArea",
        isRequired: false,
        config: {}
      },
      {
        rowNumber: 3,
        name: tl("Anlagen"),
        type: "ProcessHubFileUpload",
        isRequired: false,
        config: {}
      }
    ];

    BpmnProcess.addOrUpdateExtension(
      startElement,
      TaskSettings.UserForm as TaskSettings,
      JSON.stringify(fieldDefinitions),
      "Text");

    BpmnProcess.addOrUpdateExtension(
      startElement,
      TaskSettings.RoleOwnersEditable as TaskSettings,
      true,
      "Boolean");

    let sortedTasks = this.getSortedTasks(this.processId(), false);
    let counter = -1;
    let rows: RowDetails[] = sortedTasks.map(task => {
      counter++;
      let lane = this.getLaneOfFlowNode(task.id);
      return {
        taskId: task.id,
        rowNumber: counter,
        selectedRole: lane.id,
        task: task.name,
        laneId: lane.id,
        taskType: "bpmn:UserTask",
        jumpsTo: task.outgoing.map(out => out.targetRef.id)
      } as RowDetails;
    });
    this.processDiagram.generateBPMNDiagram(this.processId(), rows);


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

  // get the StartEvents of the process
  public getStartEvents(processId: string): Bpmn.StartEvent[] {
    return this.getEvents(processId, BPMN_STARTEVENT) as Bpmn.StartEvent[];
  }
  // get the text that should be displayed on the start button
  public getStartButtonTitle(): string {
    let startEvents = this.getStartEvents(this.processId());
    if (startEvents && startEvents.length > 0 && startEvents[0].name && startEvents[0].name.trim() != "")
      return startEvents[0].name;
    else
      return undefined; // undefined means no member gets created - null would explicitly be stored
  }

  public getEndEvents(processId: string): BpmnModdleHelper.BpmnModdleEndEvent[] {
    return this.getEvents(processId, BPMN_ENDEVENT) as BpmnModdleHelper.BpmnModdleEndEvent[];
  }

  private getEvents(processId: string, eventType: string): Bpmn.FlowElement[] {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find((e) => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowElement[] = process.flowElements.filter((e: Bpmn.FlowElement) => e.$type === eventType);

    return flowElements;
  }

  public getProcessDiagram() {
    return this.processDiagram;
  }

  public getExistingTask(processId: string, taskId: string): Bpmn.Task {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowNode[] = process.flowElements.filter((e: Bpmn.FlowNode) => (e.$type === BPMN_STARTEVENT || e.$type === BPMN_ENDEVENT || e.$type === BPMN_USERTASK || e.$type === BPMN_SENDTASK || e.$type === BPMN_SERVICETASK));
    let task = flowElements.find(element => element.id == taskId);

    return task as Bpmn.Task;
  }

  public changeTaskName(taskId: string, newName: string) {
    let task = this.getExistingTask(this.processId(), taskId);
    task.name = newName;
  }

  public changeRole(rowDetails: RowDetails[], taskId: string, laneId: string) {
    let task = this.getExistingTask(this.processId(), taskId);
    if (task.$type as string == BPMN_STARTEVENT) {
      this.getStartEvents(this.processId()).forEach(start => {
        this.setRoleForTask(this.processId(), laneId, start);
      });
    } else {
      this.setRoleForTask(this.processId(), laneId, task);
    }

    if (taskId === rowDetails.last().taskId) {
      let endEvent = this.getEndEvents(this.processId())[0];
      this.setRoleForTask(this.processId(), laneId, endEvent);
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
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
      let sf: Bpmn.SequenceFlow = process.flowElements.find(e => e.id === process.flowElements[index].id) as Bpmn.SequenceFlow;
      sf.sourceRef.outgoing = sf.sourceRef.outgoing.filter(out => out.id !== sf.id);
      sf.targetRef.incoming = sf.targetRef.incoming.filter(inc => inc.id !== sf.id);
      process.flowElements.splice(index, 1);
    } else {
      console.log("Error: cannot find SequenceFlow to remove.");
    }
  }

  public static addOrUpdateExtension(activity: Bpmn.Activity, key: TaskSettings, value: string | boolean | {}[], extensionValueType: TaskSettingsValueType): void {

    if (extensionValueType === "List") {
      value = JSON.stringify(value);
    }

    if (extensionValueType === "Boolean") {
      value = Boolean(value).toString();
    }

    if (value == null)
      value = "";

    let extensionElement;
    if (!activity.extensionElements || activity.extensionElements.values == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      activity.extensionElements = extensions;
    }

    // remove second processhub:inputOutput
    if (activity.extensionElements.values.length > 1) {
      activity.extensionElements.values = [activity.extensionElements.values[0]];
    }

    for (let extension of activity.extensionElements.values) {
      if (extension.$children != null) {
        extension.$children = extension.$children.filter(child => child.name !== key);
        // extensionElement = extension.$children.find(e => e.name === key);
      }
    }

    BpmnModdleHelper.addTaskExtensionInputText(activity.extensionElements, key, value as string);
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

  private removeTaskFromContext(taskId: string) {
    let processContext = this.getProcess(this.processId());

    for (let index = 0; index < processContext.flowElements.length; index++) {
      let element = processContext.flowElements[index];
      if (element.id === taskId) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }
  }

  private removeElementWithAllReferences(objectId: string): { objectIdsWithMissingSource: string[], objectIdsWithMissingTarget: string[] } {
    let objectIdsWithMissingTarget: string[] = [];
    let objectIdsWithMissingSource: string[] = [];
    this.getSequenceFlowElements().forEach(sf => {
      // remove SF's where target is delete Object 
      if (sf.targetRef.id === objectId) {
        this.removeSequenceFlow(this.processId(), sf);
        objectIdsWithMissingTarget.push(sf.sourceRef.id);
      }

      // remove SF's where source is delete Object 
      if (sf.sourceRef.id === objectId) {
        this.removeSequenceFlow(this.processId(), sf);
        objectIdsWithMissingSource.push(sf.targetRef.id);
      }
    });

    return {objectIdsWithMissingTarget: objectIdsWithMissingTarget, objectIdsWithMissingSource: objectIdsWithMissingSource};
  }

  // löscht einen Task aus dem XML und dem Diagramm
  public deleteTask(processId: string, rowDetails: RowDetails[], rowNumber: number): void {
    let processContext = this.getProcess(processId);
    // let allgateways = this.removeAllGateways(rowDetails, true);

    // Auch hier wird nach folgendem Beispiel vorgegangen
    // A -[AB]-> B -[BC]-> C
    // B wird gelöscht und dann soll folgendes übrig bleiben: A -[A(B)C]-> C
    // Hierbei wird die ausgehende Verbindung modifiziert und die eingehende ebenfalls gelöscht
    // 1. [AB] löschen
    // 2. B löschen
    // 3. [BC] bekommt als sourceRef A
    // 4. A bekommt als outgoing [BC]
    let delTaskId = rowDetails[rowNumber].taskId;
    let nextObjects = this.getNextActivities(rowDetails[rowNumber].taskId);

    let res = this.removeElementWithAllReferences(delTaskId);

    let objToDelete = this.getExistingTask(this.processId(), delTaskId);
    if (objToDelete != null) {
      this.removeTaskObjectFromLanes(this.processId(), objToDelete);
    }

    this.removeTaskFromContext(delTaskId);

    for (let sourceId of res.objectIdsWithMissingTarget) {
      let sourceObj = this.getExistingActivityObject(sourceId);

      for (let targetId of res.objectIdsWithMissingSource) {
        let targetObj = this.getExistingActivityObject(targetId);

        // special case for start events on the left
        if (rowNumber === 1 && targetObj.$type === BPMN_EXCLUSIVEGATEWAY) {
          // remove gateway and all sfs
          this.removeElementWithAllReferences(targetObj.id);
          // next or end element
          let newTargetId = rowDetails[(rowNumber + 1)] != null ? rowDetails[(rowNumber + 1)].taskId : this.getEndEvents(this.processId())[0].id;
          targetObj = this.getExistingActivityObject(newTargetId);

          res.objectIdsWithMissingSource = res.objectIdsWithMissingSource.filter(obj => obj != targetId);
          res.objectIdsWithMissingSource.push(targetObj.id);
          this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);

        } else {
          this.addSequenceFlow(this.processId(), sourceObj, targetObj, false);
        }
      }
    }


    /*nextObjects.forEach(nextObject => {
      this.addSequenceFlow(this.processId(), this.getExistingActivityObject(rowDetails[(rowNumber - 1)].taskId), nextObject, false);
    });*/

    /*
        isTrue(rowNumber > 0, "called rownumber have to be bigger than 0");
        let objectToDelete_A: Bpmn.FlowNode  = this.getExistingTask(processId, rowDetails[(rowNumber - 1)].taskId);
    
        if (rowDetails.length > (rowNumber + 1)) {
          nextObject = this.getExistingTask(processId, rowDetails[(rowNumber + 1)].taskId);
        } else {
          nextObject = this.getEndEvents(processId)[0];
        }
    
        let objectToDelete_B = this.getExistingTask(processId, rowDetails[rowNumber].taskId);
        // isTrue(objectToDelete_B.incoming.length == 1, "SequenceFlow Länge muss hier 1 sein!");
        let sequenceFlows_AB: Bpmn.SequenceFlow[] = objectToDelete_B.incoming; // .find(inc => inc.sourceRef.id === objectToDelete_A.id && inc.targetRef.id === objectToDelete_B.id); // [0];
        // isTrue(objectToDelete_B.outgoing.length == 1, "SequenceFlow Länge muss hier 1 sein!");
        let sequenceFlow_BC: Bpmn.SequenceFlow = objectToDelete_B.outgoing.find(out => out.sourceRef.id === objectToDelete_B.id && out.targetRef.id === nextObject.id); // [0];
    
        let sequenceFlows_BC_to_delete: Bpmn.SequenceFlow[] = objectToDelete_B.outgoing.filter(out => out.targetRef.id !== nextObject.id); // [0];
    
        objectToDelete_B.outgoing.forEach(out => {
          if (out.targetRef.id !== nextObject.id) {
            out.targetRef.incoming = out.targetRef.incoming.filter(inc => inc.sourceRef.id !== objectToDelete_B.id);
          }
        });
        objectToDelete_B.incoming.forEach(inc => inc.sourceRef.outgoing = inc.sourceRef.outgoing.filter(out => out.targetRef.id !== objectToDelete_B.id));
    
        // 1. & 2. Elemente aus flowElements löschen
        for (let index = 0; index < processContext.flowElements.length; index++) {
          let element = processContext.flowElements[index];
          if (sequenceFlows_AB.find(sf => sf.id === element.id) != null
            || sequenceFlows_BC_to_delete.find(sf => sf.id === element.id) != null
            || element.id === objectToDelete_B.id) {
            processContext.flowElements.splice(index, 1);
            index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
          }
        }
        // 3.
        isTrue(objectToDelete_A != null);
        sequenceFlow_BC.sourceRef = objectToDelete_A;
    
        // 4.
        // Array zuerst leeren! Da hier nur ein Element im Array sein darf!
        // objectToDelete_A.outgoing = [];
        objectToDelete_A.outgoing = objectToDelete_A.outgoing.filter(out => out.sourceRef.id !== objectToDelete_A.id && out.targetRef.id !== objectToDelete_B.id);
        objectToDelete_A.outgoing.push(sequenceFlow_BC);
    
        // isTrue(objectToDelete_A.outgoing.length === 1, "A darf hier nur einen outgoing Flow haben!");
    
        // Task aus lane entfernen
        let processLanes: Bpmn.Lane[] = this.getProcessLanes(processId);
        for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
          let processLane: Bpmn.Lane = processLanes[laneIndex];
          if (processLane.flowNodeRef != null) {
            for (let index = 0; index < processLane.flowNodeRef.length; index++) {
              let flowNode: Bpmn.FlowNode = processLane.flowNodeRef[index];
              if (flowNode.id === rowDetails[rowNumber].taskId) {
                processLane.flowNodeRef.splice(index, 1);
                index--; // Wegen splicen
              }
            }
          }
        }
        this.putGatewaysBack(allgateways);
    
        let tmpRowDetails: RowDetails[] = JSON.parse(JSON.stringify(rowDetails));
        tmpRowDetails.splice(rowNumber, 1);
    */
    let tmpRowDetails: RowDetails[] = JSON.parse(JSON.stringify(rowDetails));
    tmpRowDetails.splice(rowNumber, 1);
    this.processDiagram.generateBPMNDiagram(processId, tmpRowDetails);
  }

  private addToWithoutDuplicates(inOrOutGoings: Bpmn.SequenceFlow[], addItem: Bpmn.SequenceFlow) {
    let sfObj = inOrOutGoings.find((sf) => {
      return sf.sourceRef.id === addItem.sourceRef.id && sf.targetRef.id === addItem.targetRef.id;
    });
    if (!sfObj) {
      inOrOutGoings.push(addItem);
    }
  }

  public convertTaskType(rows: RowDetails[], changedTaskIdx: number): string {

    const oldTaskId: string = rows[changedTaskIdx].taskId;
    let oldTask: Bpmn.Task = this.getExistingTask(this.processId(), oldTaskId);
    let savedIncoming = oldTask.incoming;
    let savedOutgoing = oldTask.outgoing;

    let processContext: Bpmn.Process = this.getProcess(this.processId());

    // delete old task from flowelements
    for (let index = 0; index < processContext.flowElements.length; index++) {
      let element = processContext.flowElements[index];
      if (element.id === oldTask.id) {
        processContext.flowElements.splice(index, 1);
        index--; // ACHTUNG NICHT VERGESSEN WENN GESPLICED WIRD
      }
    }

    // Task aus lane entfernen
    let processLanes: Bpmn.Lane[] = this.getProcessLanes(this.processId());

    for (let laneIndex = 0; laneIndex < processLanes.length; laneIndex++) {
      let processLane: Bpmn.Lane = processLanes[laneIndex];
      if (processLane.flowNodeRef != null) {
        for (let index = 0; index < processLane.flowNodeRef.length; index++) {
          let flowNode: Bpmn.FlowNode = processLane.flowNodeRef[index];
          if (flowNode.id === oldTask.id) {
            processLane.flowNodeRef.splice(index, 1);
            index--; // Wegen splicen
          }
        }
      }
    }

    // standard convert to send task change on switch back
    let convertToType: "bpmn:SendTask" | "bpmn:UserTask" = rows[changedTaskIdx].taskType as "bpmn:SendTask" | "bpmn:UserTask";

    let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();

    let focusedTask = null;

    rows[changedTaskIdx].taskId = BpmnProcess.getBpmnId(convertToType);

    if (convertToType === "bpmn:SendTask") {
      focusedTask = this.moddle.create("bpmn:SendTask", { id: rows[changedTaskIdx].taskId, name: rows[changedTaskIdx].task, extensionElements: extensions, incoming: [], outgoing: [] });
    } else if (convertToType === "bpmn:UserTask") {
      focusedTask = this.moddle.create("bpmn:UserTask", { id: rows[changedTaskIdx].taskId, name: rows[changedTaskIdx].task, extensionElements: extensions, incoming: [], outgoing: [] });
    }

    if (focusedTask == null) {
      throw new Error("Error on converting task to different type.");
    }


    for (let inc of savedIncoming) {
      inc.targetRef = focusedTask;
    }
    for (let out of savedOutgoing) {
      out.sourceRef = focusedTask;
    }


    focusedTask.outgoing = savedOutgoing;
    focusedTask.incoming = savedIncoming;

    processContext.flowElements.push(focusedTask);

    this.addTaskToLane(this.processId(), rows[changedTaskIdx].laneId, focusedTask);

    // this.setRoleForTask(this.processId(), rowDetails.laneId, focusedTask);

    this.processDiagram.generateBPMNDiagram(this.processId(), rows);

    // replace all jumpsTo with the id of the new task
    for (const row of rows) {
      if (row.jumpsTo.find(j => j === oldTaskId)) {
        row.jumpsTo = row.jumpsTo.filter(j => j !== oldTaskId);
        row.jumpsTo.push(rows[changedTaskIdx].taskId);
      }
    }

    return rows[changedTaskIdx].taskId;
  }

  public addFlowToNode(taskFromObject: RowDetails, targetBpmnTaskId: string, rowDetails: RowDetails[], renderDiagram: boolean = true) {

    let focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), taskFromObject.taskId) as Bpmn.Task;
    let targetTask: Bpmn.Task = this.getExistingTask(this.processId(), targetBpmnTaskId) as Bpmn.Task;

    // add gateway
    if (focusedTask.outgoing.length > 0) {
      let existingOutgoings = focusedTask.outgoing;
      if (existingOutgoings.length === 1 && existingOutgoings.last().targetRef.$type === BPMN_EXCLUSIVEGATEWAY) {
        this.addSequenceFlow(this.processId(), existingOutgoings.last().targetRef, targetTask, false);

      } else {
        focusedTask.outgoing = [];
        let processContext: Bpmn.Process = this.getProcess(this.processId());
        let newGateway = this.moddle.create("bpmn:ExclusiveGateway", { id: "ExclusiveGateway_" + createId(), name: "", incoming: [], outgoing: [] });
        processContext.flowElements.push(newGateway);

        this.addSequenceFlow(this.processId(), focusedTask, newGateway, false);

        for (let out of existingOutgoings) {
          this.addSequenceFlow(this.processId(), newGateway, out.targetRef, false);
          this.removeSequenceFlow(this.processId(), out);
        }
        if (newGateway.outgoing.find(out => out.targetRef.id === targetTask.id) == null) {
          this.addSequenceFlow(this.processId(), newGateway, targetTask, false);
        }

        this.setRoleForTask(this.processId(), taskFromObject.laneId, newGateway);
      }

    } else {
      this.addSequenceFlow(this.processId(), focusedTask, targetTask, false);
    }
    if (renderDiagram) {
      this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
    }
  }

  public removeSequenceFlowFromJumpsTo(rowDetails: RowDetails[], rowNumber: number, targetBpmnTaskId: string) {
    let focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), rowDetails[rowNumber].taskId) as Bpmn.Task;

    let sfObj = focusedTask.outgoing.find(out => out.targetRef.id === targetBpmnTaskId || out.targetRef.$type === BPMN_EXCLUSIVEGATEWAY);
    if (sfObj.targetRef.$type === BPMN_EXCLUSIVEGATEWAY) {
      const process: Bpmn.Process = this.getProcess(this.processId());
      let gateway = sfObj.targetRef;

      let gatSequenceFlows: Bpmn.FlowElement[] = process.flowElements.filter(el => gateway.outgoing.find(e => e.id === el.id) != null);

      let allSequenceFlows = this.getSequenceFlowElements();
      gatSequenceFlows.forEach(sf => {
        let sfElem = allSequenceFlows.find(s => s.id === sf.id);
        sfElem.targetRef.incoming = sfElem.targetRef.incoming.filter(fil => gateway.outgoing.find(out => out.id === fil.id) == null);
      });
      focusedTask.outgoing = focusedTask.outgoing.filter(out => out.targetRef.id !== gateway.id);
      // process.flowElements = process.flowElements.filter(el =>  .find(e => e.id === el.id) == null);

      // del gate from flowElements

      process.flowElements = process.flowElements.filter(el => el.id !== gateway.id);
      process.laneSets.forEach(lane => lane.lanes.forEach(l => l.flowNodeRef = l.flowNodeRef.filter(fil => fil.id !== gateway.id)));
      process.flowElements = process.flowElements.filter(el => gateway.outgoing.find(e => e.id === el.id) == null);

      if (rowDetails[rowNumber].jumpsTo.length > 0) {
        let firstProcess = true;
        rowDetails[rowNumber].jumpsTo.forEach(jumpToId => {
          if (targetBpmnTaskId != jumpToId) {
            let nextTask = this.getExistingActivityObject(jumpToId);

            if (firstProcess) {
              this.addSequenceFlow(this.processId(), focusedTask, nextTask, false);
              firstProcess = false;
            } else {
              this.addFlowToNode(rowDetails[rowNumber], jumpToId, rowDetails, false);
            }
          }
        });
        // process.flowElements.forEach(el => console.log(el.id + " in " + (el as Bpmn.FlowNode).incoming.length + " ____  out " + (el as Bpmn.FlowNode).outgoing.length));

        // let nextTask: Bpmn.FlowNode = (rowNumber + 1) == rowDetails.length ? this.getEndEvents(this.processId())[0] : this.getExistingTask(this.processId(), rowDetails[rowNumber + 1].taskId) as Bpmn.Task;


      }
    }
    isTrue(sfObj != null, "removing object is missing.");
    this.removeSequenceFlow(this.processId(), sfObj);

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  private getLastCreatedTask(processId: string): Bpmn.Task {
    let process: Bpmn.Process = this.bpmnXml.rootElements.find(e => e.$type === BPMN_PROCESS && e.id === processId) as Bpmn.Process;
    let flowElements: Bpmn.FlowElement[] = process.flowElements.filter(
      (e: Bpmn.FlowElement) =>
        e.$type === BPMN_USERTASK
        || e.$type === BPMN_SENDTASK
        || e.$type === BPMN_STARTEVENT
      // || e.$type === BPMN_ENDEVENT
    );

    if (flowElements != null && flowElements.length > 0) {
      let tmpObject: Bpmn.FlowElement = flowElements[flowElements.length - 1];

      return tmpObject as Bpmn.Task;
    }
    return null;
  }

  private removeAllGateways(rowDetails: RowDetails[], addAfterDelete: boolean = false): TmpSavedGateway[] {
    let process = this.getProcess(this.processId());
    let allGateways: TmpSavedGateway[] = []; // { sourceTask: null, bpmnTaskIds: [] };
    // remove all outgoing and incoming
    if (this.getAllExclusiveGateways().length > 0) {
      for (let gate of this.getAllExclusiveGateways()) {

        isTrue(gate.incoming.length === 1);
        let targets = gate.outgoing.map(out => out.targetRef.id);
        let source = rowDetails.find(det => det.taskId === gate.incoming.last().sourceRef.id);

        // get next element in table... if last, take endevent
        let targetId = source.rowNumber + 1 === rowDetails.length ? this.getEndEvents(this.processId())[0].id : rowDetails[source.rowNumber + 1].taskId;

        if (!addAfterDelete) {
          targets = targets.filter(t => t !== this.getEndEvents(this.processId())[0].id);
        } else {
          // only target with no standard path
          targets = targets.filter(t => t !== targetId);
        }

        // let takeEndEvent = addAfterDelete ? source.rowNumber + 1 == rowDetails.length : source.rowNumber + 2 == rowDetails.length;

        // let tmp = rowDetails[source.rowNumber + 1] == null ? this.getEndEvents(this.processId())[0].id : rowDetails[source.rowNumber + 1].taskId

        // let nextElementId = takeEndEvent ? this.getEndEvents(this.processId())[0].id : tmp;

        // targets = targets.filter(t => t != nextElementId);

        allGateways.push({ sourceTaskRowDetails: source, targetBpmnTaskIds: targets });

        gate.incoming.forEach(inc => {
          this.removeSequenceFlow(this.processId(), inc);
        });
        // inc.sourceRef.outgoing = inc.sourceRef.outgoing.filter(out => out.targetRef.id !== gate.id));
        gate.outgoing.forEach(out => {
          this.removeSequenceFlow(this.processId(), out);
          // out.targetRef.incoming = out.targetRef.incoming.filter(inc => inc.sourceRef.id !== gate.id);
        });

        process.flowElements = process.flowElements.filter(e => e.id != gate.id);
        for (const laneSet of process.laneSets) {
          for (const lane of laneSet.lanes) {
            lane.flowNodeRef = lane.flowNodeRef.filter(fn => fn.id !== gate.id);
          }
        }
      }

      if (addAfterDelete) {
        for (let task of this.getSortedTasks(this.processId())) {
          if (task.outgoing.length == 0) {
            let row = rowDetails.find(r => r.taskId === task.id);
            let targetTask: Bpmn.FlowNode = null;
            if (row.rowNumber + 1 === rowDetails.length) {
              targetTask = this.getEndEvents(this.processId())[0];

            } else {
              targetTask = this.getExistingTask(this.processId(), rowDetails[row.rowNumber + 1].taskId);
            }
            this.addSequenceFlow(this.processId(), task, targetTask, false);
          }
        }
      }
    }

    return allGateways;

  }

  private putGatewaysBack(allGateways: TmpSavedGateway[]) {
    for (let gate of allGateways) {
      for (let targetBpmnTaskId of gate.targetBpmnTaskIds) {
        if (this.getExistingTask(this.processId(), gate.sourceTaskRowDetails.taskId) != null && this.getExistingTask(this.processId(), targetBpmnTaskId) != null) {
          this.addFlowToNode(gate.sourceTaskRowDetails, targetBpmnTaskId, null, false);
        }
      }
    }
  }

  public addTimerStartEvent(rowDetails: RowDetails[]): void {
    this.addStartEventOfType(rowDetails, BPMN_TIMEREVENTDEFINITION);

  }

  public removeTimerStartEvent(rowDetails: RowDetails[]): void {
    this.removeStartEventOfType(rowDetails, BPMN_TIMEREVENTDEFINITION);
  }

  public addMailStartEvent(rowDetails: RowDetails[]): void {
    this.addStartEventOfType(rowDetails, BPMN_MESSAGEEVENTDEFINITION);
  }

  public removeMailStartEvent(rowDetails: RowDetails[]): void {
    this.removeStartEventOfType(rowDetails, BPMN_MESSAGEEVENTDEFINITION);
  }

  public addStartEventOfType(rowDetails: RowDetails[], type: ("bpmn:TimerEventDefinition" | "bpmn:MessageEventDefinition")): void {
    if (this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === type) != null) == null) {
      let start = this.getStartEvents(this.processId()).last();
      let targetTask = start.outgoing.last().targetRef;
      let processContext: Bpmn.Process = this.getProcess(this.processId());
      let startEventObject = this.moddle.create(BPMN_STARTEVENT, { id: BpmnProcess.getBpmnId(BPMN_STARTEVENT), outgoing: [], incoming: [] });
      let eventDef = type == "bpmn:TimerEventDefinition" ? this.moddle.create(type as "bpmn:TimerEventDefinition", { timeDuration: this.moddle.create("bpmn:FormalExpression", { body: "PT0S" }) }) : this.moddle.create(type as "bpmn:MessageEventDefinition", {});

      startEventObject.eventDefinitions = [eventDef];
      this.addSequenceFlow(this.processId(), startEventObject, targetTask, false);
      processContext.flowElements.push(startEventObject);

      let lane = this.getLaneOfFlowNode(start.id);
      this.addTaskToLane(this.processId(), lane.id, startEventObject);
      this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
    }
  }

  public removeStartEventOfType(rowDetails: RowDetails[], type: ("bpmn:TimerEventDefinition" | "bpmn:MessageEventDefinition")): void {
    let processContext = this.getProcess(this.processId());

    let messageStartEvent = this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(event => event.$type === type) != null);
    this.removeSequenceFlow(this.processId(), messageStartEvent.outgoing.last());

    processContext.flowElements = processContext.flowElements.filter(elem => elem.id !== messageStartEvent.id);

    this.removeTaskObjectFromLanes(this.processId(), messageStartEvent);
    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  // DEPRECATED
  // in erster Implementierung wird jeder Weitere Prozess an den letzten angelegten angehängt!
  /*public addOrModifyTask(processId: string, rowDetails: RowDetails[], rowNumber: number): string {
    // Weiteren Prozess einfügen
    let newTaskRowDetails = rowDetails[rowNumber];
    let nextToLastDetails = rowDetails[rowNumber - 1];

    let id: string;
    if (newTaskRowDetails.taskId == null) {
      id = BpmnProcess.getBpmnId(BPMN_USERTASK);
      newTaskRowDetails.taskId = id;
    }

    let lastCreatedTask: Bpmn.Task = null;
    if (nextToLastDetails != null) {
      lastCreatedTask = this.getExistingTask(this.processId(), nextToLastDetails.taskId);
    } else {
      lastCreatedTask = this.getLastCreatedTask(this.processId());
    }

    let focusedTask: Bpmn.Task = this.getExistingTask(processId, newTaskRowDetails.taskId) as Bpmn.Task;
    let processContext: Bpmn.Process = this.getProcess(processId);

    let isNewTask: boolean = false;

    if (focusedTask == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      focusedTask = this.moddle.create(newTaskRowDetails.taskType as "bpmn:UserTask", { id: newTaskRowDetails.taskId, name: newTaskRowDetails.task, extensionElements: extensions, incoming: [], outgoing: [] });
      processContext.flowElements.push(focusedTask);
      isNewTask = true;
    } else {
      id = focusedTask.id;
      focusedTask.name = newTaskRowDetails.task;
    }

    let allgateways = this.removeAllGateways(rowDetails, !isNewTask);


    // entfernt den task aus einer lane und fügt ihn der neu angegebenen hinzu (fürs bearbeiten)
    // let laneId: string = BpmnProcess.getBpmnId(BPMN_LANE, rowDetails.selectedRole);    
    this.setRoleForTask(processId, newTaskRowDetails.laneId, focusedTask);

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
      this.removeSequenceFlow(processId, endEventObject.incoming.find(inc => inc.sourceRef.id === lastCreatedTask.id));
      // let tmpSf = lastCreatedTask.outgoing.find(out => out.targetRef.id == endEventObject.id);

      // lastCreatedTask.outgoing = lastCreatedTask.outgoing.filter(out => out.targetRef.id !== endEventObject.id);
      // endEventObject.incoming = endEventObject.incoming.filter(inc => inc.sourceRef.id !== lastCreatedTask.id);
      // processContext.flowElements = processContext.flowElements.filter(el => el.id !== tmpSf.id);

      this.addSequenceFlow(processId, focusedTask, endEventObject);
      // endEventObject.incoming.push(sequenceEndObject);
      // focusedTask.outgoing.push(sequenceEndObject);
    }

    this.putGatewaysBack(allgateways);

    this.processDiagram.generateBPMNDiagram(processId, rowDetails.map(row => row.taskId));
    return newTaskRowDetails.taskId;
  }*/

  public addTaskBetween(rowDetails: RowDetails[], focusedRowNumber: number) {
    // important to refresh rowdetails with new TaskId
    let newTaskRowDetails = rowDetails[focusedRowNumber];
    let id: string;
    if (newTaskRowDetails.taskId == null) {
      id = BpmnProcess.getBpmnId(BPMN_USERTASK);
      newTaskRowDetails.taskId = id;
    }

    let focusedTask: Bpmn.Task = this.getExistingTask(this.processId(), newTaskRowDetails.taskId) as Bpmn.Task;
    let processContext: Bpmn.Process = this.getProcess(this.processId());

    if (focusedTask == null) {
      let extensions: BpmnModdleHelper.BpmnModdleExtensionElements = BpmnModdleHelper.createTaskExtensionTemplate();
      focusedTask = this.moddle.create(newTaskRowDetails.taskType as "bpmn:UserTask", { id: newTaskRowDetails.taskId, name: newTaskRowDetails.task, extensionElements: extensions, incoming: [], outgoing: [] });
      processContext.flowElements.push(focusedTask);
    }

    this.setRoleForTask(this.processId(), newTaskRowDetails.laneId, focusedTask);

    // PREV object
    let previousElements: Bpmn.Activity[] = [];

    if (focusedRowNumber == 1) {
      previousElements = this.getStartEvents(this.processId());
    } else {
      previousElements = [this.getExistingActivityObject(rowDetails[focusedRowNumber - 1].taskId)];
    }

    // TARGET object
    let targetElement = this.getExistingActivityObject(rowDetails[focusedRowNumber].taskId);

    // NEXT object
    let nextElement: Bpmn.Activity = null;
    if (rowDetails[focusedRowNumber + 1] == null) {
      nextElement = this.getEndEvents(this.processId()).last();
    } else {
      nextElement = this.getExistingActivityObject(rowDetails[focusedRowNumber + 1].taskId);
    }

    let targetRefsOfPrev: string[] = [];
    previousElements != null ? previousElements.forEach(start => {
      targetRefsOfPrev = targetRefsOfPrev.concat(start.outgoing.map(out => out.targetRef.id));
    }) : null;
    let targetRefsOfPrevUnique: any = [];
    targetRefsOfPrev.forEach(item => {
      if (targetRefsOfPrevUnique.indexOf(item) == -1) {
        targetRefsOfPrevUnique.push(item);
      }
    });


    // remove all outgoings from previous
    if (previousElements != null) {
      previousElements.forEach(previousElement => {
        previousElement.outgoing.forEach(out => {
          this.removeSequenceFlow(this.processId(), out);
        });

        let sfObj = this.getSequenceFlowElements().find(sf => sf.sourceRef.id === previousElement.id && sf.targetRef.id === nextElement.id);
        this.removeSequenceFlow(this.processId(), sfObj);
        this.addSequenceFlow(this.processId(), previousElement, targetElement, true);
      });
    }

    for (let targetRefId of targetRefsOfPrevUnique) {
      let tmpTargetElement = this.getExistingActivityObject(targetRefId);
      this.addSequenceFlow(this.processId(), targetElement, tmpTargetElement, false);
    }

    this.processDiagram.generateBPMNDiagram(this.processId(), rowDetails);
  }

  private addSequenceFlow(processId: string, sourceReference: Bpmn.FlowNode, targetReference: Bpmn.FlowNode, deleteExistingRefs: boolean = true): Bpmn.SequenceFlow {
    let processContext = this.getProcess(processId);
    // Weiteren Sequenzfluss einfügen
    let id = BpmnProcess.getBpmnId(BPMN_SEQUENCEFLOW);
    let sequenceFlow = this.moddle.create(BPMN_SEQUENCEFLOW, { id: id, targetRef: targetReference, sourceRef: sourceReference });

    processContext.flowElements.push(sequenceFlow);

    if (sourceReference.$type === BPMN_STARTEVENT) {
      // isTrue(sourceReference.outgoing.length == 1, "Das Start EVENT darf nur 1 Verbindung (outgoing) haben!" + sourceReference.outgoing.length);
    }
    if (deleteExistingRefs)
      sourceReference.outgoing.splice(0, 1);
    if (targetReference.$type === BPMN_ENDEVENT) {
      // isTrue(targetReference.incoming.length == 1, "Das End EVENT darf nur 1 Verbindung (incoming) haben! " + targetReference.incoming.length);
    }
    if (deleteExistingRefs)
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

  public getSortedTasks(processId: string, ignoreSendTasks: boolean = false): Bpmn.Task[] {
    let startEventObject: Bpmn.StartEvent = this.getStartEvents(processId)[0];
    if (startEventObject == null || startEventObject.outgoing == null || startEventObject.outgoing.length == 0)
      return [];  // process definition is not correct, but function should be fault tolerant

    let taskObject = startEventObject.outgoing[0].targetRef;

    let sortedTasks: Bpmn.Task[] = [];

    // taskObject wird zuerst auf Start event gesetzt!
    while (taskObject != null && taskObject.$type !== BPMN_ENDEVENT) {
      if ((taskObject.$type === "bpmn:UserTask" || (!ignoreSendTasks && taskObject.$type === "bpmn:SendTask")) && sortedTasks.find(e => e.id == taskObject.id) == null) {
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

    tasks = this.getEvents(processId, BPMN_SENDTASK);
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

  public getPreviousSequenceFlowName(bpmnTaskId: string, sharedSourceElementId: string): string {
    let taskObj = this.getExistingTask(this.processId(), bpmnTaskId);
    // sure that taskObj has only 1 outgoing
    let seqFlow = taskObj.incoming.find(sf => sf.sourceRef.id === sharedSourceElementId);
    if (seqFlow.name != null && seqFlow.name.trim().length > 0) // ignore empty flow names
      return seqFlow.name;
    else
      return null;
  }

  public getSharedOutgoingElementId(taskIds: string[]): string {
    let map: any = {};
    taskIds.forEach(taskId => {
      let obj = this.getExistingTask(this.processId(), taskId);
      obj.incoming.forEach(inc => {
        if (map[inc.sourceRef.id] != null) {
          map[inc.sourceRef.id]++;
        } else {
          map[inc.sourceRef.id] = 1;
        }
      });
    });

    let biggestKey = null;
    let biggestLength = 0;
    for (let key in map) {
      if (biggestLength < map[key]) {
        biggestKey = key;
        biggestLength = map[key];
      }
    }

    return biggestKey;
  }

  public getLaneNumberOfElement(element: Bpmn.FlowNode, laneDictionaries: LaneDictionary[]): number {
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
    if (!phInOut || phInOut.$children == null) {
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

  public checkCompatibilityOfChangedProcess(runningInstances: InstanceDetails[], userInstances: InstanceDetails[]): boolean {

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
      const taskOrGateway = this.getExistingActivityObject(runningTask.bpmnTaskId);
      let tmpLaneObj = this.getLaneOfFlowNode(runningTask.bpmnTaskId);
      if (taskOrGateway == null || tmpLaneObj == null || runningTask.bpmnLaneId != tmpLaneObj.id) {
        allTasksAndLanesAreThere = false;
        break;
      }
    }

    return allTasksAndLanesAreThere;
  }


  public getDecisionTasksForTask(bpmnTaskId: string): DecisionTask[] {
    let decisionTasks: DecisionTask[] = [];

    let processObject = this.getExistingActivityObject(bpmnTaskId);

    if (processObject != null && processObject.$type === BPMN_EXCLUSIVEGATEWAY) {
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

  public hasMessageBoundaryEvent(bpmnTaskId: string): boolean {
    let taskObject = this.getExistingActivityObject(bpmnTaskId);
    if (taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      let obj = taskObject.boundaryEventRefs.find(b => b.eventDefinitions.find(ed => ed.$type === BPMN_MESSAGEEVENTDEFINITION) != null);
      return obj != null;
    }
    return false;
  }

  public getBoundaryDecisionTasksForTask(bpmnTaskId: string): DecisionTask[] {
    let boundaryDecisionTask: DecisionTask[] = [];
    let taskObject = this.getExistingActivityObject(bpmnTaskId);

    if (taskObject != null && taskObject.boundaryEventRefs != null && taskObject.boundaryEventRefs.length > 0) {
      let tmpBoundary = taskObject.boundaryEventRefs[taskObject.boundaryEventRefs.length - 1];
      equal(tmpBoundary.eventDefinitions.length, 1, "Nur eine Boundary Definition ist erlaubt!");
      boundaryDecisionTask = [{
        bpmnTaskId: tmpBoundary.id,
        name: tmpBoundary.name,
        isBoundaryEvent: true,
        type: DecisionTaskTypes.Boundary,
        boundaryEventType: tmpBoundary.eventDefinitions[tmpBoundary.eventDefinitions.length - 1].$type.toString()
      } as DecisionTask];
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

  public setFlowName(sourceTaskId: string, targetTaskId: string, name: string): void {
    let obj = this.getFlowObject(sourceTaskId, targetTaskId);
    obj.name = name;
  }

  public getFlowName(sourceTaskId: string, targetTaskId: string): string {
    let flowObj = this.getFlowObject(sourceTaskId, targetTaskId);
    if (flowObj != null) {
      return flowObj.name;
    }
    return null;
  }

  private getFlowObject(sourceTaskId: string, targetTaskId: string): Bpmn.FlowElement {
    let sourceTask = this.getExistingTask(this.processId(), sourceTaskId);
    let targetObj = null;
    if (sourceTask.outgoing.length === 1 && sourceTask.outgoing.last().targetRef.$type === BPMN_EXCLUSIVEGATEWAY) {
      let gateway = sourceTask.outgoing.last().targetRef;
      targetObj = gateway.outgoing.find(out => out.targetRef.id === targetTaskId);
    } else {
      targetObj = sourceTask.outgoing.find(out => out.targetRef.id === targetTaskId);
    }
    return targetObj;
  }

  public hasTimerStartEvent(): boolean {
    return this.getTimerStartEvent() != null;
  }

  public hasMailStartEvent(): boolean {
    return this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === BPMN_MESSAGEEVENTDEFINITION) != null) != null;
  }

  public getTimerStartEvent(): Bpmn.StartEvent {
    return this.getStartEvents(this.processId()).find(start => start.eventDefinitions != null && start.eventDefinitions.find(ev => ev.$type === BPMN_TIMEREVENTDEFINITION) != null);
  }

}