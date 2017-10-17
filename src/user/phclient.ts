import { UserDetails } from "./userinterfaces";
import { ApiResult } from "../legacyapi/apirequests";

// Internal objects used by ProcessHub client and server

export class UserState {
  currentUser?: UserDetails;

  lastApiResult?: ApiResult;  // result of the last Api call

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",
  InstanceLoadedMessage: "InstanceLoadedMessage",
  RemoveInstanceMessage: "RemoveInstanceMessage",
  NewInstanceMessage: "NewInstanceMessage",

  Failed: "FAILED"
};
export type UserMessages = keyof typeof UserMessages;

