import { assert } from "chai";
import { isValidWorkspaceView } from "./phclient";

describe("sdk", function () {
  describe("workspace", function () {
    describe("phclient", function () {
    
      describe("isValidWorkspaceView", function () {
        it("should detect valid workspace views", function () {
          assert.isTrue(isValidWorkspaceView("members"));
          assert.isTrue(isValidWorkspaceView("mEmbers"));  // case insensitive

          assert.isFalse(isValidWorkspaceView("invalid"));
        });
      });
  
    });
  });
});