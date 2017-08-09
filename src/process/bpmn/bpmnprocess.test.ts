import * as PH from "../../";
import BpmnModdle = require("bpmn-moddle");
import { assert } from "chai";
import * as Process from "../../process";
import * as BpmnProcess from "./bpmnprocess";
import { Bpmn } from "../../process/bpmn";

async function createTestBpmnProcess(): Promise<Process.BpmnProcess> {
  let bpmnProcess: Process.BpmnProcess = new Process.BpmnProcess();
  let reply: Process.LoadTemplateReply = await Process.createBpmnTemplate(bpmnProcess.moddle);

  bpmnProcess.bpmnXml = reply.bpmnXml;

  return bpmnProcess;
}

describe("common", function () {
  describe("process", function () {
    describe("bpmnprocess", function () {

      describe("getBpmnId", function () {
        it("soll nur eine ID zurückgeben", function () {
          let id: string = Process.BpmnProcess.getBpmnId();
          assert(PH.Tools.isId(id));
        });

        it("soll eine ID mit einem Prefix zurückgeben", function () {
          let id: string = Process.BpmnProcess.getBpmnId(BpmnProcess.BPMN_USERTASK);
          assert(id.length > 16);
        });

        it("soll eine ID mit der gleichen länge trotz Parameter zurückgeben", function () {
          let id: string = Process.BpmnProcess.getBpmnId("BPMNTASK");
          assert(PH.Tools.isId(id));
        });
      });

      describe("BpmnProcessClass", function () {
        it("instanziiert BpmnProcess Objekt und ruft loadFromTemplate auf", async function () {
          let process: Process.BpmnProcess = new Process.BpmnProcess();
          await process.loadFromTemplate();
        });

        it("erstellt mit dem BpmnModdleHelper ein Template", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess != null);
        });

        it("soll alle Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);
        });

        it("soll id von BPMN zurückgeben", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          assert(bpmnProcess.processId() !== "");
          assert(bpmnProcess.processId() != null);
          assert(bpmnProcess.definitionId() !== "");
          assert(bpmnProcess.definitionId() != null);
          assert(bpmnProcess.processId().indexOf("_") > -1);
          assert(bpmnProcess.definitionId().indexOf("_") > -1);
        });

        it("soll ausgewählten Prozesse aus dem BPMN Prozess zurückgeben", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);
        });

        it("soll Start oder EndEvent von ausgewähltem Prozess zurückgeben", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();

          let processes = bpmnProcess.getProcesses();
          assert(processes.length > 0);
          assert(processes.length === 1);

          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          assert(process.id != null);
          assert(process.id === processes[0].id);

          // wie test zuvor bis hier her

          let startEvent: Bpmn.StartEvent = bpmnProcess.getStartEvent(process.id);
          assert(startEvent.outgoing[0].targetRef.$type === BpmnProcess.BPMN_ENDEVENT);
          assert(startEvent.outgoing[0].sourceRef.$type === BpmnProcess.BPMN_STARTEVENT);

          let endEvent: Bpmn.EndEvent = bpmnProcess.getEndEvent(process.id);
          assert(endEvent.incoming[0].sourceRef.$type === BpmnProcess.BPMN_STARTEVENT);
          assert(endEvent.incoming[0].targetRef.$type === BpmnProcess.BPMN_ENDEVENT);
        });

        it("soll Lane anlegen", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, "Test Lane");

          let lanes: Bpmn.Lane[] = bpmnProcess.getLanes(process.id, false);

          assert(lanes.length === 1);
          assert(lanes[lanes.length - 1].id === testLaneId);

        });

        it("soll Task anlegen und modifizieren", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";

          let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);
          let testTaskName: string = "Test Aufgabe";
          let rowDetails: Process.RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName, taskId: null };

          let testTaskId: string = bpmnProcess.addOrModifyTask(process.id, rowDetails);

          let testTaskObject: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;
          assert(testTaskObject.name === testTaskName);
          assert(testTaskObject.id === testTaskId);
          assert(testTaskObject.$type === BpmnProcess.BPMN_USERTASK);

          testTaskName += " Test Edit";
          rowDetails.task = testTaskName;
          testTaskId = bpmnProcess.addOrModifyTask(process.id, rowDetails);

          testTaskObject = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;
          assert(testTaskObject.name === testTaskName);
          assert(testTaskObject.id === testTaskId);
          assert(testTaskObject.$type === BpmnProcess.BPMN_USERTASK);

          let allLanes: Bpmn.Lane[] = bpmnProcess.getLanes(process.id, false);

          let lanesWithTasks: Bpmn.Lane[] = bpmnProcess.getLanes(process.id, true);

          assert(allLanes.length === lanesWithTasks.length);
          assert(lanesWithTasks[0].name === testLaneName);
        });

        it("soll Task aus Lane entfernen", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";
          let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);
          let testLane: Bpmn.Lane = bpmnProcess.getProcessLane(process.id, testLaneId);

          assert(testLane.flowNodeRef.length === 0);

          let testTaskName: string = "Test Aufgabe";
          let rowDetails: Process.RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName, taskId: null, laneId: testLaneId };
          let testTaskId: string = bpmnProcess.addOrModifyTask(process.id, rowDetails);

          // +2 hier wegen dem Start und End Event!!!!
          assert(testLane.flowNodeRef.length === (1 + 2));

          let testTaskObject: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;

          bpmnProcess.removeTaskObjectFromLanes(process.id, testTaskObject);

          assert(testLane.flowNodeRef.length === 2);
          bpmnProcess.removeTaskObjectFromLanes(process.id, bpmnProcess.getStartEvent(process.id));
          bpmnProcess.removeTaskObjectFromLanes(process.id, bpmnProcess.getEndEvent(process.id));
          assert(testLane.flowNodeRef.length === 0);
        });

        it("soll Extension Values einfügen und lesen", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";

          let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);
          let testTaskName: string = "Test Aufgabe";
          let rowDetails: Process.RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName, taskId: null };

          let testTaskId: string = bpmnProcess.addOrModifyTask(process.id, rowDetails);

          let testTaskObject: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId) as Bpmn.UserTask;
          assert(testTaskObject.name === testTaskName);
          assert(testTaskObject.id === testTaskId);
          assert(testTaskObject.$type === BpmnProcess.BPMN_USERTASK);

          let testDescription = "tritra test 123!";
          BpmnProcess.BpmnProcess.addOrUpdateExtension(testTaskObject, Process.TaskSettings.Description as Process.TaskSettings, testDescription, "Text");

          let extensionValues = bpmnProcess.getExtensionValues(testTaskObject);

          assert(extensionValues.description === testDescription, extensionValues.description + " == " + testDescription);
        });
        describe("deleteTask", function () {
          it("soll Task löschen und Reihenfolge überprüfen", async function () {
            let bpmnProcess: Process.BpmnProcess;
            bpmnProcess = await createTestBpmnProcess();
            let processes = bpmnProcess.getProcesses();
            let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

            // wie test zuvor bis hier her
            let testLaneName: string = "Test Lane";
            let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
            let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

            let testLaneName2: string = "Test Lane2";
            let testId2: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
            let testLaneId2: string = bpmnProcess.addLane(process.id, testId2, testLaneName2);


            let testTaskName1: string = "Test Aufgabe A";
            let rowDetails1: Process.RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName1, taskId: null };
            let testTaskId1: string = bpmnProcess.addOrModifyTask(process.id, rowDetails1);

            let testTaskObject1: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId1) as Bpmn.UserTask;
            assert(testTaskObject1.name === testTaskName1);
            assert(testTaskObject1.id === testTaskId1);
            assert(testTaskObject1.$type === BpmnProcess.BPMN_USERTASK);


            let testTaskName2: string = "Test Aufgabe B";
            let rowDetails2: Process.RowDetails = { rowNumber: 1, selectedRole: testLaneId2, task: testTaskName2, taskId: null };
            let testTaskId2: string = bpmnProcess.addOrModifyTask(process.id, rowDetails2);

            let testTaskObject2: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId2) as Bpmn.UserTask;
            assert(testTaskObject2.name === testTaskName2);
            assert(testTaskObject2.id === testTaskId2);
            assert(testTaskObject2.$type === BpmnProcess.BPMN_USERTASK);


            let testTaskName3: string = "Test Aufgabe C";
            let rowDetails3: Process.RowDetails = { rowNumber: 2, selectedRole: testLaneId, task: testTaskName3, taskId: null };
            let testTaskId3: string = bpmnProcess.addOrModifyTask(process.id, rowDetails3);

            let testTaskObject3: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId3) as Bpmn.UserTask;
            assert(testTaskObject3.name === testTaskName3, testTaskObject3.name + " === " + testTaskName3);
            assert(testTaskObject3.id === testTaskId3, testTaskObject3.id + " === " + testTaskId3);
            assert(testTaskObject3.$type === BpmnProcess.BPMN_USERTASK, testTaskObject3.$type + " === " + BpmnProcess.BPMN_USERTASK);


            // 3 Aufgaben hinzugefügt sollte so aussehen nun Start -> a -> b -> c -> Ende
            let tasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasks.length === 3);

            let lanes = bpmnProcess.getLanes(bpmnProcess.processId(), false);
            assert(lanes.length === 2);

            bpmnProcess.deleteTask(bpmnProcess.processId(), rowDetails2);

            // 1 Aufgabe gelöscht sollte so aussehen nun Start -> a -> c -> Ende
            let tasksEnd = bpmnProcess.getSortedTasks(bpmnProcess.processId());
            assert(tasksEnd.length === 2);

            lanes = bpmnProcess.getLanes(bpmnProcess.processId(), false);
            assert(lanes.length === 1);
          });
        });
        it("soll Task Reihenfolge ändern/verschieben", async function () {
          let bpmnProcess: Process.BpmnProcess;
          bpmnProcess = await createTestBpmnProcess();
          let processes = bpmnProcess.getProcesses();
          let process: Bpmn.Process = bpmnProcess.getProcess(processes[0].id);

          // wie test zuvor bis hier her
          let testLaneName: string = "Test Lane";

          let testId: string = BpmnProcess.BpmnProcess.getBpmnId(BpmnProcess.BPMN_LANE);
          let testLaneId: string = bpmnProcess.addLane(process.id, testId, testLaneName);

          let testTaskName1: string = "Test Aufgabe A";
          let rowDetails1: Process.RowDetails = { rowNumber: 0, selectedRole: testLaneId, task: testTaskName1, taskId: null };
          let testTaskId1: string = bpmnProcess.addOrModifyTask(process.id, rowDetails1);

          let testTaskObject1: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId1) as Bpmn.UserTask;
          assert(testTaskObject1.name === testTaskName1);
          assert(testTaskObject1.id === testTaskId1);
          assert(testTaskObject1.$type === BpmnProcess.BPMN_USERTASK);


          let testTaskName2: string = "Test Aufgabe B";
          let rowDetails2: Process.RowDetails = { rowNumber: 1, selectedRole: testLaneId, task: testTaskName2, taskId: null };
          let testTaskId2: string = bpmnProcess.addOrModifyTask(process.id, rowDetails2);

          let testTaskObject2: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId2) as Bpmn.UserTask;
          assert(testTaskObject2.name === testTaskName2);
          assert(testTaskObject2.id === testTaskId2);
          assert(testTaskObject2.$type === BpmnProcess.BPMN_USERTASK);


          let testTaskName3: string = "Test Aufgabe C";
          let rowDetails3: Process.RowDetails = { rowNumber: 2, selectedRole: testLaneId, task: testTaskName3, taskId: null };
          let testTaskId3: string = bpmnProcess.addOrModifyTask(process.id, rowDetails3);

          let testTaskObject3: Bpmn.UserTask = bpmnProcess.getExistingTask(process.id, testTaskId3) as Bpmn.UserTask;
          assert(testTaskObject3.name === testTaskName3, testTaskObject3.name + " === " + testTaskName3);
          assert(testTaskObject3.id === testTaskId3, testTaskObject3.id + " === " + testTaskId3);
          assert(testTaskObject3.$type === BpmnProcess.BPMN_USERTASK, testTaskObject3.$type + " === " + BpmnProcess.BPMN_USERTASK);

          // 3 Aufgaben hinzugefügt sollte so aussehen nun Start -> a -> b -> c -> Ende
          let tasks = bpmnProcess.getSortedTasks(bpmnProcess.processId());
          assert(tasks.length === 3);
          assert(tasks[0].id === testTaskId1);
          assert(tasks[1].id === testTaskId2);
          assert(tasks[2].id === testTaskId3);

          bpmnProcess.switchTaskWithNextTask(bpmnProcess.processId(), rowDetails2);

          // 1 Aufgabe gelöscht sollte so aussehen nun Start -> a -> c -> b -> Ende
          let tasksEnd = bpmnProcess.getSortedTasks(bpmnProcess.processId());
          assert(tasksEnd.length === 3);

          assert(tasksEnd[0].id === testTaskId1, tasksEnd[0] + " === " + testTaskId1);
          assert(tasksEnd[2].id === testTaskId2, tasksEnd[2] + " === " + testTaskId2);
          assert(tasksEnd[1].id === testTaskId3, tasksEnd[1] + " === " + testTaskId3);
        });
      });

      describe("get/setTaskDescription", function () {
        const bpmnModdle = new BpmnModdle([], {});

        it("soll Description für SendTask setzen und wieder lesen", function () {
          const task = bpmnModdle.create("bpmn:SendTask", {});
          BpmnProcess.BpmnProcess.setTaskDescription(task, "description");
          assert.equal(BpmnProcess.BpmnProcess.getTaskDescription(task), "description");
        });

        it("soll Description für UserTask setzen und wieder lesen", function () {
          const task = bpmnModdle.create("bpmn:UserTask", {});
          BpmnProcess.BpmnProcess.setTaskDescription(task, "description");
          assert.equal(BpmnProcess.BpmnProcess.getTaskDescription(task), "description");
        });

      });
    });
  });
});