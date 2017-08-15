import { assert } from "chai";
import * as PH from "../";

describe("instance", function () {
  describe("instancetools", function () {

    describe("fieldContentsExcerpt", function () {
      it("soll Feldinhalte als Übersicht liefern", function () {
        let instance: any = {
          extras: {}
        };
        assert.equal(PH.Instance.fieldContentsExcerpt(null, 100), "");  // fault tolerant
        assert.equal(PH.Instance.fieldContentsExcerpt(instance, 100), ""); 

        instance.extras.fieldContents = {
          "feld1": "test",
          "feld1.1": "", // ignores empty fields
          "feld2": true, // ignores boolean
          "feld3": "http://link", // ignores links
          "feld4": "test2"
        };
        assert.equal(PH.Instance.fieldContentsExcerpt(instance, 100), "test / test2"); 

        assert.equal(PH.Instance.fieldContentsExcerpt(instance, 8), "test /..."); 
      });
    });

  });
});