import { assert } from "chai";
import * as ProcessValidation from "./processvalidation";
import * as PH from "../";

describe("sdk", function () {
  describe("process", function () {
    describe("validation", function () {

      it("soll Process-Details Validierung testen", function () {
        let obj = { displayName: "test1234", description: "hallo test" };
        let res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test12", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test1", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(!res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test 1234", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(!res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "123456789012345678901234567890123456789012345678901", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(!res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "12345678901234567890123456789012345678901234567890", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "test1234", description: "" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);

        obj = { displayName: "012345678901234567890123456789012345678901234567891", description: "hallo test" };
        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(!res, "error: " + obj.displayName + " - " + obj.description);

        obj = {
          workspaceId: PH.Tools.createWorkspaceId(),
          displayName: "Unittest process " + PH.Tools.createId(),
          description: "Unittest process decription",
          processId: PH.Tools.createId(),
          useModeler: false,
          extras: {}
        } as PH.Process.ProcessDetails;

        res = ProcessValidation.isProcessDetailsValid(obj as PH.Process.ProcessDetails);
        assert.isTrue(res, "error: " + obj.displayName + " - " + obj.description);
      });
    });
  });
});