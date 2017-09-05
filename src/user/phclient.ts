// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class UserState {
  currentUser?: PH.User.UserDetails;
  lastApiResult?: PH.LegacyApi.ApiResult;  // Ergebnis des letzten UserApi-Aufrufs
}

export const UserMessages = {
  UserLoadedMessage: "UserLoadedMessage",

  Failed: "FAILED"
};
export type UserMessages = keyof typeof UserMessages;

