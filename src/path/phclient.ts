import { PathDetails } from "./pathinterfaces";
import { ApiResult } from "../legacyapi/apiinterfaces";

// Internal objects used by ProcessHub client and server

export class PathState {
  currentPath: PathDetails;

  lastApiResult?: ApiResult;  // Ergebnis des letzten Api-Aufrufs
}

