import * as PH from "./";

export interface IActionHandler { 
  // Load Page "/@workspace/..."
  gotoPage(path: string): void;

  openInstancePopup(todoEnv: PH.TodoEnvironment | PH.InstanceEnvironment): void;
}
