import * as PH from "./";

export interface IActionHandler { 
  // Load Page "/@workspace/..."
  gotoPage(path: string): void;

  openInstancePopup(instanceId: string, todoId?: string): void;
}
