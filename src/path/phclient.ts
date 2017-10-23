import { ApiResult } from "../legacyapi/apirequests";
import { PathDetails } from "./pathinterfaces";

// Internal objects used by ProcessHub client and server

export class PathState {
  currentPath: PathDetails;

  lastApiResult?: ApiResult;  // Ergebnis des letzten Api-Aufrufs
}

