import * as React from "react";
import { IActionHandler } from "./iactionhandler";

export interface PluginProperties {
  user: string;
  actionHandler: IActionHandler;
}
