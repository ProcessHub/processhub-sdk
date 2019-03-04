import { assert, expect } from "chai";
import { sleep, getFormattedTimeZoneOffset } from "./timing";

describe("tools", function () {
  describe("timing", function () {

    describe("sleep", function () {
      it("should wait", async function () {

        let startat = new Date().getTime();
        await sleep(1200);
        let endat = new Date().getTime();
        assert.isAtLeast(endat - startat, 1000);
      });
    });

    describe("getFormattedTimeZoneOffset", function () {
      it("GMT+0100", () => {
        expect(getFormattedTimeZoneOffset(-60)).to.equal("GMT+01:00");
      });

      it("GMT+0530 (India)", () => {
        expect(getFormattedTimeZoneOffset(-330)).to.equal("GMT+05:30");
      });

      it("GMT-0130", () => {
        expect(getFormattedTimeZoneOffset(90)).to.equal("GMT-01:30");
      });

      it("GMT+0000", () => {
        expect(getFormattedTimeZoneOffset(0)).to.equal("GMT+00:00");
      });
    });

  });
});
