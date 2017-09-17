import * as PH from "../";

export function parseUrl(fullUrl: string): PH.Path.PathDetails {
  let path: PH.Path.PathDetails = {};

  // split path
  PH.Assert.isTrue(fullUrl.substr(0, 1) == "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))  // ignore "/" on end
    url = url.substr(0, url.length - 1);
  let split = url.split("/");

  // pages not related to workspace
  let part = split[0];
  if ((part == "" && split.length == 1)
    || (part == "i" && split.length >= 2)) {   // Instance and Todo-links are handled on StartPage
    path.page = PH.Path.Page.StartPage;
    return path;
  } else if (part == "signin" && split.length == 1) {
    path.page = PH.Path.Page.SigninPage;
    return path;
  } else if (part == "signup" && split.length == 1) {
    path.page = PH.Path.Page.SignupPage;
    return path;
  } else if (part == "library" && split.length == 1) {
    path.page = PH.Path.Page.LibraryPage;
    return path;
  } else if (!part.startsWith("@")) {
    // ...otherwise workspace must follow
    return null;
  }

  // -> Workspace  
  path.workspaceUrlName = part.substr(1);

  part = (split.length >= 2 ? split[1] : PH.Workspace.WorkspaceView.Processes);
  if (PH.Workspace.isValidWorkspaceView(part) && split.length <= 2) {
    path.page = PH.Path.Page.WorkspacePage;
    path.view = <PH.Workspace.WorkspaceView>part;
    return path;
  } else if (part == PH.Process.ProcessView.NewProcess) {
    path.page = PH.Path.Page.ProcessPage;
    path.view = <PH.Process.ProcessView>part;
    return path;
  } else if (part != "p" || split.length < 3) {
    // ...otherwise process must follow
    return null;
  }

  // -> Process
  path.processUrlName = decodeURIComponent(split[2]);

  part = (split.length >= 4 ? split[3] : PH.Process.ProcessView.Show);
  if (PH.Process.isValidProcessView(part) && split.length <= 4) {
    path.page = PH.Path.Page.ProcessPage;
    path.view = <PH.Process.ProcessView>part;
    return path;
  }

  return path;
} 

export function parseNotificationLink(fullUrl: string): PH.Path.NotificationLinkElements {
  let elements: PH.Path.NotificationLinkElements = {};
  
  // split path
  PH.Assert.isTrue(fullUrl.substr(0, 1) == "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))  // ignore "/" on end
    url = url.substr(0, url.length - 1);
  let split = url.split("/");

  if (split[0] != "i" || split.length < 2)
    return elements;

  let instanceId = split[1].toUpperCase();
  if (!PH.Tools.isId(instanceId))
    return elements;
  else
    elements.instanceId = instanceId;

  if (split.length < 3)
    return elements;

  let todoId = split[2].toUpperCase();
  if (!PH.Tools.isId(todoId))
    return elements;
  else
    elements.todoId = todoId;
  
  return elements;
}