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

          path = PH.Path.parseUrl("/@testworkSpace/addprocess"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.WorkspacePage,
            view: PH.Workspace.WorkspaceView.AddProcess,
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

          path = PH.Path.parseUrl("/@testworkSpace/newprocess"); // ignore case and / at end
          assert.deepEqual(path, <PH.Path.PathDetails>{
            page: PH.Path.Page.ProcessPage,
            view: PH.Process.ProcessView.NewProcess,
            workspaceUrlName: "testworkspace"
          });
        });

      });

      describe("parseNotificationLink", function () {
        
        it("should parse invalid instance links", function () {
          let elements = PH.Path.parseNotificationLink("/i/invalidid"); // ignore case and / at end
          assert.deepEqual(elements, {});          
        });

        it("should parse current instance links", function () {
          let elements = PH.Path.parseNotificationLink("/I/@TestWorkspace/e8B278368B1002d7"); // ignore case and / at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7",
            workspaceUrlName: "testworkspace"
          });
        });

       
        it("should parse old instance/todo links", function () {
          // in previous versions workspace was not present in link, todoIds were sometimes added
          let elements = PH.Path.parseNotificationLink("/i/e8B278368B1002D7/000278368B1002d7"); // ignore case and todoId at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          }); 
          
          elements = PH.Path.parseNotificationLink("/i/e8B278368B1002D7"); // ignore case and todoId at end
          assert.deepEqual(elements, {
            instanceId: "E8B278368B1002D7"
          });           
        });        
      });
    });
  });
});