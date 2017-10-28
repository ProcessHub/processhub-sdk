import * as _ from "lodash";
import * as update from "immutability-helper";
import { ApiResult } from "../legacyapi/apiinterfaces";
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

      let userChanged = !_.isEqual(userState.currentUser, userState.lastDispatchedUser);
      userState.lastDispatchedUser = _.cloneDeep(userState.currentUser);

      if (userChanged) {
        return update(userState, {
          cacheState: { $set: createId() }
        });
      } else
        return userState;

    case UserActionsType.LoggedIn:
      let loggedAction: UserActionLoggedIn = action;
      isTrue(loggedAction.userDetails != null, "loggedAction.userDetails is null");
      return update(userState, {
        currentUser: { $set: loggedAction.userDetails },
        lastApiResult: { $set: ApiResult.API_OK }
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
