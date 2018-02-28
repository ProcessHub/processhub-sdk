import { BaseRequest, BaseMessage } from "../legacyapi/apiinterfaces";
import { UserDetails, UserExtras } from "./userinterfaces";
import { UserMessages } from "./phclient";

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
  LoginDemoUser: "/api/user/logindemo",
  DeleteUser: "/api/user/deleteuser",
};
export type UserRequestRoutes = keyof typeof UserRequestRoutes;

export interface CreateUserRequest extends BaseRequest {
  userDetails: UserDetails;
  password: string;
}

export interface LoginRequest extends BaseRequest {
  mail: string;
  password: string;
  accessToken: string;
  isGoogleAccessToken: boolean;
}
export interface LoginReply extends BaseMessage {
  userDetails?: UserDetails;
  accessToken?: string;
}

export interface LoadUserRequest extends BaseRequest {
  userId?: string; // if null userId will be determined by server from AccessToken cookie
  getExtras: UserExtras;
}
export interface LoadUserReply extends BaseMessage {
  userDetails?: UserDetails;
}

export interface LoginDemoUserRequest extends BaseRequest {
}
export interface LoginDemoUserReply extends BaseMessage {
  userDetails?: UserDetails;
  accessToken?: string;
}

export interface UpdateUserRequest extends BaseRequest {
  userDetails: UserDetails;
}
export interface UpdateUserReply extends BaseMessage {
}

export interface UpdatePasswordRequest extends BaseRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
export interface UpdatePasswordReply extends BaseMessage {
}

export interface UserLoadedMessage extends BaseMessage {
  type: UserMessages;
  user?: UserDetails;
}

export interface SendPasswordResetLinkRequest extends BaseMessage {
  email: string;
}

export interface ResetPasswordRequest extends BaseMessage {
  secret: string;
  password: string;
}

export interface ConfirmMailRequest extends BaseMessage {
  token: string;
}

export interface UploadProfilePictureRequest extends BaseMessage {
  data: string;
}

// nes websocket messages
export interface RemoveInstanceMessage extends BaseMessage {
  type: UserMessages;
  instanceId: string;
}
export interface NewInstanceMessage extends BaseMessage {
  type: UserMessages;
  instanceId: string;
}
