import * as PH from "../";

export function isProcessDetailsValid(details: PH.Process.ProcessDetails): boolean {
  if (details.displayName.length < 6 || details.displayName.length > 50)
    return false;

  return true;
}

/**
 * check if a given process name is valid
 * @param processname {string} the process name to check
 * @return {string} an empty string if the name is valid, an error message otherwise
 */
export function isProcessDisplayNameValid(processname: string): string {
  if (processname.length < 6) {
    return PH.tl("Minimum 6 Zeichen");
  } else if (processname.length > 50) {
    return PH.tl("Maximum 50 Zeichen");
  } else {
    return "";
  }
}