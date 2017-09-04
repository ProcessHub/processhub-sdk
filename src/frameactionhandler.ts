import * as PH from "./";

let waitingCommands: { [key: string]: any } = {};
let parenthost: string = "*";

// Plugins are hosted in iFrames for security reasons. Communication with ProcessHub is handled by messaging.
export class FrameActionHandler implements PH.IActionHandler {
  plugin: string;
  component: string;
  parenthost: string;

  constructor(plugin: string, component: string) {
    this.plugin = plugin;
    this.component = component;

    if (typeof window !== "undefined") {
      window.addEventListener("message", this.actionReplyListener, false);
      // Send init to "*" (no security risk here)
      window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":init" + ":" + PH.Tools.createId() + ":{}", "*");
    }
  }

  private sendMessage(command: string, jsonData: any): void {
    window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":" + command + ":" + PH.Tools.createId() + ":" + JSON.stringify(jsonData), parenthost);    
  }

  // Command format: 
  // [PHActionHandler]Plugin_Component:command:commandId:{data}
  private sendCommand(command: string, jsonData: any): Promise<any> {
    let commandId = PH.Tools.createId(); 
    window.parent.postMessage("[PHActionHandler]" + this.plugin + "_" + this.component + ":" + command + ":" + commandId + ":" + JSON.stringify(jsonData), parenthost);

    return new Promise<any>(function(resolve, reject) {
      waitingCommands[commandId] = resolve;
    });    
  }

  // Reply format:
  // [PHActionReceiver]Plugin_Component:command:commandId:{data}
  actionReplyListener(event: any) {
    if (event && event.data && event.data.length >= 18 && event.data.substr(0, 18) == "[PHActionReceiver]") {
      let message = event.data.substr(18);
      let split = message.split(":");
      let command = split[1];    
      let commandId = split[2];
      let data = JSON.parse(message.substr(split[0].length + split[1].length + split[2].length + 3));
      console.log("ActionReplyListener.Received: " + command + " " + commandId);
      if (command == "init") {
        parenthost = data.host;
      } else if (waitingCommands[commandId])
        waitingCommands[commandId](data);
    }
  }

  gotoPage(path: string) {
  }

  
  async requestExtras(environment: PH.CoreEnvironment, requestedExtras: PH.ExtrasRequest, forceReload?: boolean) {
  }

  openInstancePopup(instanceId: string, todoId?: string) {
  }
}

