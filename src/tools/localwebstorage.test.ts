import { assert } from "chai";
import { LocalWebStorage } from "./localwebstorage";
import { tl } from "..";

describe("sdk", function () {
  describe("tools", function () {
    describe("localwebstorage", function () {

      describe("getItem_setItem", function () {
        it("should set and get value", () => {
          LocalWebStorage.setItem("TESTVAL", "test");
          assert.equal(LocalWebStorage.getItem("TESTVAL"), "test");
        });    
        
        it("should set and get null", () => {
          LocalWebStorage.setItem("TESTVAL", null);
          assert.equal(LocalWebStorage.getItem("TESTVAL"), null);

          assert.equal(LocalWebStorage.getItem("INVALIDITEM"), null);          
        }); 
      });
    });
  });
});