import * as PH from "../";

// Init settings that don't exist with default values
export function initSettings(process: PH.Process.ProcessDetails): void {
  if (!process.extras.settings)
    process.extras.settings = {};

  let settings = process.extras.settings;

  if (!settings.dashboard)
    settings.dashboard = {};
  if (!settings.dashboard.dashBoardAccess)
    settings.dashboard.dashBoardAccess = PH.Process.ProcessViewAccess.ParticipantsSeeTheirs;

  if (!settings.archive)
    settings.archive = {};
  if (!settings.archive.archiveAccess)
    settings.archive.archiveAccess = PH.Process.ProcessViewAccess.ParticipantsSeeTheirs;
}