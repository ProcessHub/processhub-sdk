import { UserDetails } from "./userinterfaces";
import { CoreEnvironment } from "../environment";

export function requireAuthentication(coreEnv: CoreEnvironment): void {
  if (!coreEnv.user) {
    // no user is logged in - redirect to signin
    if (typeof window != "undefined") {  // otherwise fails on server rendering
      window.location.href = "/signin?redirect=" + encodeURIComponent(window.location.pathname);
    } else
      // 401 will result in redirect in renderroute
      throw { error: 401 };
  }
}

// user.lanugage contains the preferred user language, even if it does not (yet) exist
// in ProcessHub (e.g. "fr", if user is french)
// getBestUserLanguage returns the best language for the user that also exists in ProcessHub
export function getBestUserLanguage(user: UserDetails): string {
  // currently we only have de...
  if (user == null)
    return "de";

  return "de";
}