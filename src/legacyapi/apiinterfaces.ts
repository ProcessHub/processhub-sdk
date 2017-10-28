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