import * as Api from "../legacyapi";
import { rootStore, mergeInstanceToCache } from "../statehandler";
import { Dispatch } from "redux";
import { InstanceDetails, ResumeInstanceDetails, InstanceExtras } from "./instanceinterfaces";
import { ExecuteReply, ProcessEngineApiRoutes, UpdateInstanceReply, AbortReply, INSTANCELOADED_MESSAGE, InstanceLoadedMessage, GetInstanceDetailsReply } from "./legacyapi";

export const InstanceActionType = {
  Execute: "INSTANCEACTION_EXECUTE",
  Resume: "INSTANCEACTION_RESUME",
  Abort: "INSTANCEACTION_ABORT",
  Jump: "INSTANCEACTION_JUMP",
  GetInstanceDetails: "INSTANCEACTION_GETINSTANCEDETAILS",
  UpdateInstance: "INSTANCEACTION_UPDATEINSTANCE"
};
export type InstanceActionType = keyof typeof InstanceActionType;

export interface InstanceAction {
  readonly type: InstanceActionType;
}

export interface InstanceActionExecute extends InstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_EXECUTE";
  processId: string;
}

export interface InstanceActionUpdateInstance extends InstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_EXECUTE";
}

export interface InstanceActionResume extends InstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_RESUME";
}

export interface InstanceActionAbort extends InstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_ABORT";
}

export interface InstanceActionJump extends InstanceAction {
  readonly type: InstanceActionType; // "INSTANCEACTION_JUMP";
}

export async function executeInstance(processId: string, displayName: string, instanceDetails: InstanceDetails): Promise<ExecuteReply> {
  return await rootStore.dispatch(executeInstanceAction(processId, displayName, instanceDetails));
}

export function executeInstanceAction(processId: string, displayName: string, instanceDetails: InstanceDetails): <S>(dispatch: Dispatch<S>) => Promise<ExecuteReply> {

  return async <S>(dispatch: Dispatch<S>): Promise<ExecuteReply> => {
    let response: ExecuteReply = await Api.postJson(ProcessEngineApiRoutes.execute, {
      processId: processId,
      displayName: displayName,
      instanceDetails: instanceDetails
    });

    dispatch<InstanceActionExecute>({
      type: InstanceActionType.Execute as InstanceActionType,
      processId: processId
    });
    return response;
  };
}

export async function updateInstance(instanceDetails: InstanceDetails): Promise<UpdateInstanceReply> {
  return await rootStore.dispatch(updateInstanceAction(instanceDetails));
}

export function updateInstanceAction(instanceDetails: InstanceDetails): <S>(dispatch: Dispatch<S>) => Promise<UpdateInstanceReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<UpdateInstanceReply> => {
    let response: UpdateInstanceReply = await Api.postJson(ProcessEngineApiRoutes.updateInstance, {
      instanceDetails: instanceDetails
    });

    dispatch<InstanceActionUpdateInstance>({
      type: InstanceActionType.UpdateInstance as InstanceActionType
    });
    return response;
  };
}

export async function resumeProcess(resumeDetails: ResumeInstanceDetails): Promise<ExecuteReply> {
  return await rootStore.dispatch(resumeProcessAction(resumeDetails));
}

export function resumeProcessAction(resumeDetails: ResumeInstanceDetails): <S>(dispatch: Dispatch<S>) => Promise<ExecuteReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<ExecuteReply> => {
    let response: ExecuteReply = await Api.postJson(ProcessEngineApiRoutes.resume, {
      resumeDetails: resumeDetails
    });

    dispatch<InstanceActionResume>({
      type: InstanceActionType.Resume as InstanceActionType
    });
    return response;
  };
}

export async function abortInstance(instanceId: string): Promise<AbortReply> {
  return await rootStore.dispatch(abortInstanceAction(instanceId));
}

export function abortInstanceAction(instanceId: string): <S>(dispatch: Dispatch<S>) => Promise<AbortReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<AbortReply> => {
    let response: AbortReply = await Api.postJson(ProcessEngineApiRoutes.abort, {
      instanceId: instanceId
    });

    dispatch<InstanceActionAbort>({
      type: InstanceActionType.Abort as InstanceActionType
    });
    return response;
  };
}

// export async function jump(fromTodoId: string, toTaskId: string): Promise<Instance.JumpReply> {
//   PH.Assert.isTrue(fromTodoId.indexOf("Task_") === -1, "Die erste ID beim Jump muss die TodoId vom Todo in der Datenbank sein NICHT vom BPMNTASK wie die zweite!");
//   return await rootStore.dispatch(jumpAction(fromTodoId, toTaskId));
// }

// export function jumpAction(fromTodoId: string, toTaskId: string): <S>(dispatch: Dispatch<S>) => Promise<Instance.JumpReply> {
//   return async <S>(dispatch: Dispatch<S>): Promise<Instance.JumpReply> => {
//     let response: Instance.JumpReply = await Api.postJson(Instance.ProcessEngineApiRoutes.jump, {
//       fromTodoId: fromTodoId,
//       toBpmnTaskId: toTaskId
//     });

//     dispatch<InstanceActionJump>({
//       type: InstanceActionType.Jump as InstanceActionType
//     });
//     return response;
//   };
// }

export async function loadInstance(instanceId: string, instanceExtras?: InstanceExtras, forceReload: boolean = false): Promise<InstanceDetails> {
  let instanceState = rootStore.getState().instanceState;
  let cachedInstance = null;

  if (!forceReload && instanceState.instanceCache)
    cachedInstance = instanceState.instanceCache[instanceId];
  if (cachedInstance != null) {
    // Ignore call if all data 
    // PH.Instance.InstanceExtras.ExtrasState is server-only
    if ((instanceExtras & InstanceExtras.ExtrasFieldContents) && cachedInstance.extras.fieldContents)
      instanceExtras -= InstanceExtras.ExtrasFieldContents;
    if ((instanceExtras & InstanceExtras.ExtrasRoleOwners) && cachedInstance.extras.roleOwners)
      instanceExtras -= InstanceExtras.ExtrasRoleOwners;
    if ((instanceExtras & InstanceExtras.ExtrasAuditTrail) && cachedInstance.extras.auditTrail)
      instanceExtras -= InstanceExtras.ExtrasAuditTrail;
      if ((instanceExtras & InstanceExtras.ExtrasTodos) && cachedInstance.extras.todos)
      instanceExtras -= InstanceExtras.ExtrasTodos;      
    if ((instanceExtras & InstanceExtras.ExtrasRoleOwnersWithNames) && cachedInstance.extras.roleOwners) {
      // names available?
      for (let roleId in cachedInstance.extras.roleOwners) {
        let roleowners = cachedInstance.extras.roleOwners[roleId];
        for (let roleowner of roleowners) {
          if (roleowner.displayName != null) {
            if (instanceExtras & InstanceExtras.ExtrasRoleOwnersWithNames)
              instanceExtras -= InstanceExtras.ExtrasRoleOwnersWithNames;
            break;
          }
        }
      }
    }

    if (instanceExtras == 0) {
      // all data available from cache
      rootStore.dispatch({
        type: INSTANCELOADED_MESSAGE,
        instance: cachedInstance
      } as InstanceLoadedMessage);

      return cachedInstance;
    }
  }

  return (await rootStore.dispatch(loadInstanceAction(instanceId, instanceExtras))).instanceDetails;
}
export function loadInstanceAction(instanceId: string, getExtras: InstanceExtras = InstanceExtras.None): <S>(dispatch: Dispatch<S>) => Promise<GetInstanceDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetInstanceDetailsReply> => {
    let response: GetInstanceDetailsReply = await Api.getJson(ProcessEngineApiRoutes.getInstanceDetails, {
      instanceId: instanceId,
      getExtras: getExtras
    });
    if (response.instanceDetails)
      response.instanceDetails = mergeInstanceToCache(response.instanceDetails);

    let message: InstanceLoadedMessage = {
      type: INSTANCELOADED_MESSAGE,
      instance: response.instanceDetails
    };
    dispatch(message);

    return response;
  };
}
