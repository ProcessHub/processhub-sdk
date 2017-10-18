import { assert } from "chai";
import { ProcessDetails } from "./processinterfaces";
import { ProcessAccessRights } from "./processrights";
import { ProcessState } from "./phclient";
import { processReducer } from "./processreducer";
import { PROCESSLOADED_MESSAGE } from "./legacyapi";
import { createWorkspaceId, createId } from "../tools/guid";
import { ProcessActionType } from "./processactions";

const testProcess: ProcessDetails = {
  workspaceId: "2000E70281B5ECD5",
  displayName: "Testprocess",
  urlName: "testprocess",
  fullUrl: "/@testworkspace/p/testprocess",
  previewUrl: "https://s3.eu-central-1.amazonaws.com/processhub/2000E70281B5ECD5/8700E70281B5ECD5/preview.svg",
  description: "This is a test process",
  processId: "8700E70281B5ECD5",
  // userRole gibt für Tests immer volle Rechte, da viele Tests sonst scheitern.
  // Für eine Prüfung des Rechtesystems selbst ist das natürlich nicht geeignet
  userRights: ProcessAccessRights.EditProcess,
  extras: {}
};

describe("sdk", function () {
  describe("process", function () {
    describe("processReducer", function () {

      describe("soll PROCESSLOADED_MESSAGE korrekt reducen", function () {
        it("soll currentProcess korrekt setzen", function () {

          let oldState = new ProcessState();
          let newState = processReducer(oldState, {
            type: PROCESSLOADED_MESSAGE,
            processDetails: testProcess
          });

          assert.deepEqual(newState.currentProcess, testProcess);
        });

      });

      it("soll PROCESSACTION_CREATEINDB korrekt reducen", function () {
        let workspaceId = createWorkspaceId();
        let processId = createId();

        const desc = "Unittest process decription";
        const name = "Unittest process";
        let oldState = new ProcessState();
        let newState = processReducer(oldState, {
          type: ProcessActionType.CreateInDb,
          workspaceId: workspaceId,
          processId: processId,
          description: desc,
          processName: name
        });

        assert.equal(newState.currentProcess.workspaceId, workspaceId, "workspaceId: expected " + workspaceId + ", was " + newState.currentProcess.workspaceId);
        assert.equal(newState.currentProcess.processId, processId, "processId: expected " + processId + ", was " + newState.currentProcess.processId);
        assert.equal(newState.currentProcess.displayName, name, "displayName: expected " + name + ", was " + newState.currentProcess.displayName);
        assert.equal(newState.currentProcess.description, desc, "description: expected " + desc + ", was " + newState.currentProcess.description);
      });

      it("soll PROCESSACTION_CREATEINDBDONE korrekt reducen", function () {
        let workspaceId = createWorkspaceId();
        let processId = createId();

        const desc = "Unittest process decription";
        const name = "Unittest process";

        let oldState = new ProcessState();
        let newState = processReducer(oldState, {
          type: ProcessActionType.CreateInDb,
          workspaceId: workspaceId,
          processId: processId,
          description: desc,
          processName: name
        });

        newState = processReducer(newState, {
          type: ProcessActionType.CreateInDbDone
        });

        assert.equal(newState.currentProcess.workspaceId, workspaceId);
        assert.equal(newState.currentProcess.processId, processId);
        assert.equal(newState.currentProcess.displayName, name);
        assert.equal(newState.currentProcess.description, desc);
        assert.equal(newState.errorMessage, undefined);
      });

      it("soll PROCESSACTION_FAILED korrekt reducen", function () {
        let workspaceId = createWorkspaceId();
        let processId = createId();

        const desc = "Unittest process decription";
        const name = "Unittest process";

        let oldState = new ProcessState();
        let newState = processReducer(oldState, {
          type: ProcessActionType.CreateInDb,
          workspaceId: workspaceId,
          processId: processId,
          description: desc,
          processName: name
        });

        const error = "Error";

        newState = processReducer(newState, {
          type: ProcessActionType.Failed,
          errorMessage: error
        });

        assert.equal(newState.currentProcess.workspaceId, workspaceId);
        assert.equal(newState.currentProcess.processId, processId);
        assert.equal(newState.currentProcess.displayName, name);
        assert.equal(newState.currentProcess.description, desc);
        assert.equal(newState.errorMessage, error);
      });

      it("soll PROCESSACTION_DELETEFROMDB korrekt reducen", function () {
        let processId = createId();

        let oldState = new ProcessState();
        let newState = processReducer(oldState, {
          type: ProcessActionType.DeleteFromDb,
          processId: processId
        });

        assert.equal(newState.currentProcess.processId, processId);
      });

      it("soll PROCESSACTION_DELETEFROMDBDONE korrekt reducen", function () {
        let oldState = new ProcessState();
        let processId = createId();

        let newState = processReducer(oldState, {
          type: ProcessActionType.DeleteFromDb,
          processId: processId
        });
        newState = processReducer(newState, {
          type: ProcessActionType.DeleteFromDbDone,
        });

        assert.isTrue(newState.currentProcess == null, "currentProcess != null");
      });
    });
  });
});