import { assert } from "chai";
import { ApiResult } from "../legacyapi/apirequests";
import { WorkspaceView } from "../workspace/phclient";
import { PATHLOADED_MESSAGE, PathLoadedMessage } from "./legacyapi";
import { Page } from "./pathinterfaces";
import { pathReducer } from "./pathreducer";
import { PathState } from "./phclient";
import { parseUrl } from "./urlparser";

describe("sdk", function () {
  describe("path", function () {

    describe("pathReducer", function () {

      it("soll PATHLOADED_MESSAGE korrekt reducen", function () {
        let oldState: PathState = new PathState();

        let message: PathLoadedMessage = {
          type: PATHLOADED_MESSAGE,
          pathDetails: parseUrl("/@testworkspace/members")
        };

        let newState = pathReducer(oldState, message);

        assert.deepEqual(newState.currentPath.page, Page.WorkspacePage);
        assert.deepEqual(newState.currentPath.view, WorkspaceView.Members);

      });

      it("soll PATHLOADED_MESSAGE mit Fehlermeldung korrekt reducen", function () {
        let oldState: PathState = new PathState();

        let message: PathLoadedMessage = {
          type: PATHLOADED_MESSAGE,
          pathDetails: parseUrl("/@invalid"),
          error: ApiResult.API_NOTFOUND
        };

        let newState = pathReducer(oldState, message);

        // Deepequal nicht sínnvoll, da nur Server erkennen kann, ob Workspace gefunden wurde
        assert.equal(newState.lastApiResult, ApiResult.API_NOTFOUND);
      });

      it("soll unbekannte Actions korrekt reducen", function () {
        let oldState: PathState = { currentPath: { page: Page.WorkspacePage } };
        let newState = pathReducer(oldState, {
          type: "UNKNOWN"
        });
        assert.deepEqual(newState, oldState);
      });

    });

  });
});
