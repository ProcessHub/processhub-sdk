import { assert } from "chai";
import * as PH from "../";

describe("sdk", function () {
  describe("path", function () {
    describe("urlparser", function () {

      describe("parseUrl", function () {

        it("soll ungültige Seiten erkennen", function () {
          assert.isNull(PH.Path.parseUrl("/@testworkSpace/xx")); // ignore case and / at end
          assert.isNull(PH.Path.parseUrl("/xx")); // ignore case and / at end
        });

        it("soll übergeordnete Seiten korrekt parsen", function () {
          let path = PH.Path.parseUrl("/"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.StartPage
          });
        });

        it("soll Workspaceseiten korrekt parsen", function () {
          let path = PH.Path.parseUrl("/@testworkSpace/"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.WorkspacePage,
            view: PH.Workspace.WorkspaceView.Processes,
            workspaceUrlName: "testworkspace" 
          });

          path = PH.Path.parseUrl("/@testworkSpace/members"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.WorkspacePage,
            view: PH.Workspace.WorkspaceView.Members,
            workspaceUrlName: "testworkspace" 
          });
        });

        it("soll Prozessseiten korrekt parsen", function () {
          let path = PH.Path.parseUrl("/@testworkSpace/p/process"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.ProcessPage,
            view: PH.Process.ProcessView.Show,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          });

          path = PH.Path.parseUrl("/@testworkSpace/p/process/edit"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.ProcessPage,
            view: PH.Process.ProcessView.Edit,
            workspaceUrlName: "testworkspace",
            processUrlName: "process"
          });
        });

      });

      describe("parseNotificationLink", function () {
        
        it("should parse instance links", function () {
          let elements = PH.Path.parseNotificationLink("/I/E8B278368B1002D7/"); // ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });

          elements = PH.Path.parseNotificationLink("/i/invalidid"); // ignore case and / at end
          assert.deepEqual(elements, {});          
        });

        it("should parse todo links", function () {
          let elements = PH.Path.parseNotificationLink("/I/E8B278368B1002D7/a7b178368b1002d5"); // ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            todoId: "A7B178368B1002D5"
          });

          elements = PH.Path.parseNotificationLink("/i/E8B278368B1002D7/invalidid"); // ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });       
        });        
      });
    });
  });
});