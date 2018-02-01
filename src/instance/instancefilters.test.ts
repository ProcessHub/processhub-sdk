import { assert } from "chai";
import { fieldContentsExcerpt, parseInstanceMailAddress, getInstanceMailAddress } from "./instancetools";
import { createId } from "../tools/guid";
import * as InstanceFilters from "./instancefilters";
import * as PH from "../";
import { TodoDetails } from "../todo/todointerfaces";

describe("sdk", function () {
  describe("instance", function () {
    describe("instancefilters", function () {
      it("should check filterUserInstances Method", async () => {
        let instanceDetails: PH.Instance.InstanceDetails = {
          instanceId: PH.Tools.createId(), // potential instanceId till execute
          processId: "xyz",
          extras: {
            roleOwners: {},
            fieldContents: {},
            todos: [
              {
                todoId: "123",
                userId: "xyz",
                workspaceId: "xyz",
                processId: "xyz",
                instanceId: "xyz",
                displayName: "test todo",
                description: "test description",
                bpmnTaskId: "xyz",
                bpmnLaneId: "xyz"
              } as TodoDetails
            ]
          }
        } as PH.Instance.InstanceDetails;

        let resInstDetails = InstanceFilters.filterUserInstances([ instanceDetails ], { userId: "xyz" } as any);

        assert.isTrue(resInstDetails.length === 1);
        assert.isTrue(resInstDetails.last().processId === "xyz");
        assert.isTrue(resInstDetails.last().extras.todos.length === 1);
        assert.isTrue(resInstDetails.last().extras.todos.last().displayName === "test todo");

        resInstDetails = InstanceFilters.filterUserInstances([ instanceDetails ], null);
        assert.isTrue(resInstDetails.length === 0);
      });
    });
  });
});