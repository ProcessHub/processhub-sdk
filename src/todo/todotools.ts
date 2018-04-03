import { TodoEnvironment } from "../environment";
import { parseAndInsertStringWithFieldContent } from "../data";

export function getTodoTitle(todoEnv: TodoEnvironment): string {
  if (todoEnv.process.extras.settings && todoEnv.process.extras.settings.dashboard && todoEnv.process.extras.settings.dashboard.cardTitle) {
    // legacy code, settings are not available for new processes any more
    return parseAndInsertStringWithFieldContent(todoEnv.process.extras.settings.dashboard.cardTitle, todoEnv.instance.extras.fieldContents);
  } else if (todoEnv.instance.displayName && todoEnv.instance.displayName != "")
    return todoEnv.instance.displayName;
  else 
    return todoEnv.process.displayName + " " + todoEnv.instance.instanceNumber;
}
