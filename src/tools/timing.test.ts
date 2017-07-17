import { assert } from "chai";
import { sleep } from "./timing";

describe("tools", function() {
  describe("timing", function() {

    describe("sleep", function() {
      it("soll Wartezeit erzwingen", async function() {

        let startat = new Date().getTime();  
        await sleep(1200); 
        let endat = new Date().getTime();  
        assert.isAtLeast(endat - startat, 1000);
      });

    });

  });
});
