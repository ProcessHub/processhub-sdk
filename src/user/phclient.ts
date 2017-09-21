// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class UserState {
  currentUser?: PH.User.UserDetails;

  lastApiResult?: PH.LegacyApi.ApiResult;  // result of the last Api call

  // updated in reducers, helps React to detect state changes
  cacheState?: string;
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",

  Failed: "FAILED"
};
export type UserMessages = keyof typeof UserMessages;

