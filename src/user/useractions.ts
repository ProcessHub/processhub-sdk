import { rootStore } from "../statehandler";
import { Dispatch } from "redux";
import { browserHistory } from "react-router";
import * as StateHandler from "../statehandler";
import * as Workspace from "../workspace";
import * as Process from "../process";
import * as Instance from "../instance";
import * as Api from "../legacyapi";
import { LoadUserReply, UserActionsType } from "./index";
import { UserDetails, UserExtras } from "./userinterfaces";
import { UpdateUserReply, UserRequestRoutes, UpdateUserRequest, UpdatePasswordReply, UpdatePasswordRequest, UserLoadedMessage, LoginReply, LoginRequest, LoadUserRequest, UploadProfilePictureRequest, CreateUserRequest } from "./legacyapi";
import { UserMessages } from "./phclient";
import { error } from "../tools/assert";
import { createUserId } from "../tools/guid";

export interface UserActionLoggedIn {
  type: string; // USERACTION_LOGGEDIN
  userDetails: UserDetails;
}

export interface UserActionFailed {
  type: string; // USERACTION_FAILED
  result: Api.ApiResult;
}

export async function updateUser(userDetails: UserDetails): Promise<UpdateUserReply> {
  return await rootStore.dispatch(updateUserAction(userDetails));
}
export function updateUserAction(userDetails: UserDetails, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<UpdateUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<UpdateUserReply> => {
    let response: UpdateUserReply = await Api.postJson(UserRequestRoutes.UpdateUser, <UpdateUserRequest>{
      userDetails: userDetails,
    });
    dispatch(response);
    return response;
  };
}

export async function updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<UpdatePasswordReply> {
  return await rootStore.dispatch(updatePasswordAction(userId, oldPassword, newPassword));
}
export function updatePasswordAction(userId: string, oldPassword: string, newPassword: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<UpdatePasswordReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<UpdatePasswordReply> => {
    let response: UpdatePasswordReply = await Api.postJson(UserRequestRoutes.UpdatePassword, <UpdatePasswordRequest>{
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
    dispatch(response);
    return response;
  };
}

export function updateUserInState(user: UserDetails): void {
  if (user != null) {
    let message: UserLoadedMessage = {
      type: UserMessages.UserLoadedMessage as UserMessages,
      user: user
    };
    rootStore.dispatch<UserLoadedMessage>(message);
  }
}

// Wrapper für einfachen Aufruf aus den Komponenten
export async function loginUser(user: string, password: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(user, password));
}
export async function loginUserWithToken(user: string, accessToken: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(user, null, accessToken));
}
export async function loginUserWithGoogleToken(userMail: string, userName: string, userProfilePictureLink: string, googleAccessToken: string): Promise<LoginReply> {
  return await rootStore.dispatch(loginUserAction(userMail, null, googleAccessToken, true, userName, userProfilePictureLink));
}

// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function loginUserAction(mail: string, password: string, accessToken: string = null, isGoogleAccessToken: boolean = false, userNameFromGoogle: string = null, userProfilePictureLink: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoginReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoginReply> => {
    let response:
     LoginReply = await Api.postJson(UserRequestRoutes.Login, <LoginRequest>{
      mail: mail,
      password: password,
      accessToken: accessToken,
      isGoogleAccessToken: isGoogleAccessToken
    });

    dispatch(response);
    return response;
  };
}

export async function loadUser(userId: string, getExtras: UserExtras = UserExtras.None, forceReload: boolean = false, accessToken: string = null): Promise<UserDetails> {
  let userState = StateHandler.rootStore.getState().userState;
  let currentUser = userState ? userState.currentUser : null;

  if (!forceReload && currentUser) {
    if ((getExtras  & UserExtras.ExtrasWorkspaces) && currentUser.extras.workspaces)
      getExtras -= UserExtras.ExtrasWorkspaces;
    if ((getExtras  & UserExtras.ExtrasWorkspacesWithMembersAndProcesses) 
      && currentUser.extras.workspaces && currentUser.extras.workspaces.length > 0
      && currentUser.extras.workspaces[0].extras.members && currentUser.extras.workspaces[0].extras.processes)
      getExtras -= UserExtras.ExtrasWorkspacesWithMembersAndProcesses;  
      
    if (getExtras == 0) {
      updateUserInState(currentUser);
      return currentUser;
    }
  }
  return (await rootStore.dispatch(loadUserAction(userId, getExtras, accessToken))).userDetails;
}

export function loadUserAction(userId: string, getExtras: UserExtras, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoadUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoadUserReply> => {
    let request: LoadUserRequest = {
      userId: userId,
      getExtras: getExtras
    };
    let response: LoadUserReply = await Api.postJson(UserRequestRoutes.LoadUser, request);
    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}

export async function uploadProfilePicture(dataBase64: string): Promise<LoadUserReply> {
  return await rootStore.dispatch(uploadProfilePictureAction(dataBase64));
}
export function uploadProfilePictureAction(data: string, accessToken: string = null): <S>(dispatch: Dispatch<S>) => Promise<LoadUserReply> {
  return async <S>(dispatch: Dispatch<S>): Promise<LoadUserReply> => {
    let response: LoadUserReply = await Api.postJson(UserRequestRoutes.UploadProfilePicture, {
      data
    } as UploadProfilePictureRequest);

    if (response.userDetails != null) {
      updateUserInState(response.userDetails);
    }
    return response;
  };
}

export async function logoutUser() {
  await rootStore.dispatch(logoutUserAction());
}
// Diese eigentliche Action wird für Mock-Store Tests genutzt
export function logoutUserAction() {
  return function (dispatch: any) {

    return Api.postJson(UserRequestRoutes.Logout, null).then(() => {
      if (typeof window !== "undefined") { // window not available in unit tests
        // Reload on successful login to clean old cache
        window.location.href = "/signin";
      }
    }).catch(reason => error(reason));
  };
}

export async function createUser(mail: string, realName: string, password: string) {
  await rootStore.dispatch(createUserAction(mail, realName, password));
}
export function createUserAction(mail: string, realName: string, password: string) {
  return function (dispatch: any) {
    let userDetails: UserDetails = {
      userId: createUserId(),
      mail: mail,
      realName: realName,
      extras: {}
    };
    return Api.postJson(UserRequestRoutes.Register, <CreateUserRequest>{
      userDetails: userDetails,
      password: password
    }).then((response: LoginReply) => {
      dispatch(response);
      // Nur Weiterleiten, wenn erfolgreich
      if (response.result === Api.ApiResult.API_OK) {
        if (typeof window !== "undefined") { // window not available in unit tests
          window.location.href = "/";
        }
      }
    }).catch((reason: any) => error(reason));
  };
}