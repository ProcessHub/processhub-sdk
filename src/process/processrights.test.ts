import { expect } from "chai";
import { isDefaultRole, DefaultRoles } from "./processrights";

describe("sdk", function () {
  describe("process", function () {
    describe("processrights", function () {

      describe("isDefaultRole", function () {

        it("Follower", function () {
          expect(isDefaultRole(DefaultRoles.Follower)).to.equal(true);
        });

        it("Manager", function () {
          expect(isDefaultRole(DefaultRoles.Manager)).to.equal(true);
        });

        it("Owner", function () {
          expect(isDefaultRole(DefaultRoles.Owner)).to.equal(true);
        });

        it("Viewer", function () {
          expect(isDefaultRole(DefaultRoles.Viewer)).to.equal(true);
        });

      });
      
    });
  });
});