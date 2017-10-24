import { UserDetails } from "./userinterfaces";

// user.lanugage contains the preferred user language, even if it does not (yet) exist
// in ProcessHub (e.g. "fr", if user is french)
// getBestUserLanguage returns the best language for the user that also exists in ProcessHub
export function getBestUserLanguage(user: UserDetails): string {
  // currently we only have de...
  if (user == null)
    return "de";

  return "de";
}