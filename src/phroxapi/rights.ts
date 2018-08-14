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
export function hasF3Right(user: UserDetails): boolean {
  // TODO remove P3, right was renamed to F3
  return hasRequestedRight("P3", user) || hasRequestedRight("F3", user);
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