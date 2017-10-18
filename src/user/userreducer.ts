import * as _ from "lodash";
import * as update from "immutability-helper";
import * as Api from "../legacyapi";
import { UserActionLoggedIn, UserActionFailed } from "./useractions";
import * as StateHandler from "../statehandler";
import { UserState, UserMessages } from "./phclient";
import { UserLoadedMessage } from "./legacyapi";
import { createId } from "../tools/guid";
import { UserActionsType } from "./userinterfaces";
import { isTrue } from "../tools/assert";
import { ResetStore } from "../statehandler/actions";

export function userReducer(userState: UserState, action: any): UserState {

  if (userState == null || action && action.type == ResetStore) {
    // init state
    userState = new UserState();
  }
  if (action == null || action.type == ResetStore)
    return userState;

  switch (action.type) {

    case UserMessages.UserLoadedMessage:
      let user = (<UserLoadedMessage>action).user;
      userState.currentUser = StateHandler.mergeUserToCache(user);

      return update(userState, {
        cacheState: { $set: createId() }
      });

    case UserActionsType.LoggedIn:
      let loggedAction: UserActionLoggedIn = action;
      isTrue(loggedAction.userDetails != null, "loggedAction.userDetails is null");
      return update(userState, {
        currentUser: { $set: loggedAction.userDetails },
        lastApiResult: { $set: Api.ApiResult.API_OK }
      });

    case UserActionsType.LoggedOut:
      return update(userState, {
        currentUser: { $set: null },
        lastApiResult: { $set: Api.ApiResult.API_OK }
      });

    case UserActionsType.Failed:
      let failedAction: UserActionFailed = action;
      isTrue(failedAction.result != null, "failedAction.result is null");
      return update(userState, {
        lastApiResult: { $set: failedAction.result }
      });

    default:
      return userState;
  }
}
