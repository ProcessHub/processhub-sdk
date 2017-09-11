// Internal objects used by ProcessHub client and server
import { Page } from "../path";
import { Tools } from "../";
import * as PH from "../";

export class InstanceState {
  currentInstance?: PH.Instance.InstanceDetails;

  // Instance Cache
  instance: {
    [instanceId: string]: PH.Instance.InstanceDetails
  };  
}
