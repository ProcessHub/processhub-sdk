const Nes = require("nes");
import * as StateHandler from "../statehandler";
import { getJson, BaseMessage, ApiResult } from "../legacyapi";
import { UserDetails } from "../user/userinterfaces";
import { getBackendUrl } from "../config";

export interface PublishSubscribeRegisterObject {
  wildcard: string;
  subscriptionPath: string;
  resolvePath: (value: string) => string;
}

export const resolveFunction = (obj: any, value: string): string => {
  return obj.subscriptionPath.replace(obj.wildcard, value);
};

export const PublishSubscriptionObjects: { [Id: string]: PublishSubscribeRegisterObject } = {
  newInstance: { wildcard: "{userId}", subscriptionPath: "/ws/newInstance/{userId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
  updateInstance: { wildcard: "{instanceId}", subscriptionPath: "/ws/updateInstance/{instanceId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
  updateProcess: { wildcard: "{processId}", subscriptionPath: "/ws/updateProcess/{processId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
  updateUser: { wildcard: "{userId}", subscriptionPath: "/ws/updateUser/{userId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
  updateWorkspace: { wildcard: "{workspaceId}", subscriptionPath: "/ws/updateWorkspace/{workspaceId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
};

let subscriptionPaths: string[] = [];
let notificationClient: any;

let notificationHandler = (update: any, flags: any) => {
  StateHandler.rootStore.dispatch(update);
};

export async function initNotificationClient(user: UserDetails) {
  let wsUrl = getBackendUrl();
  wsUrl = wsUrl.replace("https://", "wss://");
  wsUrl = wsUrl.replace("http://", "ws://");
  notificationClient = new Nes.Client(wsUrl);
  return new Promise<void>(async (resolve, reject) => {

    // let authResult: any = await getJson("/nes/auth", { auth: user.extras.accessToken });

    // if (authResult.status == "authenticated") {
    await notificationClient.connect({ auth: { headers: { authorization: user.extras.accessToken } } }, (err: any) => {
      if (err != null) {
        console.log("Error on Websocket connect:");
        console.log(err);
        reject();
      }
      resolve();
    });

    notificationClient.onError = () => {
      setTimeout(() => {
        console.info("Site reload because of websocket error.");
        window.location.reload();
      }, 15000);
    };

    notificationClient.onDisconnect = () => {
      // alert("Websocket disconnected!");
      setTimeout(() => {
        console.info("Site reload because of websocket disconnect.");
        window.location.reload();
      }, 15000);
    };
    // } else {
    // reject();
    // }
  });
}

export function subscribe(subscriptionPath: string): boolean {
  notificationClient.subscribe(subscriptionPath, notificationHandler, (err: any) => {
    if (err != null) {
      console.log("Error on subscribe path: " + subscriptionPath);
      console.log(err);
      return false;
    }
  });
  subscriptionPaths.push(subscriptionPath);
  return true;
}

export function subscribeUpdateInstance(instanceId: string): boolean {
  let subPath = PublishSubscriptionObjects.updateInstance.resolvePath(instanceId);
  return subscribe(subPath);
}

export function subscribeNewInstance(userId: string): boolean {
  let subPath = PublishSubscriptionObjects.newInstance.resolvePath(userId);
  return subscribe(subPath);
}

export function subscribeUpdateProcess(processId: string): boolean {
  let subPath = PublishSubscriptionObjects.updateProcess.resolvePath(processId);
  return subscribe(subPath);
}

export function subscribeUpdateUser(userId: string): boolean {
  let subPath = PublishSubscriptionObjects.updateUser.resolvePath(userId);
  return subscribe(subPath);
}

export function subscribeUpdateWorkspace(workspaceId: string): boolean {
  const subPath = PublishSubscriptionObjects.updateWorkspace.resolvePath(workspaceId);
  return subscribe(subPath);
}