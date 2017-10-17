import { ProcessDetails, ProcessViewAccess } from "./processinterfaces";

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
}