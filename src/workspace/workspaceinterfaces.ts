import { ProcessDetails, gqlProcessFragments } from "../process/processinterfaces";
import { UserDetails } from "../user/userinterfaces";
import gql from "graphql-tag";
import { tl } from "../tl";

// WorkspaceType
export enum WorkspaceType {
  Free = 100,
  Demo = 120, // Demo has some features that Free does not have, e.g. graphical modeler
  Team = 200,
  Business = 300,
  Templates = 310, // used internally for templates. Processes in this workspace are always public
  Enterprise = 400
}
export function getWorkspaceTypeName(workspaceType: WorkspaceType): string {
  switch (workspaceType) {
    case WorkspaceType.Demo:
      return tl("Demo");
    case WorkspaceType.Free:
      return tl("Free");      
    case WorkspaceType.Team:
      return tl("Team");
    case WorkspaceType.Business:
      return tl("Business");
    case WorkspaceType.Enterprise:
      return tl("Enterprise");
    default:
      return workspaceType.toString();            
  }
}

export interface WorkspaceDetails {
  // Changes must also be reflected in gqlTypes and gqlFragments below!

  workspaceId: string;
  workspaceType: WorkspaceType;
  urlName?: string; // displayName converted to Uri segment
  fullUrl?: string; // @urlname
  displayName: string;
  description?: string;
  userRole?: WorkspaceRole;  // Rolle des angemeldeten Users im Workspace  
  trialExpiresAt?: Date;
  extras: {
    // New Extras must be added to cache-handling in workspaceactions -> loadWorkspace!
    members?: WorkspaceMember[];
    processes?: ProcessDetails[];  // Nur Prozesse, auf die der angemeldete User Zugriff hat
    settings?: WorkspaceSettings;
  };
}
export const gqlWorkspaceTypes = `     
  type WorkspaceDetails {
    workspaceId: String!
    workspaceType: String
    urlName: String
    fullUrl: String
    displayName: String
    description: String
    userRole: Int
    extras: ExtrasWorkspace
  }
  type ExtrasWorkspace {
    members: [WorkspaceMember]
    processes: [ProcessDetails]
  }

  scalar WorkspaceMember
`;

export const gqlWorkspaceFragments = gql`
  fragment WorkspaceDetailsFields on WorkspaceDetails {
    workspaceId
    workspaceType
    urlName
    fullUrl
    displayName
    description
    userRole
  }
`;
export const gqlQueryWorkspace = gql`
  query queryWorkspace($workspaceId: ID, $urlName: String) {
    workspace(workspaceId: $workspaceId, urlName: $urlName) {
      ...WorkspaceDetailsFields
      extras {
        processes {
          ...ProcessDetailsFields
        }
      }
    }
  }
  ${gqlWorkspaceFragments}  
  ${gqlProcessFragments}
`;

export enum WorkspaceExtras {
  None = 0,
  ExtrasMembers = 1 << 0,
  ExtrasProcesses = 1 << 1,
  ExtrasSettings = 1 << 2
}

export interface WorkspaceSettings {
  mailSignature?: string;
}

export enum WorkspaceRole {
  None = 0, // used to list todos from workspaces where user is not a member
  WorkspaceAdmin = 1 << 0,
  WorkspaceProcessManager = 1 << 1,
  WorkspaceMember = 1 << 2, // regular member
}

export interface WorkspaceMember {
  userDetails: UserDetails;
  memberRole: WorkspaceRole;
}
