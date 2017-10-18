const Nes = require("nes");
import * as StateHandler from "../statehandler";
import { BACKEND_URL } from "../legacyapi";
import { UserDetails } from "../user/userinterfaces";

export interface PublishSubscribeRegisterObject {
  wildcard: string;
  subscriptionPath: string;
  resolvePath: (value: string) => string;
}

export const resolveFunction = (obj: any, value: string): string => {
  return obj.subscriptionPath.replace(obj.wildcard, value);
};

export const PublishSubscriptionObjects: { [Id: string]: PublishSubscribeRegisterObject } = {
  newInstance: { wildcard: "{userId}", subscriptionPath: "/newInstance/{userId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
  updateInstance: { wildcard: "{instanceId}", subscriptionPath: "/updateInstance/{instanceId}", resolvePath: function (value: string) { return resolveFunction(this, value); } },
};

let wsUrl = BACKEND_URL;
wsUrl = wsUrl.replace("https://", "wss://");
wsUrl = wsUrl.replace("http://", "ws://");

let subscriptionPaths: string[] = [];
let notificationClient = new Nes.Client(wsUrl);

let notificationHandler = (update: any, flags: any) => {
  StateHandler.rootStore.dispatch(update);
};

export async function initNotificationClient(user: UserDetails) {
  return new Promise<void>((resolve, reject) => {
    notificationClient.connect((err: any) => {
      if (err != null)
        reject();
      resolve();
    });
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
