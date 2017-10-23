import { isValidProcessView, ProcessView } from "../process/phclient";
import { isTrue } from "../tools/assert";
import { isId } from "../tools/guid";
import { isValidWorkspaceView, WorkspaceView } from "../workspace/phclient";
import { NotificationLinkElements, Page, PathDetails } from "./pathinterfaces";

export function parseUrl(fullUrl: string): PathDetails {
  let path: PathDetails = {};

  // split path
  isTrue(fullUrl.substr(0, 1) == "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))  // ignore "/" on end
    url = url.substr(0, url.length - 1);
  let split = url.split("/");

  // pages not related to workspace
  let part = split[0];
  if ((part == "" && split.length == 1)
    || (part == "i" && split.length >= 2)) {   // Instance and Todo-links are handled on StartPage
    path.page = Page.StartPage;
    return path;
  } else if (part == "signin" && split.length == 1) {
    path.page = Page.SigninPage;
    return path;
  } else if (part == "signup" && split.length == 1) {
    path.page = Page.SignupPage;
    return path;
  } else if (part == "library" && split.length == 1) {
    path.page = Page.LibraryPage;
    return path;
  } else if (!part.startsWith("@")) {
    // ...otherwise workspace must follow
    return null;
  }

  // -> Workspace  
  path.workspaceUrlName = part.substr(1);

  part = (split.length >= 2 ? split[1] : WorkspaceView.Processes);
  if (isValidWorkspaceView(part) && split.length <= 2) {
    path.page = Page.WorkspacePage;
    path.view = <WorkspaceView>part;
    return path;
  } else if (part == ProcessView.NewProcess) {
    path.page = Page.ProcessPage;
    path.view = <ProcessView>part;
    return path;
  } else if (part != "p" || split.length < 3) {
    // ...otherwise process must follow
    return null;
  }

  // -> Process
  path.processUrlName = decodeURIComponent(split[2]);

  part = (split.length >= 4 ? split[3] : ProcessView.Show);
  if (isValidProcessView(part) && split.length <= 4) {
    path.page = Page.ProcessPage;
    path.view = <ProcessView>part;
    return path;
  } else
    return null;
} 

export function parseNotificationLink(fullUrl: string): NotificationLinkElements {
  let elements: NotificationLinkElements = {};
  
  // split path
  isTrue(fullUrl.substr(0, 1) == "/", "Url doesn't start with /");
  let url = fullUrl.toLowerCase().substr(1);
  if (url.endsWith("/"))  // ignore "/" on end
    url = url.substr(0, url.length - 1);
  let split = url.split("/");

  if (split[0] != "i" || split.length < 2)
    return elements;

  let nextPart = split[1];
  if (nextPart.substr(0, 1) == "@") {
    // workspaceUrl
    elements.workspaceUrlName = nextPart.substr(1).toLowerCase();
    if (split.length == 2)
      return elements;

    nextPart = split[2];
  }
  if (!isId(nextPart.toUpperCase()))
    return elements;
  else
    elements.instanceId = nextPart.toUpperCase();

  return elements;
}