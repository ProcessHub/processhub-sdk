import { ProcessDetails, ProcessViewAccess } from "./processinterfaces";
import { parseIdMailAddress } from "../instance/instancetools";
import * as Config from "../config";
import { isId } from "../tools/guid";

export function parseProcessMailSubject(mail: string): string {
  let possibleIdString = mail.substring(
    mail.indexOf("[") + 1,
    mail.indexOf("]")
  );

  if (!possibleIdString.startsWith("p-")) {
    return null;
  }

  possibleIdString = possibleIdString.substr(2, (possibleIdString.length - 1)); // remove "p-"
  possibleIdString = possibleIdString.toUpperCase();
  if (isId(possibleIdString)) {
    return possibleIdString;
  }
  return null;
}
export function parseProcessMailAddress(mail: string): string {
  return parseIdMailAddress("p-", mail);
}
export function getProcessMailAddress(processId: string): string {
  if (Config.getBackendUrl() == "http://localhost:8080")
    return "p-" + processId.toLowerCase() + "@testmail.processhub.com";
  else
    return "p-" + processId.toLowerCase() + "@mail.processhub.com";
}

// Init settings that don't exist with default values
export function initSettings(process: ProcessDetails): void {
  if (!process.extras.settings)
    process.extras.settings = {};

  let settings = process.extras.settings;

  if (!settings.dashboard)
    settings.dashboard = {};
  if (!settings.dashboard.dashBoardAccess)
    settings.dashboard.dashBoardAccess = ProcessViewAccess.WorkspaceMembersSeeAll; // default

  if (!settings.library)
    settings.library = {};
}