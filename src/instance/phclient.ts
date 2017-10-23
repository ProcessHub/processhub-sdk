// Internal objects used by ProcessHub client and server
import { Page } from "../path";
import { Tools } from "../";
import { InstanceDetails } from "./instanceinterfaces";

export class InstanceState {
  currentInstance?: InstanceDetails;

  // Instance Cache
  instanceCache: {
    [instanceId: string]: InstanceDetails
  };  

  cacheState?: string;  // updated in reducers, helps React to detect state changes
  lastDispatchedInstance: InstanceDetails; // used in reducer to detect changes
}
