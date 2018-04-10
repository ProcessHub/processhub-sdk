import BpmnModdle = require("bpmn-moddle");
import { assert, expect } from "chai";
import { Bpmn } from "../../process/bpmn";
import { isId } from "../../tools/guid";
import { BpmnProcess, BPMN_USERTASK, BPMN_ENDEVENT, BPMN_STARTEVENT, BPMN_LANE } from "./bpmnprocess";
import { LoadTemplateReply } from "../legacyapi";
import { createBpmnTemplate } from "./bpmnmoddlehelper";
import { RowDetails } from "../phclient";
import { TaskSettings } from "../processinterfaces";
import { readFileAsync } from "../../test/testtools";
import { defineLocale } from "moment";

let TestRowDetails: RowDetails[] = [];

async function addTask(rowDetails: RowDetails[], rowNumber: number, bpmnProcess: any): Promise<void> {
  let targetRow: RowDetails = rowDetails[rowNumber];
  let endElement = bpmnProcess.getEndEvents(bpmnProcess.processId())[0];
  rowDetails.splice((rowNumber + 1), 0, { rowNumber: (rowNumber + 1), selectedRole: rowDetails[rowNumber].selectedRole, task: "", taskId: null, laneId: rowDetails[rowNumber].laneId, taskType: BPMN_USERTASK, jumpsTo: rowDetails[rowNumber].jumpsTo });

  let firstProcess = bpmnProcess.processId();
  bpmnProcess.addTaskBetween(rowDetails, (rowNumber + 1));

  rowDetails[rowNumber].jumpsTo = [rowDetails[(rowNumber + 1)].taskId];

  // update higher rownumbers
  let counter: number = rowNumber + 1;
  while (counter < rowDetails.length) {
    rowDetails[counter].rowNumber = counter;
    counter++;
  }
}

async function createTestBpmnProcess(): Promise<BpmnProcess> {
  let bpmnProcess: BpmnProcess = new BpmnProcess();
  let reply: LoadTemplateReply = await createBpmnTemplate(bpmnProcess.moddle);

  bpmnProcess.bpmnXml = reply.bpmnXml;

  let sortedTasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
  assert.isTrue(sortedTasks.length == 2, "wrong template process 1");
  let start = bpmnProcess.getStartEvents(bpmnProcess.processId());
  assert.isTrue(start.length == 1, "wrong template process 2");
  let rowDetails: RowDetails[] = [];

  let startElem = start.last();
  let testLane = bpmnProcess.getLaneOfFlowNode(startElem.id);

  rowDetails.push({ rowNumber: 0, selectedRole: testLane.id, task: startElem.name, taskId: startElem.id, laneId: testLane.id, taskType: startElem.$type, jumpsTo: startElem.outgoing.map(out => out.targetRef.id) });

  let counter = 1;
  rowDetails = rowDetails.concat(sortedTasks.map((r): RowDetails => {
    let testLane = bpmnProcess.getLaneOfFlowNode(r.id);
    let row = { rowNumber: counter, selectedRole: testLane.id, task: r.name, taskId: r.id, laneId: testLane.id, taskType: r.$type, jumpsTo: r.outgoing.map(out => out.targetRef.id) } as RowDetails;
    counter++;
    return row;
  }));

  assert.isTrue(rowDetails.length === 3, "wrong template 3");
  TestRowDetails = rowDetails;

  return bpmnProcess;
}

describe("sdk", function () {
  describe("process", function () {
    describe("bpmnprocess", function () {

      describe("toXmlString", function () {
        it("loads and exports a bpmn file with an empty lane", async function () {
          const processXml: string = await readFileAsync("./src/test/testfiles/emptylane.bpmn");
          const bpmnProcess: BpmnProcess = new BpmnProcess();
          await bpmnProcess.loadXml(processXml);
          const exportedXmlString: string = await bpmnProcess.toXmlString();

          // load exported xml with moddle
          const moddle: BpmnModdle = new BpmnModdle();
          const definitions = await new Promise<Bpmn.Definitions>((resolve, reject) => {
            moddle.fromXML(exportedXmlString, (err, def) => {
              if (err) {
                reject(err);
              }
              resolve(def);
            });
          });

          // check if empty lane is still there
          const process: Bpmn.Process = definitions.rootElements.find(e => e.$type === "bpmn:Process") as Bpmn.Process;
          const [laneSet, ...laneSets] = process.laneSets;
          expect(laneSet.lanes).not.to.be.undefined;
          expect(laneSet.lanes.length).to.equal(1);
        });
      });

      describe("getBpmnId", function () {
        it("soll nur eine ID zurückgeben", function () {
          let id: string = BpmnProcess.getBpmnId();
          assert(isId(id));
        });

        it("soll eine ID mit einem Prefix zurückgeben", function () {
          let id: string = BpmnProcess.getBpmnId(BPMN_USERTASK);
          assert(id.length > 16);
        });

        it("soll eine ID mit der gleichen länge trotz Parameter zurückgeben", function () {
          let id: string = BpmnProcess.getBpmnId("BPMNTASK");
          assert(isId(id));
        });
      });

      describe("BpmnProcessClass", function () {
        it("instanziiert BpmnProcess Objekt und ruft loadFromTemplate auf", async function () {
          let process: BpmnProcess = new BpmnProcess();
          await process.loadFromTemplate();
        });

        it("erstellt mit dem BpmnModdleHelper ein Template", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess != null);
        });

        it("soll alle Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);
        });

        it("soll id von BPMN zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess.processId().indexOf("_") > -1);
          assert(bpmnProcess.definitionId().indexOf("_") > -1);
        });

        it("soll ausgewählten Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);
        });

        it("soll Start oder EndEvent von ausgewähltem Prozess zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);

          // wie test zuvor bis hier her

          let startEvents: Bpmn.StartEvent[] = bpmnProcess.getStartEvents(process.id);
          assert(startEvents[0].outgoing[0].targetRef.$type === BPMN_USERTASK);
          assert(startEvents[0].outgoing[0].sourceRef.$type === BPMN_STARTEVENT);

          let endEvent: Bpmn.EndEvent = bpmnProcess.getEndEvents(process.id)[0];
          assert(endEvent.incoming[0].sourceRef.$type === BPMN_USERTASK);
          assert(endEvent.incoming[0].targetRef.$type === BPMN_ENDEVENT);
        });

        it("soll Lane anlegen", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, "Test Lane");

          let lanes: Bpmn.Lane[] = bpmnProcess.getLanes(process.id, false);

          assert(lanes.length === 3);
          assert(lanes[lanes.length - 1].id === testLaneId);

        });

        it("soll Task aus Lane entfernen", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let rowDetails = JSON.parse(JSON.stringify(TestRowDetails));

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";
          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLane: Bpmn.Lane = bpmnProcess.getProcessLane(process.id, rowDetails[1].laneId);


          assert(testLane.flowNodeRef.length === 2);

          let testTaskName: string = "Test Aufgabe";

          await addTask(rowDetails, 1, bpmnProcess);

          bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName);
          
          assert.isTrue(bpmnProcess.getExistingTask(bpmnProcess.processId(), rowDetails[2].taskId).name === testTaskName);
          
          let testTaskId: string = rowDetails[2].taskId;

          // +2 hier wegen dem Start und End Event!!!!

          assert(testLane.flowNodeRef.length === 3);

          let testTaskObject: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;

          bpmnProcess.removeTaskObjectFromLanes(process.id, testTaskObject);

          assert(testLane.flowNodeRef.length === 2);
          bpmnProcess.removeTaskObjectFromLanes(process.id, bpmnProcess.getStartEvents(process.id)[0]);
          assert(testLane.flowNodeRef.length === 1);
        });

        it("soll Extension Values einfügen und lesen", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";

          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);
          let rowDetails: RowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          let testTaskId: string = rowDetails[1].taskId;

          let testTaskObject: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;
          assert(testTaskObject.name === rowDetails[1].task);
          assert(testTaskObject.id === testTaskId);
          assert(testTaskObject.$type === BPMN_USERTASK);

          let testDescription = "tritra test 123!";
          BpmnProcess.addOrUpdateExtension(testTaskObject, TaskSettings.Description as TaskSettings, testDescription, "Text");

          let extensionValues = BpmnProcess.getExtensionValues(testTaskObject);

          assert(extensionValues.description === testDescription, extensionValues.description + " == " + testDescription);
        });
        describe("deleteTask", function () {
          it("soll Task löschen und Reihenfolge überprüfen", async function () {
            let bpmnProcess: BpmnProcess;
            bpmnProcess = await createTestBpmnProcess();
            let processes = bpmnProcess.getProcesses();
            let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

            // wie test zuvor bis hier her
            let testLaneName: string = "Test Lane";
            let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
            let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

            let testLaneName2: string = "Test Lane2";
            let testId2: string = BpmnProcess.getBpmnId(BPMN_LANE);
            let testLaneId2: string = bpmnProcess.addLane(process.id, testId2, testLaneName2);


            let testTaskName1: string = "Test Aufgabe A";

            let rowDetails: RowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

            let testTaskId1: string = rowDetails[1].taskId;


            let testTaskObject1: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId1) as Bpmn.UserTask;
            bpmnProcess.changeTaskName(rowDetails[1].taskId, testTaskName1);

            assert(testTaskObject1.name === testTaskName1);
            assert(testTaskObject1.id === testTaskId1);
            assert(testTaskObject1.$type === BPMN_USERTASK);


            let testTaskName2: string = "Test Aufgabe B";
            let rowDetails2: RowDetails = { rowNumber: 1, selectedRole: testLaneId2, task: testTaskName2, taskId: null, taskType: BPMN_USERTASK, jumpsTo: [] };
            let testTaskId2: string = rowDetails[2].taskId;

            let testTaskObject2: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId2) as Bpmn.UserTask;
            bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName2);

            assert(testTaskObject2.name === testTaskName2);
            assert(testTaskObject2.id === testTaskId2);
            assert(testTaskObject2.$type === BPMN_USERTASK);


            let testTaskName3: string = "Test Aufgabe C";
            let testTaskId3: string = rowDetails[2].taskId;

            let testTaskObject3: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId3) as Bpmn.UserTask;
            bpmnProcess.changeTaskName(rowDetails[2].taskId, testTaskName3);

            assert(testTaskObject3.name === testTaskName3, testTaskObject3.name + " === " + testTaskName3);
            assert(testTaskObject3.id === testTaskId3, testTaskObject3.id + " === " + testTaskId3);
            assert(testTaskObject3.$type === BPMN_USERTASK, testTaskObject3.$type + " === " + BPMN_USERTASK);

            let tasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasks.length === 2);

            let lanes = bpmnProcess.getLanes(bpmnProcess.processId(), false);
            console.log(rowDetails);
            assert(lanes.length === 4);

            bpmnProcess.deleteTask(bpmnProcess.processId(), rowDetails, 2);

            let tasksEnd = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasksEnd.length === 1);

            lanes = bpmnProcess.getLanes(bpmnProcess.processId(), true);
            assert(lanes.length === 1);
          });
        });
      });

      describe("get/setTaskDescription", function () {
        const bpmnModdle = new BpmnModdle([], {});

        it("soll Description für SendTask setzen und wieder lesen", function () {
          const task = bpmnModdle.create("bpmn:SendTask", {});
          BpmnProcess.setTaskDescription(task, "description");
          assert.equal(BpmnProcess.getFlowNodeDescription(task), "description");
        });

        it("soll Description für UserTask setzen und wieder lesen", function () {
          const task = bpmnModdle.create("bpmn:UserTask", {});
          BpmnProcess.setTaskDescription(task, "description");
          assert.equal(BpmnProcess.getFlowNodeDescription(task), "description");
        });

      });

      describe("getFollowingSequenceFlowName", async function () {

        it("soll Following Sequence Flow Name zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let testLaneName: string = "Test Lane";
          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

          let testTaskName1: string = "Test Aufgabe A";
          let rowDetails1: RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName1, taskId: null, taskType: BPMN_USERTASK, jumpsTo: [] };


          let rowDetails: RowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          let testTaskId1: string = rowDetails[1].taskId;

          let taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId1);
          assert.isTrue(taskObj.outgoing.length == 1, "wrong outgoing");

          let checkName = "Test Sequence Name 123";
          taskObj.outgoing[taskObj.outgoing.length - 1].name = checkName;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), checkName, "Sequence Flow Name wrong");
        });

        it("soll Null zurückgeben", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let testLaneName: string = "Test Lane";
          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

          let testTaskName1: string = "Test Aufgabe A";
          let rowDetails1: RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName1, taskId: null, taskType: BPMN_USERTASK, jumpsTo: [] };
          
          let rowDetails: RowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          let testTaskId1: string = rowDetails[1].taskId;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), null, "Sequence Flow Name wrong");
        });

        it("soll Null zurückgeben too much outgoings", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let testLaneName: string = "Test Lane";
          let testId: string = BpmnProcess.getBpmnId(BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

          let testTaskName1: string = "Test Aufgabe A";
          let rowDetails1: RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName1, taskId: null, taskType: BPMN_USERTASK, jumpsTo: [] };
          let rowDetails: RowDetails[] = JSON.parse(JSON.stringify(TestRowDetails));

          let testTaskId1: string = rowDetails[1].taskId;

          let testTaskName2: string = "Test Aufgabe B";
          let rowDetails2: RowDetails = { rowNumber: 1, selectedRole: testLaneId, task: testTaskName2, taskId: null, taskType: BPMN_USERTASK, jumpsTo: [] };
          let testTaskId2: string = rowDetails[2].taskId; 

          let taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId1);
          assert.isTrue(taskObj.outgoing.length == 1, "wrong outgoing");

          let taskObj2 = bpmnProcess.getExistingTask(bpmnProcess.processId(), testTaskId2);
          assert.isTrue(taskObj2.outgoing.length == 1, "wrong outgoing");

          taskObj.outgoing.push(taskObj2.outgoing[taskObj2.outgoing.length - 1]);
          taskObj2.outgoing[taskObj2.outgoing.length - 1].sourceRef = taskObj;
          taskObj2.outgoing.pop();

          let checkName = "Test Sequence Name 123";
          taskObj.outgoing[taskObj.outgoing.length - 1].name = checkName;

          assert.equal(bpmnProcess.getFollowingSequenceFlowName(testTaskId1), null, "Sequence Flow Name wrong");
        });

        it("should check addtaskbetween method", async function () {
          let bpmnProcess: BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let sortedTasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
          assert.isTrue(sortedTasks.length == 2, "wrong template process 1");
          let start = bpmnProcess.getStartEvents(bpmnProcess.processId());
          assert.isTrue(start.length == 1, "wrong template process 2");
          let rowDetails: RowDetails[] = [];

          let startElem = start.last();
          let testLane = bpmnProcess.getLaneOfFlowNode(startElem.id);

          rowDetails.push({ rowNumber: 0, selectedRole: testLane.id, task: startElem.name, taskId: startElem.id, laneId: testLane.id, taskType: startElem.$type, jumpsTo: startElem.outgoing.map(out => out.targetRef.id) });

          let counter = 1;
          rowDetails = rowDetails.concat(sortedTasks.map((r): RowDetails => {
            let testLane = bpmnProcess.getLaneOfFlowNode(r.id);
            let row = { rowNumber: counter, selectedRole: testLane.id, task: r.name, taskId: r.id, laneId: testLane.id, taskType: r.$type, jumpsTo: r.outgoing.map(out => out.targetRef.id) } as RowDetails;
            counter++;
            return row;
          }));

          assert.isTrue(rowDetails.length === 3, "wrong template 3");

          let rowNumber = 1;
          let testTaskName = "Test Task Name 1337";
          rowDetails.splice(2, 0, { rowNumber: (rowNumber + 1), selectedRole: rowDetails[rowNumber].selectedRole, task: testTaskName, taskId: null, laneId: rowDetails[rowNumber].laneId, taskType: BPMN_USERTASK, jumpsTo: rowDetails[rowNumber].jumpsTo });

          bpmnProcess.addTaskBetween(rowDetails, 2);

          rowDetails[1].jumpsTo = [rowDetails[(2)].taskId];

          // update higher rownumbers
          let counter2: number = 1 + 1;
          while (counter2 < rowDetails.length) {
            rowDetails[counter2].rowNumber = counter2;
            counter2++;
          }

          assert.isTrue(rowDetails.length === 4, "error in addTaskBetween method");
          assert.isTrue(rowDetails[2].task === testTaskName, "wrong testtaskname");
          assert.isTrue(rowDetails[2].taskId != null, "taskId is not set after method");

          let newLane = bpmnProcess.getLaneOfFlowNode(rowDetails[rowNumber].taskId);
          assert.isTrue(newLane.id === rowDetails[2].laneId);
          assert.isTrue(newLane.id === rowDetails[2 - 1].laneId);

          let taskObj = bpmnProcess.getExistingTask(bpmnProcess.processId(), rowDetails[2].taskId);
          assert.isTrue(taskObj != null);
          bpmnProcess.changeTaskName(rowDetails[2].taskId, "TEST 123 a");
          assert.isTrue(taskObj.name === "TEST 123 a", "wrong testtaskname");


        });
      });
    });
  });
});