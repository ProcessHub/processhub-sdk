import { assert } from "chai";
import * as DataTools from "./datatools";
import { FieldContentMap } from "../data/datainterfaces";

describe("sdk", function () {
  describe("data", function () {
    describe("datatools", function () {

      describe("parseAndInsertStringWithFieldContent", function () {
        it("should replace field values", async function () {

          let testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          let resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as FieldContentMap, null, null);

          assert.equal(res, resultString);
        });

        it("should replace field values with {field['name']} notation", async function () {

          let testString = "Hallo {field['existiert']}, wie gehts {field['existiertnicht']}\n{trölölö} {{{moepmoep}}}\n{field['existiert2']}\n";
          let resultString = "Hallo Teststring eingesetzt!, wie gehts \n{trölölö} {{{moepmoep}}}\n\n";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, { existiert: "Teststring eingesetzt!" } as FieldContentMap, null, null);
          console.log(res);
          assert.equal(res, resultString);
        });

        it("should accept empty field maps", async function () {

          let testString = "Hallo {{ field.existiert }}, wie gehts {{ field.existiertnicht }}\n{trölölö} {{{moepmoep}}}\n{{ field.existiert2 }}\n";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, null, null, null);

          assert.equal(res, testString);
        });

        it("should replace long field names with short values", async function () {

          let testString = "{{ field.fieldname1 }}{{ field.fieldname2 }}{{ field.fieldname3 }}";
          let resultString = "123";
          let res = DataTools.parseAndInsertStringWithFieldContent(testString, { fieldname1: "1", fieldname2: "2", fieldname3: "3", } as FieldContentMap, null, null);

          assert.equal(res, resultString);
        });
      });

    });
  });
});