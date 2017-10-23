import { assert } from "chai";
import { ProcessView } from "../process/phclient";
import { WorkspaceView } from "../workspace/phclient";
import { Page, PathDetails } from "./pathinterfaces";
import { parseNotificationLink, parseUrl } from "./urlparser";

describe("sdk", function () {
  describe("path", function () {
    describe("urlparser", function () {

      describe("parseUrl", function () {

        it("soll ungültige Seiten erkennen", function () {
          assert.isNull(parseUrl("/@testworkSpace/xx")); // ignore case and / at end
          assert.isNull(parseUrl("/xx")); // ignore case and / at end
        });

        it("soll übergeordnete Seiten korrekt parsen", function () {
          let path = parseUrl("/"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.StartPage
          });
        });

        it("soll Workspaceseiten korrekt parsen", function () {
          let path = parseUrl("/@testworkSpace/"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.WorkspacePage,
            view: WorkspaceView.Processes,
            workspaceUrlName: "testworkspace" 
          });

          path = parseUrl("/@testworkSpace/members"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.WorkspacePage,
            view: WorkspaceView.Members,
            workspaceUrlName: "testworkspace" 
          });

          path = parseUrl("/@testworkSpace/addprocess"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.WorkspacePage,
            view: WorkspaceView.AddProcess,
            workspaceUrlName: "testworkspace" 
          });
        });

        it("soll Prozessseiten korrekt parsen", function () {
          let path = parseUrl("/@testworkSpace/p/process"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.ProcessPage,
            view: ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          });

          path = parseUrl("/@testworkSpace/p/process/edit"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.ProcessPage,
            view: ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          });

          path = parseUrl("/@testworkSpace/newprocess"); // ignore case and / at end
          assert.deepEqual(path, <PathDetails>{
            page: Page.ProcessPage,
            view: ProcessView.NewProcess,
            workspaceUrlName: "testworkspace"
          });
        });

      });

      describe("parseNotificationLink", function () {
        
        it("should parse invalid instance links", function () {
          let elements = parseNotificationLink("/i/invalidid"); // ignore case and / at end
          assert.deepEqual(elements, {});          
        });

        it("should parse current instance links", function () {
          let elements = parseNotificationLink("/I/@TestWorkspace/e8B278368B1002d7"); // ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            workspaceUrlName: "testworkspace"
          });
        });

       
        it("should parse old instance/todo links", function () {
          // in previous versions workspace was not present in link, todoIds were sometimes added
          let elements = parseNotificationLink("/i/e8B278368B1002D7/000278368B1002d7"); // ignore case and todoId at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          }); 
          
          elements = parseNotificationLink("/i/e8B278368B1002D7"); // ignore case and todoId at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });           
        });        
      });
    });
  });
});