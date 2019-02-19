import { assert } from "chai";
import * as StringTools from "./stringtools";

describe("sdk", function () {
  describe("tools", function () {
    describe("stringtools", function () {

      describe("isValidMailAddress", function () {
        it("soll gültige Mailadressen akzeptieren", function () {
          assert.isTrue(StringTools.isValidMailAddress("tr@processhub-nomail.com"));
        });
        it("soll ungültige Adressen ablehnen", function () {
          assert.isFalse(StringTools.isValidMailAddress("tr@test"));
          assert.isFalse(StringTools.isValidMailAddress(""));
          assert.isFalse(StringTools.isValidMailAddress(null));
        });
      });

      describe("isValidWorkspaceName", function () {
        it("soll gültige Workspacenamen akzeptieren", function () {
          assert.isTrue(StringTools.isValidWorkspaceName("ThomasTes-t"));
          assert.isTrue(StringTools.isValidWorkspaceName("thomas32"));
        });
        it("soll ungültige Workspacenamen ablehnen", function () {
          assert.isFalse(StringTools.isValidWorkspaceName("name with spaces"), "1");
          assert.isFalse(StringTools.isValidWorkspaceName(""), "2");
          assert.isFalse(StringTools.isValidWorkspaceName(null), "3");
          assert.isFalse(StringTools.isValidWorkspaceName("thom")), "4"; 
        });
      });

      describe("isValidRealname", function () {
        it("soll gültige Benutzernamen akzeptieren", function () {
          assert.isTrue(StringTools.isValidRealname("Thomas Müller"));
          assert.isTrue(StringTools.isValidRealname("Thoma"));
        });

        it("soll ungültige Benutzernamen ablehnen", function () {
          // Prüft lediglich Länge >= 5
          assert.isFalse(StringTools.isValidRealname("Thom"));
          assert.isFalse(StringTools.isValidRealname(null));
        });
      });

      describe("toCleanUrl", function () {
        it("soll Text url-tauglich formatieren", function () {
          assert.equal(StringTools.toCleanUrl("Mein schöner Titel"), "mein-schoener-titel");

          // Ungültige Zeichen entfernen
          assert.equal(StringTools.toCleanUrl("Ö/+\\.?=&#-ab"), "oe-ab");
        });

        it("soll Unicode Characters korrekt behandeln", function () {
          assert.equal(StringTools.toCleanUrl("위키백과:대문"), "위키백과:대문");
          assert.equal(StringTools.toCleanUrl("としょかん"), "としょかん");
          assert.equal(StringTools.toCleanUrl("كيبورد عربي"), "كيبورد-عربي");
        });
      });

      describe("stringExcerpt", function () {
        it("soll Strings kürzen", function () {
          assert.equal(StringTools.stringExcerpt("Mein schöner Titel", 100), "Mein schöner Titel");  // Unter Limit
          assert.equal(StringTools.stringExcerpt("Mein schöner Titel", 4), "Mein...");
          assert.equal(StringTools.stringExcerpt("Mein schöner Titel", 3), "Mei...");
          assert.equal(StringTools.stringExcerpt("Mein schöner Titel", 10), "Mein...");
        });
      });

      describe("getQueryParameter", function () {
        it("soll Parameter aus Querystrings ermitteln", function () {
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com"), null);
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com?test=Test1"), "Test1");
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com?test=Test1&test2"), "Test1");
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com?test2=x&test=Test1"), "Test1");
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com?test2=x&test=Test1&text"), "Test1");
          assert.equal(StringTools.getQueryParameter("test", "http://processhub.com?test2=x&test=&text"), "");
        });
      });

      describe("splitStringOnMultipleSigns", function () {
        it("soll eingegebene Emailadressen mit Separator als Array zurückliefern", function () {
          let initSign = StringTools.SPLITSIGN_EMAILADDRESSES[0];
          // Should also accept+ignore multiple signs
          let testString = "testuser@processhub.com" + initSign + "testuser2@processhub.com" + initSign + initSign + "testuser3@processhub.com" + initSign + "test@processhub.com" + initSign;

          for (let i = 0; i < StringTools.SPLITSIGN_EMAILADDRESSES.length; i++) {
            let res = StringTools.splitStringOnMultipleSigns(testString);
            assert.equal(res.length, 4, "Error beim splitten mit Zeichen " + StringTools.SPLITSIGN_EMAILADDRESSES[i] + "\nMit String : " + testString);
            if ((i + 1) < StringTools.SPLITSIGN_EMAILADDRESSES.length)
              testString = testString.replace(new RegExp(StringTools.SPLITSIGN_EMAILADDRESSES[i], "g"), StringTools.SPLITSIGN_EMAILADDRESSES[i + 1]);
          }

          let res = StringTools.splitStringOnMultipleSigns("");
          assert.equal(res, null, "Error beim splitten leerem String");
        });

        it("soll eingegebene Emailadresse als Arrayelement zurückliefern", function () {
          const res = StringTools.splitStringOnMultipleSigns("caspari@roxtra.com");
          assert(res, "splitStringOnMultipleSigns lieferte " + res);
          assert(res.length === 1, "res hat " + res.length + " Einträge");
        });
      });

    });
  });
});