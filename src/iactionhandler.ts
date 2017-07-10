import * as PH from "../";

export interface IActionHandler {  
  getProcessDetails(processId: string): Promise<PH.ProcessDetailsShort>;
}
