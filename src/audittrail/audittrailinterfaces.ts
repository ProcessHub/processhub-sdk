import { UserDetails } from "../user/userinterfaces";

export enum AuditTrailAction {
  instanceStarted = 1,
  completedTodo = 2,
  comment = 3,
  incomingMail = 4,
  jumpPerformed = 5,
  outgoingMail = 6,
  instanceStartedByTimer = 7,
  messageBoundaryEventTriggered = 8,
  bouncedMail = 9,
  errorSubprocess = 10,
  processCreated = 11,
  processEdited = 12,
  processComment = 13,
}

export interface AuditTrailEntryDetails {
  // must be set for AuditTrailAction.completedTodo
  todoDisplayName: string;
  // must be set for AuditTrailAction.comment and processComment
  comment: string;
  // may be set for AuditTrailAction.comment, if the comment has attachments - links to all attachment files
  commentAttachments: string[];

  // must be set for AuditTrailAction.incomingMail
  mailText: string;
  mailSubject: string;
  // may be set for AuditTrailAction.incomingMail, if there was html content in the email - link to the HTML document. undefined if there was no HTML content.  
  mailHtmlLink: string;
  // may be set for AuditTrailAction.incomingMail, if there were attachments in the mail - links to all attachment files. Empty array if there were no attachments.
  mailAttachments: string[];
  // may be set for AuditTrailAction.outgoingMail
  mailReceiverList: string[];
  // must be set for AuditTrailAction.jumpPerformed
  jumpFromTodoDisplayName: string;
  jumpToTodoDisplayName: string;

  // must be set for AuditTrailAction.bouncedMail
  bouncedAddresses: string[];
  bouncedSubject: string;

  // must be set for AuditTrailAction.processCreated, processEdited and processComment
  processDisplayName: string;
}

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface AuditTrailEntry { 
  trailId: string;
  workspaceId: string;
  processId?: string;  // may be null for entries on workspace-level
  instanceId?: string;  // may be null for entries on workspace- or process-level
  action: AuditTrailAction;
  user: UserDetails;
  createdAt: Date;  // time of action in UTC
  details: Partial<AuditTrailEntryDetails>;
}