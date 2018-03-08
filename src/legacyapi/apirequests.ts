import "fetch-everywhere";
import { getErrorHandlers } from "./errorhandler";
import { backendUrl } from "../config";
import { BaseRequest, ApiResult, BaseError, ApiError, BaseMessage, API_FAILED, BaseReply } from "./apiinterfaces";

// Api-Aufruf per GET 
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getJson<Request extends BaseRequest>(path: string, request: Request, accessToken: string = null): Promise<BaseMessage> {

  // Request als Querystring serialisieren
  let str = [];
  for (let p in request) {
    if (request.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(String(request[p])));
    }
  }

  let url = backendUrl + path + "?" + str.join("&");

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      headers: {
        "Accept": "application/json"
      } as any,
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        "Accept": "application/json",
        "x-accesstoken": accessToken,   // x-accesstoken Kleinschreibung erforderlich
        "authorization": accessToken
      } as any
    };
  }
  try {
    let response = await fetch(url, req);
    switch (response.status) {
      case 200:
        let json = await response.json();
        if (json.result !== ApiResult.API_OK) {
          console.log("getJson " + url + ": " + json.result);
          console.log(json);
        }
        return json;
      case 403:  // API_FORBIDDEN -> server requests redirect to signin
        if (typeof window != "undefined"  //  not possible on server rendering
          && !window.location.pathname.startsWith("/signin")) {
          window.location.href = "/signin?redirect=" + encodeURIComponent(window.location.pathname);
        }
      default:
        const error: BaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach(h => h.handleError(error, path));
        return error;
    }
  } catch (ex) {
    // For Testing
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      let testResult: BaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK
      };
      return testResult;
    }
    throw new Error(ex.message);
  }
}

// Api-Aufruf per POST 
// Gemäß http-Spezifikation soll POST genutzt werden, wenn der Aufruf zu Änderungen auf der Serverseite führt
// POST-Anforderungen werden ohne explizite Useranforderung vom Browser NICHT wiederholt ausgeführt
export async function postJson<Request extends BaseRequest>(path: string, request: Request, accessToken: string = null): Promise<BaseMessage> {
  let url = backendUrl + path;

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      } as any,
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-accesstoken": accessToken   // x-accesstoken Kleinschreibung erforderlich
      } as any
    };
  }
  try {
    let response = await fetch(url, req);
    switch (response.status) {
      case 200:
        let json = await response.json();
        if (json.result !== ApiResult.API_OK) {
          console.log("postJson " + url + ": " + json.result);
          console.log(json);
        }
        return json;
      default:
        const error: BaseError = { result: response.status as ApiResult, type: API_FAILED };
        getErrorHandlers().forEach(h => h.handleError(error, path));
        return error;
    }
  } catch (ex) {
    // For Testing
    if (ex != null && ex.message.startsWith("request to http://localhost:8080/api/processengine/")) {
      let testResult: BaseMessage = {
        type: "Test Result",
        result: ApiResult.API_OK
      };
      return testResult;
    }
    throw new Error(ex.message);
  }
}


// externer Api-Aufruf per GET 
// Gemäß http-Spezifikation soll GET genutzt werden, wenn der Aufruf keine Änderungen auf Serverseite auslöst
// Browser dürfen fehlgeschlagene/verzögerte GET-Aufrufe jederzeit wiederholen, das ist gut, wenn die Verbindung hängt
export async function getExternalJson<Request extends BaseRequest>(apiEndpointUrl: string, request: Request, accessToken: string = null): Promise<any> {

  // Request als Querystring serialisieren
  let str = [];
  for (let p in request) {
    if (request.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(String(request[p])));
    }
  }

  let url = apiEndpointUrl + "?" + str.join("&");

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      headers: {
        "Accept": "application/json"
      } as any,
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        "Accept": "application/json",
        "x-accesstoken": accessToken   // x-accesstoken Kleinschreibung erforderlich
      } as any
    };
  }
  let response = await fetch(url, req);

  switch (response.status) {
    case 200:
      let json = await response.json();
      if (json.result !== ApiResult.API_OK) {
        console.log("getJson " + url + ": " + json.result);
        console.log(json);
      }
      return json;
    case 403:  // API_FORBIDDEN -> server requests redirect to signin
      if (typeof window != "undefined"  //  not possible on server rendering
        && !window.location.pathname.startsWith("/signin")) {
        window.location.href = "/signin?redirect=" + encodeURIComponent(window.location.pathname);
      }
    default:
      const error: BaseError = { result: response.status as ApiResult, type: API_FAILED };
      getErrorHandlers().forEach(h => h.handleError(error, url));
      return error;
  }
}