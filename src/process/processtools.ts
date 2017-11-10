import { ProcessDetails, ProcessViewAccess } from "./processinterfaces";
import { parseIdMailAddress } from "../instance/instancetools";
import * as Config from "../config";

export function parseProcessMailAddress(mail: string): string {
  return parseIdMailAddress("p-", mail);
}
export function getProcessMailAddress(processId: string): string {
  if (Config.backendUrl == "http://localhost:8080")
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
    settings.dashboard.dashBoardAccess = ProcessViewAccess.ParticipantsSeeTheirs;
  if (!settings.dashboard.showComments)
    settings.dashboard.showComments = 0;
    
  if (!settings.archive)
    settings.archive = {};
  if (!settings.archive.archiveAccess)
    settings.archive.archiveAccess = ProcessViewAccess.ParticipantsSeeTheirs;

  if (!settings.library)
    settings.library = {};
}