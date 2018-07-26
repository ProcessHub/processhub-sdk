import { assert } from "chai";
import * as Guid from "./guid";
import { isRoxtraEdition } from "../settings";

describe("sdk", function () {
  describe("tools", function () {
    describe("guid", function () {

      describe("createId", function () {
        it("should create valid Id", function () {
          let id = Guid.createId();
          assert(id.length === 16);
          assert(id.toUpperCase() === id);
        });
        it("should create different Ids", function () {
          let id = Guid.createId();
          assert(id !== Guid.createId());
        });
      });

      if (!isRoxtraEdition) {
        describe("createUserId_isUserId", function () {
          it("should create and identify UserId", function () {
            let id = Guid.createUserId();
            assert.isTrue(Guid.isId(id));
            assert.isTrue(Guid.isUserId(id));
            assert.isFalse(Guid.isGroupId(id));
            assert.isTrue(Guid.isUserId("02DDAC85360AB506")); // UserIds beginnen mit "0"
            assert.isFalse(Guid.isUserId("12DDAC85360AB506")); // UserIds beginnen mit "0"          
          });
        });

        describe("createGroupId_isGroupId", function () {
          it("Should create and identify GroupIds", function () {
            let id = Guid.createGroupId();
            assert.isTrue(Guid.isId(id));
            assert.isTrue(Guid.isGroupId(id));
            assert.isFalse(Guid.isUserId(id));
            assert.isTrue(Guid.isGroupId("12DDAC85360AB506")); // GroupIds beginnen mit "1"
            assert.isFalse(Guid.isGroupId("02DDAC85360AB506")); // GroupIds beginnen mit "1"
          });
        });
      }
      
      describe("createWorkspaceId_isWorkspaceId", function () {
        it("Should create and identify WorkspaceIds", function () {
          let id = Guid.createWorkspaceId();
          assert.isTrue(Guid.isId(id));
          assert.isTrue(Guid.isWorkspaceId(id));
          assert.isTrue(Guid.isWorkspaceId("2000AC85360AB506")); // WorkspaceIds beginnen mit "2"
          assert.isFalse(Guid.isWorkspaceId("72DDAC85360AB506")); // WorkspaceIds beginnen mit "2"
        });
      });

      describe("isId", function () {
        it("Should accept valid Ids", function () {
          assert.isTrue(Guid.isId("72DDAC85360AB506"));
        });
        it("should decline invalid Ids", function () {
          assert.isFalse(Guid.isId("72ddac85360ab506"));
          assert.isFalse(Guid.isId("72DDAC85360AB5"));
        });
      });

      describe("nullId", function () {
        it("should create empty NullId", function () {
          assert.isTrue(Guid.isId(Guid.nullId()));
          assert.equal(Guid.nullId(), "0000000000000000");
        });

      });
      describe("createInstanceNumber", function () {
        it("soll gültige Nummern erzeugen", function () {
          let numStr = Guid.createInstanceNumber();
          assert.equal(numStr.length, 12);
          assert.equal(numStr.substr(3, 1), ".");
          assert.equal(numStr.substr(8, 1), ".");
        });
      });

    });
  });
});
