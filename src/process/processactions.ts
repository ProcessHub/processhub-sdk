import * as Api from "../legacyapi";
import * as _ from "lodash";
import { rootStore } from "../statehandler";
import { Dispatch } from "redux";
import * as StateHandler from "../statehandler";
import { BpmnProcess } from "./bpmn/bpmnprocess";
import { ProcessDetails, ProcessExtras, TimerStartEventConfiguration } from "./processinterfaces";
import { GetProcessDetailsReply, ProcessRequestRoutes, PROCESSLOADED_MESSAGE, ProcessLoadedMessage, GetProcessDetailsRequest, GetPublicProcessesReply, CopyProcessRequest, RateProcessRequest, UploadFileRequest, DeleteFileRequest, GetTimersOfProcessReply, GetTimersOfProcessRequest, SetTimersOfProcessReply, GetProcessStatisticsReply, GetProcessStatisticsRequest } from "./legacyapi";
import { isTrue } from "../tools/assert";
import { createId } from "../tools/guid";
import { tl } from "../tl";

export const ProcessActionType = {
  Save: "PROCESSACTION_SAVE",
  Changed: "PROCESSACTION_CHANGED",
  CreateInDb: "PROCESSACTION_CREATEINDB",
  CreateInDbDone: "PROCESSACTION_CREATEINDBDONE",
  DeleteFromDb: "PROCESSACTION_DELETEFROMDB",
  DeleteFromDbDone: "PROCESSACTION_DELETEFROMDBDONE",
  GetProcessDetails: "PROCESSACTION_GETPROCESSDETAILS",
  GetPublicProcessesDone: "PROCESSACTION_GETPUBLICPROCESSESDONE",
  GetProcessTimers: "PROCESSACTION_GETTIMERS",
  SetProcessTimers: "PROCESSACTION_SETTIMERS",
  Update: "PROCESSACTION_UPDATE",
  Failed: "PROCESSACTION_FAILED",
  RateDone: "PROCESSACTION_RATEDONE",
  GetProcessStatistics: "PROCESSACTION_GETPROCESSSTATISTICS",
};
export type ProcessActionType = keyof typeof ProcessActionType;

export interface ProcessAction {
  readonly type: ProcessActionType;
}

export interface ProcessActionFailed extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_FAILED";
  errorMessage: string;
}

export interface ProcessActionGetProcessDetails extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_GETPROCESSDETAILS";
  processId: string;
}

export interface ProcessActionGetTimers extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_GETTIMERS";
  processId: string;
}

export interface ProcessActionDeleteFromDbDone extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_DELETEFROMDBDONE";
}

export interface ProcessActionDeleteFromDb extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_DELETEFROMDB";
  processId: string;
}

export interface ProcessActionCreateInDb extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CREATEINDB";
  workspaceId: string;
  processId: string;
  processName: string;
  description: string;
}

export interface ProcessActionCreateInDbDone extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CREATEINDBDONE";
}

export interface ProcessActionUpdate extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_UPDATE";
  xmlStr: string;
}

export interface ProcessActionSave extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_SAVE";
  xmlStr: string;
  bpmnProcess: BpmnProcess;
}

export interface ProcessActionChanged extends ProcessAction {
  readonly type: ProcessActionType; // "PROCESSACTION_CHANGED";
}

export async function createProcessInDb(processDetails: ProcessDetails, accessToken: string = null): Promise<GetProcessDetailsReply> {
  return await rootStore.dispatch(createProcessInDbAction(processDetails, accessToken));
}

export function createProcessInDbAction(processDetails: ProcessDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  isTrue(processDetails.workspaceId != null && processDetails.workspaceId != null, "createProcessInDbAction: workspaceId = " + processDetails.workspaceId);
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    dispatch<ProcessActionCreateInDb>({
      type: ProcessActionType.CreateInDb as ProcessActionType,
      workspaceId: processDetails.workspaceId,
      processId: processDetails.processId,
      description: processDetails.description,
      processName: processDetails.displayName
    });
    let bpmnProcess = processDetails.extras.bpmnProcess;
    processDetails.extras.bpmnProcess = null;
    let response: GetProcessDetailsReply = await Api.postJson(ProcessRequestRoutes.CreateProcess, {
      processDetails: processDetails
    }, accessToken);
    dispatch(response);
    processDetails.extras.bpmnProcess = bpmnProcess;
    return response;
  };
}

export async function deleteProcessFromDb(processId: string, accessToken: string = null): Promise<Api.BaseMessage> {
  return await rootStore.dispatch(deleteProcessFromDbAction(processId, accessToken));
}

export function deleteProcessFromDbAction(processId: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<Api.BaseMessage> {
  return async <S>(dispatch: Dispatch<S>): Promise<Api.BaseMessage> => {
    dispatch<ProcessActionDeleteFromDb>({
      type: ProcessActionType.DeleteFromDb as ProcessActionType,
      processId: processId,
    });
    let response: Api.BaseMessage = await Api.postJson(ProcessRequestRoutes.DeleteProcess, {
      processId: processId,
    }, accessToken);
    dispatch(response);
    return response;
  };
}

// mergeProcessToCache cannot run async because it is used from reducers
// completeProcessFromCache also inits bpmnProcess if required
export async function completeProcessFromCache(process: ProcessDetails): Promise<ProcessDetails> {
  if (process == null)
    return null;

  let initBpmn = false;
  if (process.extras.bpmnXml)
    initBpmn = true;

  process = StateHandler.mergeProcessToCache(process);

  if (initBpmn) {
    // Also init bpmnProcess
    process.extras.bpmnProcess = new BpmnProcess();
    await process.extras.bpmnProcess.loadXml(process.extras.bpmnXml);
  }

  return process;
}

export async function loadProcess(processId: string, instanceId?: string, getExtras: ProcessExtras = ProcessExtras.ExtrasBpmnXml, forceReload: boolean = false, accessToken: string = null): Promise<ProcessDetails> {
  let processState = rootStore.getState().processState;
  let cachedProcess = null;

  if (!forceReload && processState.processCache)
    cachedProcess = processState.processCache[processId];
  if (cachedProcess != null) {
    // Ignore call if all data 
    if ((getExtras & ProcessExtras.ExtrasBpmnXml) && cachedProcess.extras.bpmnXml) {
      getExtras -= ProcessExtras.ExtrasBpmnXml;
      if (cachedProcess.extras.bpmnProcess == null) {
        // special case: Process might be in cache with ExtrasBpmnXml but without bpmnProcess. That can happen when mergeToCache e.g. moves workspace processes to
        // cache. As mergeToCache can only be used sync it cannot init bpmnProcess. 
        cachedProcess.extras.bpmnProcess = new BpmnProcess();
        await cachedProcess.extras.bpmnProcess.loadXml(cachedProcess.extras.bpmnXml);
      }
    }
    if ((getExtras & ProcessExtras.ExtrasInstances) && cachedProcess.extras.instances)
      getExtras -= ProcessExtras.ExtrasInstances;
    if ((getExtras & ProcessExtras.ExtrasProcessRoles) && cachedProcess.extras.processRoles)
      getExtras -= ProcessExtras.ExtrasProcessRoles;
    if ((getExtras & ProcessExtras.ExtrasSettings) && cachedProcess.extras.settings)
      getExtras -= ProcessExtras.ExtrasSettings;
    if ((getExtras & ProcessExtras.ExtrasAuditTrail) && cachedProcess.extras.auditTrail)
      getExtras -= ProcessExtras.ExtrasAuditTrail;
    if ((getExtras & ProcessExtras.ExtrasProcessRolesWithMemberNames) && cachedProcess.extras.processRoles) {
      // names available?
      for (let roleId in cachedProcess.extras.processRoles) {
        for (let user of cachedProcess.extras.processRoles[roleId].potentialRoleOwners) {
          if (user.displayName != null) {
            if (getExtras & ProcessExtras.ExtrasProcessRolesWithMemberNames)
              getExtras -= ProcessExtras.ExtrasProcessRolesWithMemberNames;
            break;
          }
        }
      }
    }
    if (getExtras == 0) {
      // all data available from cache
      rootStore.dispatch({
        type: PROCESSLOADED_MESSAGE,
        processDetails: cachedProcess
      } as ProcessLoadedMessage);

      return cachedProcess;
    }
  }

  return (await rootStore.dispatch(loadProcessAction(processId, instanceId, getExtras, accessToken))).processDetails;
}

export function loadProcessAction(processId: string, instanceId?: string, processExtras?: ProcessExtras, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    let request: GetProcessDetailsRequest = {
      processId: processId,
      getExtras: processExtras
    };

    if (instanceId != null)
      request.instanceId = instanceId;

    let response: GetProcessDetailsReply = await Api.getJson(ProcessRequestRoutes.GetProcessDetails, request, accessToken);
    if (response.processDetails)
      response.processDetails = await completeProcessFromCache(response.processDetails);

    dispatch(response);
    return response;
  };
}

export function setLocalProcessXml(xmlStr: string) {
  rootStore.dispatch(<ProcessActionSave>{
    type: ProcessActionType.Save as ProcessActionType,
    xmlStr: xmlStr
  });
}

export async function processChanged(bpmnProcess: BpmnProcess) {
  await rootStore.dispatch(processChangedAction(bpmnProcess));
}

export function processChangedAction(bpmnProcess: BpmnProcess) {
  return async function (dispatch: any) {
    rootStore.getState();
    let processXml = await bpmnProcess.toXmlString();
    if (processXml != null)
      dispatch(<ProcessActionSave>{
        type: ProcessActionType.Save as ProcessActionType,
        xmlStr: processXml,
        bpmnProcess: bpmnProcess
      });
    else
      dispatch(<ProcessActionSave>{
        type: ProcessActionType.Save as ProcessActionType
        // ohne process ist Aufruf fehlgeschlagen
      });
  };
}

export async function createNewLocalProcess(workspaceId: string): Promise<GetProcessDetailsReply> {
  let process: BpmnProcess = new BpmnProcess();
  await process.loadFromTemplate();
  let xml = await process.toXmlString();

  let details: ProcessDetails = {
    processId: createId(),
    workspaceId: workspaceId,
    displayName: tl("Neuer Prozess"),
    description: "",
    useModeler: false, // Neuerstellung per Tabelle
    isNewProcess: true,
    extras: {
      bpmnXml: xml,
      bpmnProcess: process
    }
  };
  rootStore.dispatch<ProcessLoadedMessage>({
    type: PROCESSLOADED_MESSAGE,
    processDetails: details
  });

  return {
    type: PROCESSLOADED_MESSAGE,
    result: Api.ApiResult.API_OK,
    processDetails: details
  };
}

export async function unloadCurrentProcess(): Promise<void> {
  await rootStore.dispatch<ProcessLoadedMessage>({
    type: PROCESSLOADED_MESSAGE,
    processDetails: null
  });
}

export async function updateProcess(processDetails: ProcessDetails, accessToken: string = null): Promise<GetProcessDetailsReply> {
  // siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch(updateProcessAction(processDetails, accessToken));
}

export function updateProcessAction(process: ProcessDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    dispatch(<ProcessActionGetProcessDetails>{
      type: ProcessActionType.GetProcessDetails as ProcessActionType
    });

    // bpmnProcess cannot be serialized
    process.extras.bpmnProcess = null;

    let response: GetProcessDetailsReply = await Api.postJson(ProcessRequestRoutes.UpdateProcess, {
      processDetails: process
    }, accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch(response);
    return response;
  };
}

export async function listPublicProcesses(accessToken: string = null): Promise<GetPublicProcessesReply> {
  // siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch(listPublicProcessesAction(accessToken));
}

export function listPublicProcessesAction(accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetPublicProcessesReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    dispatch(<ProcessActionGetProcessDetails>{
      type: ProcessActionType.GetProcessDetails as ProcessActionType
    });
    let response: GetProcessDetailsReply = await Api.postJson(ProcessRequestRoutes.GetPublicProcesses, {}, accessToken);
    dispatch(response);
    return response;
  };
}

export async function copyProcess(processId: string, targetWorkspaceId: string, displayName: string, accessToken: string = null): Promise<GetProcessDetailsReply> {
  return await rootStore.dispatch(copyProcessAction(processId, targetWorkspaceId, displayName, accessToken));
}

export function copyProcessAction(processId: string, targetWorkspaceId: string, displayName: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    dispatch(<ProcessActionGetProcessDetails>{
      type: ProcessActionType.GetProcessDetails as ProcessActionType
    });
    let response: GetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.CopyProcess,
      { processId, targetWorkspaceId, displayName } as CopyProcessRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch(response);
    return response;
  };
}

export async function rateProcess(processId: string, ratingDiff: number, accessToken: string = null): Promise<Api.BaseReply> {
  return await rootStore.dispatch(rateProcessAction(processId, ratingDiff, accessToken));
}

export function rateProcessAction(processId: string, ratingDiff: number, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<Api.BaseReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<Api.BaseReply> => {
    let response: GetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.RateProcess,
      { processId, ratingDiff } as RateProcessRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch(response);
    return response;
  };
}


export async function uploadFile(processId: string, fileName: string, data: string, accessToken: string = null): Promise<GetProcessDetailsReply> {
  return await rootStore.dispatch(uploadFileAction(processId, fileName, data, accessToken));
}

export function uploadFileAction(processId: string, fileName: string, data: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    let response: GetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.UploadFile,
      { processId, fileName, data } as UploadFileRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch(response);
    return response;
  };
}

export async function deleteFile(processId: string, attachmentId: string, accessToken: string = null): Promise<GetProcessDetailsReply> {
  return await rootStore.dispatch(deleteFileAction(processId, attachmentId, accessToken));
}

export function deleteFileAction(processId: string, attachmentId: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessDetailsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessDetailsReply> => {
    let response: GetProcessDetailsReply = await Api.postJson(
      ProcessRequestRoutes.DeleteFile,
      { processId, attachmentId } as DeleteFileRequest,
      accessToken);

    response.processDetails = await completeProcessFromCache(response.processDetails);
    dispatch(response);
    return response;
  };
}

export async function getTimersOfProcess(processId: string, accessToken: string = null): Promise<GetTimersOfProcessReply> {
  // siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch(getTimersOfProcessAction(processId, accessToken));
}

export function getTimersOfProcessAction(processId: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetTimersOfProcessReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetTimersOfProcessReply> => {
    let response: GetTimersOfProcessReply = await Api.postJson(ProcessRequestRoutes.GetTimers, {
      processId: processId
    }, accessToken);

    dispatch(response);
    return response;
  };
}
export async function setTimersOfProcess(processId: string, timers: TimerStartEventConfiguration[], accessToken: string = null): Promise<SetTimersOfProcessReply> {
  // siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch(setTimersOfProcessAction(processId, timers, accessToken));
}

export function setTimersOfProcessAction(processId: string, timers: TimerStartEventConfiguration[], accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<SetTimersOfProcessReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<SetTimersOfProcessReply> => {
    let response: SetTimersOfProcessReply = await Api.postJson(ProcessRequestRoutes.SetTimers, {
      processId: processId,
      timers: timers
    }, accessToken);

    dispatch(response);
    return response;
  };
}

export async function getProcessStatistics(processId: string, fromDate: Date = null, tillDate: Date = null, accessToken: string = null): Promise<GetProcessStatisticsReply> {
  // siehe https://github.com/jaysoo/todomvc-redux-react-typescript/blob/master/client/todos/actions.ts
  return await rootStore.dispatch(getProcessStatisticsAction(processId, fromDate, tillDate, accessToken));
}

export function getProcessStatisticsAction(processId: string, fromDate: Date, tillDate: Date, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<GetProcessStatisticsReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<GetProcessStatisticsReply> => {
    let response: GetProcessStatisticsReply = await Api.postJson(ProcessRequestRoutes.GetProcessStatistics, {
      processId: processId,
      fromDate: fromDate,
      tillDate: tillDate
    }, accessToken) as GetProcessStatisticsReply;

    dispatch(response);
    return response;
  };
}