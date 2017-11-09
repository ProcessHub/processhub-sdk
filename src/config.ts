// from webpack config
export let backendUrl = process.env.API_URL;
// ist nur möglich aus der config zu laden für den Client nicht für den Server
// TODO PP hier gibt es sicher noch eine elegantere Lösung
if (process.env.API_URL == null) {
  if (process.argv != null && process.argv.length == 3 && process.argv[2] == "production") {
    // production flag is used on servers. When servers have to access the api they should NOT
    // use app.processhub.com because this would route over AWS firewalls!
    // instead backendUrl is localhost for servers.
    backendUrl = "http://localhost"; 
  } else if (process.argv != null && process.argv.length == 3 && process.argv[2] == "stage-test") {
    backendUrl = "http://localhost:8084";
  } else if (typeof navigator !== "undefined") {
    if (navigator.product == "ReactNative") {
      backendUrl = "https://app.processhub.com";
    }
  } else {
    backendUrl = "http://localhost:8080";
  }
} else {
  let splittedUrl = window.location.href.split("/");
  backendUrl = splittedUrl[0] + "//" + splittedUrl[2];
}

