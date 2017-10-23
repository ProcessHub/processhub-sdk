import { assert } from "chai";
import { ApiResult } from "../legacyapi/apirequests";
import { createUserId } from "../tools/guid";
import { UserState } from "./phclient";
import { UserActionFailed, UserActionLoggedIn } from "./useractions";
import { UserActionsType } from "./userinterfaces";
import { userReducer } from "./userreducer";

describe("sdk", function () {
  describe("user", function () {

    describe("userReducer", function () {

      it("soll USERACTION_LOGIN korrekt reducen", function () {
        let oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        let user = { userId: createUserId() };
        let newState = userReducer(oldState, <UserActionLoggedIn>{
          type: UserActionsType.LoggedIn,
          userDetails: user
        });
        assert.deepEqual<any>(newState, { currentUser: user, lastApiResult: ApiResult.API_OK });
      });

      it("soll USERACTION_FAILED korrekt reducen", function () {
        let oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        let newState = userReducer(oldState, <UserActionFailed>{
          type: UserActionsType.Failed,
          result: ApiResult.API_DENIED
        });
        assert.deepEqual<any>(newState, { lastApiResult: ApiResult.API_DENIED });
      });

      it("soll unbekannte Actions korrekt reducen", function () {
        let oldState: UserState = { lastApiResult: ApiResult.API_ERROR };
        let newState = userReducer(oldState, {
          type: "UNKNOWN"
        });
        assert.deepEqual(newState, oldState);
      });


    });

  });
});