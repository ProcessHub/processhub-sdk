import { expect } from "chai";
import { parseProcessMailAddress } from "./processtools";

describe("sdk", function () {
  describe("process", function () {
    describe("processtools", function () {
      it("parses processId from mail address", () => {
        expect(parseProcessMailAddress("p-9F95E3DBF9CB47EF@mail.processhub.com")).to.equal("9F95E3DBF9CB47EF");
        expect(parseProcessMailAddress("i-9F95E3DBF9CB47EF@mail.processhub.com")).to.equal(null);
        expect(parseProcessMailAddress("mail@mail.processhub.com")).to.equal(null);
      });
    });
  });
});