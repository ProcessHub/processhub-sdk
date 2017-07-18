import "fetch-everywhere";
import { getErrorHandlers } from "./errorhandler";

// aus webpack config
let backendUrl = process.env.API_URL;
// ist nur möglich aus der config zu laden für den Client nicht für den Server
// TODO PP hier gibt es sicher noch eine elegantere Lösung
if (process.env.API_URL == null) {
  if (process.argv != null && process.argv.length == 3 && process.argv[2] == "production") {
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

export const BACKEND_URL = backendUrl;

// Die ApiResults werden auch als Http Statuscodes genutzt
export enum ApiResult {
  API_OK = 200,
  API_INVALID = 400,
  API_DENIED = 401,
  API_FORBIDDEN = 403,
  API_NOTFOUND = 404,
  API_DUPLICATE = 409,
  API_NOTEMPTY = 423,
  API_ERROR = 500,
}
// export const API_OK = 200;
// export const API_INVALID = 400;  // ungültige Anfrage
// export const API_ERROR = 500;  // Serverfehler
// export const API_DENIED = 401;
// export const API_DUPLICATE = 409; // Datensatz gibt es bereits
// export const API_NOTFOUND = 404;
// export const API_NOTEMPTY = 423; // Workspace/Bucket kann nicht entfernt werden, da er noch Elemente enthält
// export type ApiResult = 200 | 400 | 401 | 409 | 404 | 423 | 500;

export type ApiError = 400 | 401 | 409 | 404 | 423 | 500;

export interface BaseReply {
  type?: string;
  result?: ApiResult;
  errorCode?: ApiResult;
}

export interface BaseRequest {
}

export interface BaseMessage extends BaseReply {
  type: string;
}

export const API_FAILED = "FAILED";
export const API_SUCCESS = "OK";
export interface BaseError extends BaseMessage {
  errorCode: ApiError;
  request?: BaseRequest;  // Enthält den urprünglichen Aufruf
}

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

  let url = BACKEND_URL + path + "?" + str.join("&");

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      headers: {
        "Accept": "application/json"
      },
      credentials: "include"
    };
  } else {
    // In Tests wird AccessToken manuell übergeben, um Anmeldungen zu prüfen
    req = {
      headers: {
        "Accept": "application/json",
        "x-accesstoken": accessToken   // x-accesstoken Kleinschreibung erforderlich
      }
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
    default:
      const error: BaseError = { result: response.status as ApiResult, type: API_FAILED, errorCode: response.status as ApiError };
      getErrorHandlers().forEach(h => h.handleError(error, path));
      return error;
  }
}

// Api-Aufruf per POST 
// Gemäß http-Spezifikation soll POST genutzt werden, wenn der Aufruf zu Änderungen auf der Serverseite führt
// POST-Anforderungen werden ohne explizite Useranforderung vom Browser NICHT wiederholt ausgeführt
export async function postJson<Request extends BaseRequest>(path: string, request: Request, accessToken: string = null): Promise<BaseMessage> {
  let url = BACKEND_URL + path;

  let req: RequestInit = null;
  if (accessToken == null) {
    req = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
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
      }
    };
  }
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
      const error: BaseError = { result: response.status as ApiResult, type: API_FAILED, errorCode: response.status as ApiError };
      getErrorHandlers().forEach(h => h.handleError(error, path));
      return error;
  }
}
