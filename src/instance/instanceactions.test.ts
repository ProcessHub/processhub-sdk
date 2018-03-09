import { assert } from "chai";
import { fieldContentsExcerpt, parseInstanceMailAddress, getInstanceMailAddress } from "./instancetools";
import { createId } from "../tools/guid";
import * as InstanceActions from "./instanceactions";
import * as PH from "../";
import { ApiResult } from "../legacyapi/index";
import { rootStore } from "../statehandler/rootstore";
import { InstanceExtras } from "./instanceinterfaces";
import { InstanceState } from "./phclient";

describe("sdk", function () {
    describe("instance", function () {
        describe("instanceactions", function () {
            it("should check executeInstance Action", async () => {

                let instanceDetails: PH.Instance.InstanceDetails = {
                    instanceId: PH.Tools.createId(), // potential instanceId till execute
                    processId: "xyz",
                    extras: {
                        roleOwners: {},
                        fieldContents: {}
                    }
                } as PH.Instance.InstanceDetails;

                let res = await InstanceActions.executeInstance("xyz", instanceDetails);

                assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                assert.isTrue(res.type === "Test Result", "Wrong api return type");
            });

            it("should check updateInstance Action", async () => {

                let instanceDetails: PH.Instance.InstanceDetails = {
                    instanceId: PH.Tools.createId(), // potential instanceId till execute
                    processId: "xyz",
                    extras: {
                        roleOwners: {},
                        fieldContents: {}
                    }
                } as PH.Instance.InstanceDetails;

                let res = await InstanceActions.updateInstance(instanceDetails);

                assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                assert.isTrue(res.type === "Test Result", "Wrong api return type");
            });

            it("should check resumeProcess Action", async () => {
                let resumeDetails: PH.Instance.ResumeInstanceDetails = {
                    workspaceId: "xyz",
                    instanceId: "xyz",
                    completedTodoId: "xyz"
                } as PH.Instance.ResumeInstanceDetails;

                let res = await InstanceActions.resumeProcess(resumeDetails);

                assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                assert.isTrue(res.type === "Test Result", "Wrong api return type");
            });

            it("should check abortInstace Action", async () => {
                let res = await InstanceActions.abortInstance("xyz");
                assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                assert.isTrue(res.type === "Test Result", "Wrong api return type");
            });

            it("should check jump Action", async () => {
                let resumeDetails: PH.Instance.ResumeInstanceDetails = {
                    workspaceId: "xyz",
                    instanceId: "xyz",
                    completedTodoId: "xyz"
                } as PH.Instance.ResumeInstanceDetails;

                let res = await InstanceActions.jump("xyz", "xyz", resumeDetails);

                assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                assert.isTrue(res.type === "Test Result", "Wrong api return type");
            });

            it("should check loadInstance Action", async () => {
                let instanceDetails: PH.Instance.InstanceDetails = {
                    workspaceId: "xyz",
                    displayName: "xyz",
                    state: null,
                    latestCommentAt: null,
                    instanceId: PH.Tools.createId(), // potential instanceId till execute
                    processId: "xyz",
                    extras: {
                        roleOwners: { "xyz": [ { memberId: "xyz"} ] },
                        fieldContents: {}
                    }
                } as PH.Instance.InstanceDetails;

                rootStore.getState().instanceState = { instanceCache: { "xyz": instanceDetails }, lastDispatchedInstance: instanceDetails } as InstanceState;
                let res = await InstanceActions.loadInstance("xyz",
                    InstanceExtras.ExtrasAuditTrail | 
                    InstanceExtras.ExtrasFieldContents | 
                    InstanceExtras.ExtrasRoleOwners | 
                    InstanceExtras.ExtrasRoleOwnersWithNames | 
                    InstanceExtras.ExtrasState | 
                    InstanceExtras.ExtrasTodos 
                );
                // assert.isTrue(res.result === ApiResult.API_OK, "Wrong Api-Result");
                // assert.isTrue(res.type === "Test Result", "Wrong api return type");

            });
        });
    });
});