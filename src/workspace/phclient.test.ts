import { assert } from "chai";
import * as PH from "../";

describe("sdk", function () {
  describe("workspace", function () {
    describe("phclient", function () {
    
      describe("isValidWorkspaceView", function () {
        it("should detect valid workspace views", function () {
          assert.isTrue(PH.Workspace.isValidWorkspaceView("members"));
          assert.isTrue(PH.Workspace.isValidWorkspaceView("mEmbers"));  // case insensitive

          assert.isFalse(PH.Workspace.isValidWorkspaceView("invalid"));
        });
      });
  
    });
  });
});