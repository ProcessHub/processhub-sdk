// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class PathState {
  currentPath: PH.Path.PathDetails;

  lastApiResult?: PH.LegacyApi.ApiResult;  // Ergebnis des letzten Api-Aufrufs
}

