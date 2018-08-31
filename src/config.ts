import { isRoxtraEdition } from "./settings";

export function getBackendUrl(): string {
  if (process.env.API_URL != null) {
    // defined by webpack => this code is running in the browser
    let splittedUrl = window.location.href.split("/");
    return splittedUrl[0] + "//" + splittedUrl[2];
  } else {
    // this code is running on the server
    if (isRoxtraEdition) {
      return process.env.BACKEND_URL;
    } else {
      if (process.argv != null && process.argv.length == 3 && process.argv[2].startsWith("production")) {
        // production flag is used on servers. When servers have to access the api they should NOT
        // use app.processhub.com because this would route over AWS firewalls!
        // instead backendUrl is localhost for servers.
        if (process.argv[2] == "production_eb") {
          return "http://localhost:8081";
        }  else {
          return "http://localhost";
        }
      } else if (process.argv != null && process.argv.length == 3 && process.argv[2] == "stage-test") {
        return "http://localhost:8084";
      } else if (typeof navigator !== "undefined") {
        if (navigator.product == "ReactNative") {
          return "https://app.processhub.com";
        } else {
          return "http://localhost:8080";
        }
      }
    }
  }
}
