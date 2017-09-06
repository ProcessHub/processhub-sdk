import * as PH from "../";

export enum InstanceAccessRights {
  None = 0,
  CanSeeInstance = 1 << 0,
  CanManageInstance = 1 << 1,
}

export function canManageInstance(instance: PH.Instance.InstanceDetails): boolean {
  if (instance == null)
    return false;

  return ((instance.userRights & InstanceAccessRights.CanManageInstance) != 0);
}
export function canSeeInstance(instance: PH.Instance.InstanceDetails): boolean {
    if (instance == null)
      return false;
  
    return ((instance.userRights & InstanceAccessRights.CanSeeInstance) != 0);
  }
