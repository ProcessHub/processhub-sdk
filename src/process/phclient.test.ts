import { assert } from "chai";
import * as PH from "../";

describe("sdk", function () {
  describe("process", function () {
    describe("phclient", function () {
    
      describe("isValidProcessView", function () {
        it("should detect valid process views", function () {
          assert.isTrue(PH.Process.isValidProcessView("edit"));
          assert.isTrue(PH.Process.isValidProcessView("eDit"));  // case insensitive

          assert.isFalse(PH.Process.isValidProcessView("invalid"));
        });
      });
  
    });
  });
});