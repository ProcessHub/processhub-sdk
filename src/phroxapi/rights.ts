import { UserDetails } from "../user";

function hasRequestedRight(right: string, user: UserDetails): boolean {
  const { roXtra } = user.extras;
  if (roXtra.extendedRights) {
    for (const extendedRight of roXtra.extendedRights) {
      if (extendedRight.Key === right) {
        return true;
      }
    }
  }
  return false;
}

// ProcessHub Bearbeiter
export function hasP3Right(user: UserDetails): boolean {
  return hasRequestedRight("P3", user);
}

export function hasZ1Right(user: UserDetails): boolean {
  return hasRequestedRight("Z1", user);
}

// admin
export function hasU9Right(user: UserDetails): boolean {
  return hasRequestedRight("U9", user);
}

export function hasD0Right(user: UserDetails): boolean {
  return hasRequestedRight("D0", user);
}