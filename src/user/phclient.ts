import { ApiResult } from "../legacyapi/apirequests";
import { UserDetails } from "./userinterfaces";

// Internal objects used by ProcessHub client and server

export class UserState {
  currentUser?: UserDetails;

  lastApiResult?: ApiResult;  // result of the last Api call

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
  lastDispatchedUser?: UserDetails; // used in reducer to detect changes
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",
  InstanceLoadedMessage: "InstanceLoadedMessage",
  RemoveInstanceMessage: "RemoveInstanceMessage",
  NewInstanceMessage: "NewInstanceMessage",

  Failed: "FAILED"
};
export type UserMessages = keyof typeof UserMessages;

