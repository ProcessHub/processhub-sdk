import { tl } from "../tl";
import { ProcessDetails } from "./processinterfaces";

export function isProcessDetailsValid(details: ProcessDetails): boolean {
  if (details.displayName.length < 3 || details.displayName.length > 50)
    return false;

  return true;
}

/**
 * check if a given process name is valid
 * @param processname {string} the process name to check
 * @return {string} an empty string if the name is valid, an error message otherwise
 */
export function isProcessDisplayNameValid(processname: string): string {
  if (processname.length < 3) {
    return tl("Minimum 3 Zeichen");
  } else if (processname.length > 50) {
    return tl("Maximum 50 Zeichen");
  } else {
    return "";
  }
}