import * as PH from "../";

export const UserRequestRoutes = {
  Login: "/api/user/login",
  Logout: "/api/user/logout",
  Register: "/api/user/register",
  PasswordLost: "/api/user/passwordlost",
  ResetPassword: "/api/user/resetpwd",
  GetAllUserFromWorkspace: "/api/user/getallfromworkspace",
  ConfirmMail: "/api/user/confirmmail",
  UpdateUser: "/api/user/update",
  UpdatePassword: "/api/user/passwordupdate",
  LoadUser: "/api/user/loaduser",
  UploadProfilePicture: "/api/user/uploadprofilepicture",
};
export type UserRequestRoutes = keyof typeof UserRequestRoutes;

export interface CreateUserRequest extends PH.LegacyApi.BaseRequest {
  userDetails: PH.User.UserDetails;
  password: string;
}

export interface LoginRequest extends PH.LegacyApi.BaseRequest {
  mail: string;
  password: string;
  accessToken: string;
  isGoogleAccessToken: boolean;
}
export interface LoginReply extends PH.LegacyApi.BaseMessage {
  userDetails?: PH.User.UserDetails;
  accessToken?: string;
}

export interface LoadUserRequest extends PH.LegacyApi.BaseRequest {
  userId?: string; // if null userId will be determined by server from AccessToken cookie
  getExtras: PH.User.UserExtras;
}
export interface LoadUserReply extends PH.LegacyApi.BaseMessage {
  userDetails?: PH.User.UserDetails;
}

export interface UpdateUserRequest extends PH.LegacyApi.BaseRequest {
  userDetails: PH.User.UserDetails;
}
export interface UpdateUserReply extends PH.LegacyApi.BaseMessage {
}

export interface UpdatePasswordRequest extends PH.LegacyApi.BaseRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
export interface UpdatePasswordReply extends PH.LegacyApi.BaseMessage {
}

export interface UserLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: PH.User.UserMessages;
  user?: PH.User.UserDetails;
}

export interface SendPasswordResetLinkRequest extends PH.LegacyApi.BaseMessage {
  email: string;
}

export interface ResetPasswordRequest extends PH.LegacyApi.BaseMessage {
  secret: string;
  password: string;
}

export interface ConfirmMailRequest extends PH.LegacyApi.BaseMessage {
  token: string;
}

export interface UploadProfilePictureRequest extends PH.LegacyApi.BaseMessage {
  data: string;
}

// nes websocket messages
export interface TodoLoadedMessage extends PH.LegacyApi.BaseMessage {
  type: PH.User.UserMessages;
  todo: PH.Todo.TodoDetails;
}
export interface RemoveTodoMessage extends PH.LegacyApi.BaseMessage {
  type: PH.User.UserMessages;
  todoId: string;
}
export interface NewInstanceMessage extends PH.LegacyApi.BaseMessage {
  type: PH.User.UserMessages;
  instanceId: string;
}
