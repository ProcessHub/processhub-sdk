import { assert } from "chai";
import { isValidProcessView } from "./phclient";

describe("sdk", function () {
  describe("process", function () {
    describe("phclient", function () {
    
      describe("isValidProcessView", function () {
        it("should detect valid process views", function () {
          assert.isTrue(isValidProcessView("edit"));
          assert.isTrue(isValidProcessView("eDit"));  // case insensitive

          assert.isFalse(isValidProcessView("invalid"));
        });
      });
  
    });
  });
});