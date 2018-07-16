import { UserDetails } from "../user";

export interface GroupDetails {
  groupId: string;
  workspaceId?: string;
  displayName: string;
  description: string;
  members: UserDetails[];
}