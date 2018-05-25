import { GroupDetails } from "./groupinterfaces";

export const GroupRequestRoutes = {
  Create: "/api/group/create",
  Delete: "/api/group/delete",
  Edit: "/api/group/edit",
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