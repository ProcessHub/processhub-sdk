import { assert } from "chai";
import { FieldContentMap } from "../data/datainterfaces";
import * as DataTools from "./datatools";

describe("sdk", function () {
  describe("data", function () {
    describe("datatools", function () {

      describe("parseAndInsertStringWithFieldContent", function () {
        it("should replace field values", async function () {

          let testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          let resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as FieldContentMap);

          assert.equal(res, resultString);
        });

        it("should accept empty field maps", async function () {
            
          let testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, null);

          assert.equal(res, testString);
        });
      });

    });
  });
});