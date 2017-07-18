// Internal objects used by ProcessHub client and server
import * as PH from "../";

export class PathState {
  currentPage?: PH.Path.Page;
  currentView?: PH.Path.View;
  lastApiResult?: PH.LegacyApi.ApiResult;  // Ergebnis des letzten Api-Aufrufs
  isMobile?: boolean;
}

