import { expect } from "chai";
import { momentFromUtcDate } from ".";
import { tl } from "..";

describe("sdk", function () {
  describe("tools", function () {
    describe("moment", function () {

      describe("momentFromUtcDate", function () {
        it("should return now for 30 secs ago", () => {
          const now: Date = new Date();
          const thirtySecsAgo = new Date(now.getTime() - 30 * 1000);
          expect(momentFromUtcDate(thirtySecsAgo)).to.equal(tl("jetzt"));
        });

        it("should return now for tomorrow", () => {
          const now: Date = new Date();
          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          expect(momentFromUtcDate(tomorrow)).to.equal(tl("jetzt"));
        });

        it("should not return now for 90 secs ago", () => {
          const now: Date = new Date();
          const ninetySecsAgo = new Date(now.getTime() - 90 * 1000);
          expect(momentFromUtcDate(ninetySecsAgo)).not.to.equal(tl("jetzt"));
        });

      });
    });
  });
});