import * as _ from "lodash";
import * as StateHandler from "../statehandler";
import * as Api from "../legacyapi";
import { Dispatch } from "redux";
import { WorkspaceExtras, WorkspaceDetails, WorkspaceRole, WorkspaceType } from "./workspaceinterfaces";
import { LoadWorkspaceReply, LoadWorkspaceRequest, WorkspaceRequestRoutes, RemoveWorkspaceMemberRequest, WorkspaceLoadedMessage, InviteWorkspaceMemberRequest, CreateWorkspaceRequest, UpdateWorkspaceRequest, DeleteWorkspaceRequest, SetMemberRoleRequest, StartTrialRequest, TrialUserCountType } from "./legacyapi";
import { WorkspaceMessages } from "./phclient";
import { BaseReply } from "../legacyapi";

export async function requireWorkspaceMembers() {
  // Fordert die Workspace-Members an, falls diese in PathState.currentWorkspace noch nicht enthalten sind.
  let workspaceState = StateHandler.rootStore.getState().workspaceState;
  if (workspaceState.currentWorkspace != null
    && workspaceState.currentWorkspace.extras.members != null) {
    // Members wurden bereits geladen
    return;
  } else if (workspaceState.currentWorkspace != null)
    await loadWorkspace(workspaceState.currentWorkspace.workspaceId, WorkspaceExtras.ExtrasMembers);
}

export async function loadWorkspace(workspaceId: string, getExtras: WorkspaceExtras, forceReload: boolean = false, accessToken: string = null): Promise<WorkspaceDetails> {
  let workspaceState = StateHandler.rootStore.getState().workspaceState;
  let cachedWorkspace = null;

  if (!forceReload && workspaceState.workspaceCache)
    cachedWorkspace = workspaceState.workspaceCache[workspaceId];
  if (cachedWorkspace != null) {
    // Ignore call if all data 
    if ((getExtras & WorkspaceExtras.ExtrasMembers) && cachedWorkspace.extras.members)
      getExtras -= WorkspaceExtras.ExtrasMembers;
    if ((getExtras & WorkspaceExtras.ExtrasProcesses) && cachedWorkspace.extras.processes)
      getExtras -= WorkspaceExtras.ExtrasProcesses;
    if ((getExtras & WorkspaceExtras.ExtrasTags) && cachedWorkspace.extras.tags)
      getExtras -= WorkspaceExtras.ExtrasTags;
    if ((getExtras & WorkspaceExtras.ExtrasAuditTrail) && cachedWorkspace.extras.auditTrail)
      getExtras -= WorkspaceExtras.ExtrasAuditTrail;
      if ((getExtras & WorkspaceExtras.ExtrasGroups) && cachedWorkspace.extras.groups)
      getExtras -= WorkspaceExtras.ExtrasGroups;

    if (getExtras == 0) {
      // all data available from cache
      StateHandler.rootStore.dispatch({
        type: WorkspaceMessages.WorkspaceLoadedMessage,
        workspace: cachedWorkspace
      } as LoadWorkspaceReply);

      return cachedWorkspace;
    }
  }

  return (await StateHandler.rootStore.dispatch(loadWorkspaceAction(workspaceId, getExtras, accessToken))).workspace;
}
export function loadWorkspaceAction(workspaceId: string, getExtras: WorkspaceExtras, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoadWorkspaceReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoadWorkspaceReply> => {
    let request: LoadWorkspaceRequest = {
      workspaceId: workspaceId,
      getExtras: getExtras
    };
    let response = await Api.getJson(WorkspaceRequestRoutes.LoadWorkspace, request, accessToken) as LoadWorkspaceReply;
    if (response.workspace)
      response.workspace = StateHandler.mergeWorkspaceToCache(response.workspace);

    dispatch(response);
    return response;
  };
}

export async function removeWorkspaceMember(workspaceId: string, userId: string, accessToken: string = null): Promise<void> {
  await StateHandler.rootStore.dispatch(removeWorkspaceMemberAction(workspaceId, userId, accessToken));
}
export function removeWorkspaceMemberAction(workspaceId: string, userId: string, accessToken: string = null) {
  return function (dispatch: any) {
    let request: RemoveWorkspaceMemberRequest = {
      workspaceId,
      userId
    };
    return Api.postJson(WorkspaceRequestRoutes.RemoveWorkspaceMember, request, accessToken).then((response) => {
      dispatch(response);
    });
  };
}

export async function inviteWorkspaceMember(workspaceId: string, userIdOrUserMail: string[], memberRole: WorkspaceRole, invitationMessage: string, accessToken: string = null): Promise<WorkspaceLoadedMessage> {
  return await StateHandler.rootStore.dispatch(inviteWorkspaceMemberAction(workspaceId, userIdOrUserMail, memberRole, invitationMessage, accessToken));
}
export function inviteWorkspaceMemberAction(workspaceId: string, userIdOrUserMail: string[], memberRole: WorkspaceRole, invitationMessage: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<WorkspaceLoadedMessage> {
  return async <S>(dispatch: Dispatch<S>): Promise<WorkspaceLoadedMessage> => {
    let request: InviteWorkspaceMemberRequest = {
      workspaceId: workspaceId,
      userIdOrUserMail: userIdOrUserMail,
      memberRole: memberRole,
      invitationMessage: invitationMessage
    };
    const response = await Api.postJson(WorkspaceRequestRoutes.InviteWorkspaceMember, request, accessToken) as WorkspaceLoadedMessage;
    dispatch(response);
    return response;
  };
}

export async function createWorkspace(workspace: WorkspaceDetails, accessToken: string = null): Promise<WorkspaceLoadedMessage> {
  return await StateHandler.rootStore.dispatch(createWorkspaceAction(workspace, accessToken));
}
export function createWorkspaceAction(workspace: WorkspaceDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<WorkspaceLoadedMessage> {
  return async <S>(dispatch: Dispatch<S>): Promise<WorkspaceLoadedMessage> => {
    let request: CreateWorkspaceRequest = {
      workspace: workspace
    };
    const response = await Api.postJson(WorkspaceRequestRoutes.CreateWorkspace, request, accessToken) as WorkspaceLoadedMessage;
    dispatch(response);
    return response;
  };
}

export async function updateWorkspace(workspace: WorkspaceDetails, accessToken: string = null): Promise<void> {
  await StateHandler.rootStore.dispatch(updateWorkspaceAction(workspace, accessToken));
}

export function updateWorkspaceAction(workspace: WorkspaceDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<void> {
  return async <S>(dispatch: Dispatch<S>): Promise<void> => {
    const requestWorkspace = _.cloneDeep(workspace);
    delete (requestWorkspace.extras.members);
    delete (requestWorkspace.extras.processes);
    let request: UpdateWorkspaceRequest = {
      workspace: requestWorkspace
    };
    return Api.postJson(WorkspaceRequestRoutes.UpdateWorkspace, request, accessToken).then((response) => {
      dispatch(response);
    });
  };
}

export async function deleteWorkspace(workspaceId: string, accessToken: string = null): Promise<void> {
  await StateHandler.rootStore.dispatch(deleteWorkspaceAction(workspaceId, accessToken));
}

export function deleteWorkspaceAction(workspaceId: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<void> {
  return async <S>(dispatch: Dispatch<S>): Promise<void> => {
    let request: DeleteWorkspaceRequest = {
      workspaceId: workspaceId
    };
    return Api.postJson(WorkspaceRequestRoutes.DeleteWorkspace, request, accessToken).then((response) => {
      dispatch(response);
    });
  };
}

export async function setMemberRole(workspaceId: string, userId: string, memberRole: WorkspaceRole, accessToken: string = null) {
  await StateHandler.rootStore.dispatch(setMemberRoleAction(workspaceId, userId, memberRole, accessToken));
}
export function setMemberRoleAction(workspaceId: string, userId: string, memberRole: WorkspaceRole, accessToken: string = null) {
  return function (dispatch: any) {
    let request: SetMemberRoleRequest = {
      workspaceId,
      userId,
      memberRole
    };
    return Api.postJson(WorkspaceRequestRoutes.SetMemberRole, request, accessToken).then((response) => {
      dispatch(response);
    });
  };
}

export async function startTrial(workspaceId: string, name: string, mail: string, company: string, phone: string, testType: WorkspaceType, userCount: TrialUserCountType, accessToken: string = null): Promise<BaseReply> {
  return await StateHandler.rootStore.dispatch(startTrialAction(workspaceId, name, mail, company, phone, testType, userCount, accessToken));
}
export function startTrialAction(workspaceId: string, name: string, mail: string, company: string, phone: string, testType: WorkspaceType, userCount: TrialUserCountType, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<BaseReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<BaseReply> => {
    let request: StartTrialRequest = {
      workspaceId,
      name,
      mail,
      company,
      phone,
      testType,
      userCount
    };
    const response = await Api.postJson(WorkspaceRequestRoutes.StartTrial, request, accessToken) as BaseReply;
    return response;
  };
}