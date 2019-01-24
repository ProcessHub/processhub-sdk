import * as _ from "lodash";
import * as ProcessActions from "./processactions";
import * as Process from "../process";
import * as StateHandler from "../statehandler";
import * as update from "immutability-helper";
import { isTrue } from "../tools/assert";
import { PROCESSLOADED_MESSAGE, ProcessLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { ResetStore } from "../statehandler/actions";

export function processReducer(processState: Process.ProcessState, action: any): Process.ProcessState {

  if (processState == null || action && action.type == ResetStore) {
    // init state
    processState = new Process.ProcessState();
    processState.processCache = {};
  }
  if (action == null || action.type == ResetStore)
    return processState;

  isTrue(action.type != null, "processReducer: action.type is undefined");

  switch (action.type) {
    // processState darf NICHT direkt geändert werden, da React sonst die Änderungen nicht erkennen kann
    // und kein Rendering auslöst.
    // siehe https://github.com/kolodny/immutability-helper

    case PROCESSLOADED_MESSAGE:

      processState.currentProcess = StateHandler.mergeProcessToCache((<ProcessLoadedMessage>action).processDetails);

      let processChanged = !_.isEqual(processState.currentProcess, processState.lastDispatchedProcess);
      processState.lastDispatchedProcess = _.cloneDeep(processState.currentProcess);

      // React cannot detect state changes in objects. Updating cacheState triggers rendering
      // -> only render if data has changed
      if (processChanged) {
        return update(processState, {
          cacheState: { $set: createId() }
        });
      } else
        return processState;

    case ProcessActions.ProcessActionType.Save:
      if (processState.currentProcess) {
        return update(processState, {
          currentProcess: {
            extras: {
              bpmnXml: { $set: <ProcessActions.ProcessActionSave><any>action.xmlStr },
              bpmnProcess: { $set: <ProcessActions.ProcessActionSave><any>action.bpmnProcess }
            }
          }
        });
      } else {
        return processState;
      }

    case ProcessActions.ProcessActionType.CreateInDb:
      let createInDbAction = <ProcessActions.ProcessActionCreateInDb><any>action;
      isTrue(createInDbAction.workspaceId != null && createInDbAction.workspaceId != null, ProcessActions.ProcessActionType.CreateInDb + ": workspaceId = " + createInDbAction.workspaceId);
      processState.currentProcess = processState.currentProcess || {
        workspaceId: createInDbAction.workspaceId,
        processId: createInDbAction.processId,
        displayName: createInDbAction.processName,
        description: createInDbAction.description,
        extras: {},
      };
      return update(processState, {
        currentProcess: {
          description: { $set: createInDbAction.description },
          displayName: { $set: createInDbAction.processName },
          processId: { $set: createInDbAction.processId },
          workspaceId: { $set: createInDbAction.workspaceId },
        }
      });

    case ProcessActions.ProcessActionType.CreateInDbDone:
      return update(processState, {
        cacheState: { $set: createId() }
      });

    case ProcessActions.ProcessActionType.Failed:
      let failedAction = <ProcessActions.ProcessActionFailed><any>action;
      processState.errorMessage = failedAction.errorMessage;
      return processState;

    case ProcessActions.ProcessActionType.DeleteFromDb: {
      let deleteAction = <ProcessActions.ProcessActionDeleteFromDb><any>action;
      processState.currentProcess = processState.currentProcess
        || { processId: deleteAction.processId, workspaceId: null, displayName: null, description: null, extras: {} };
      return update(processState, {
        currentProcess: {
          processId: { $set: deleteAction.processId }
        }
      });
    }

    case ProcessActions.ProcessActionType.DeleteFromDbDone:
      return update(processState, {
        currentProcess: { $set: null }
      });

    default:
      return processState;
  }
}
