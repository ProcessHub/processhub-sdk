import * as update from "immutability-helper";
import * as _ from "lodash";
import * as Api from "../legacyapi";
import * as StateHandler from "../statehandler";
import { ResetStore } from "../statehandler/actions";
import { isTrue } from "../tools/assert";
import { createId } from "../tools/guid";
import { UserLoadedMessage } from "./legacyapi";
import { UserMessages, UserState } from "./phclient";
import { UserActionFailed, UserActionLoggedIn } from "./useractions";
import { UserActionsType } from "./userinterfaces";

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
