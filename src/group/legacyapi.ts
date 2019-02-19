import { GroupDetails } from "./groupinterfaces";

export const GroupRequestRoutes = {
  Create: "/api/group/create",
  Delete: "/api/group/delete",
  Edit: "/api/group/edit",
  SetMembers: "/api/group/setmembers",
  AddMember: "/api/group/addmember",
  RemoveMember: "/api/group/removemember",
};

export type GroupRequestRoutes = keyof typeof GroupRequestRoutes;

export interface CreateGroupRequest {
  group: GroupDetails;
}

export interface DeleteGroupRequest {
  groupId: string;
}

export interface EditGroupRequest {
  groupId: string;
  displayName: string;
  description: string;
}

export interface SetGroupMembersRequest {
  groupId: string;
  memberIds: string[];
}

export interface AddMemberToGroupRequest {
  groupId: string;
  memberId: string;
}

export interface RemoveMemberFromGroupRequest {
  groupId: string;
  memberId: string;
}
