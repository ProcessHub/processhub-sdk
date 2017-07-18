// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class UserState {
  currentUser?: PH.User.UserDetails;
  lastApiResult?: PH.LegacyApi.ApiResult;  // Ergebnis des letzten UserApi-Aufrufs
}

export enum UserExtras {
  None = 0,
  ExtrasWorkspaces = 1 << 0,
  ExtrasAccessToken = 1 << 1,
  ExtrasTodos = 1 << 2
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",

  Failed: "FAILED"
};
export type UserMessages = keyof typeof UserMessages;

