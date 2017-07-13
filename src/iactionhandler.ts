import * as PH from "./";

export interface IActionHandler {  
  getEnvironment(): Promise<any>;
}
