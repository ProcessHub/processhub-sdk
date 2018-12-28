import { UserDetails } from "../user/userinterfaces";
import { FieldValue } from "../data/datainterfaces";

export enum AuditTrailAction {
  instanceStarted = 1, // deprecated - startEvent is logged for new instances
  completedTodo = 2,
  comment = 3,
  incomingMail = 4,
  jumpPerformed = 5,
  outgoingMail = 6,
  instanceStartedByTimer = 7, // deprecated - startEvent is logged for new instances
  messageBoundaryEventTriggered = 8,
  bouncedMail = 9,
  errorSubprocess = 10,
  processCreated = 11,
  processEdited = 12,
  processComment = 13,
  processDeleted = 14,
  errorOnEvaluateGatewayDecision = 15,
  processDisplayNameChanged = 16,
  processDescriptionChanged = 17,
  processVisibilityChanged = 18,
  processTagsChanged = 19,
  processXmlChanged = 20,
  processRolesChanged = 21,
  retentionPeriodChanged = 22,
  instanceRoleChanged = 23,
  todoDueAtDateChanged = 24,
  fieldContentChanged = 25,
  startEvent = 26,
  endEvent = 27,
  sendTask = 28,
  setFieldForSubProcess = 29,
  setFieldForParentProcess = 30,
  decision = 31,

  workspaceCreated = 100,
}

export enum AuditTrailProcessFlag {
  Subprocess = 1,
  Parentprocess = 2
}

export interface AuditTrailEntryDetails {
  // must be set for completedTodo, todoDueAtDateChanged, decision, errorSubProcees, errorOnEvaluateGatewayDecision, sendTask
  todoDisplayName: string;
  // must be set for AuditTrailAction.comment and processComment
  comment: string;
  // may be set for AuditTrailAction.comment, if the comment has attachments - links to all attachment files
  commentAttachments: string[];

  // must be set for AuditTrailAction.incomingMail
  mailText: string;
  // must be set for AuditTrailAction.incomingMail, sendTask
  mailSubject: string;
  // may be set for AuditTrailAction.incomingMail, if there was html content in the email - link to the HTML document. undefined if there was no HTML content.  
  mailHtmlLink: string;
  // may be set for AuditTrailAction.incomingMail, if there were attachments in the mail - links to all attachment files. Empty array if there were no attachments.
  mailAttachments: string[];
  // may be set for AuditTrailAction.outgoingMail and sendTask
  mailReceiverList: string[];
  // must be set for AuditTrailAction.jumpPerformed
  jumpFromTodoDisplayName: string;
  jumpToTodoDisplayName: string;

  // must be set for AuditTrailAction.bouncedMail
  bouncedAddresses: string[];
  bouncedSubject: string;

  // must be set for AuditTrailAction.processCreated, processEdited, processComment and processDeleted
  processDisplayName: string;

  // must be set for AuditTrailAction.retentionPeriodChanged
  oldValue: string;
  newValue: string;

  // must be set for workspaceCreated
  workspaceDisplayName: string;

  // must be set for instanceRoleChanged
  roleName: string;

  // must be set for todoDueAtDateChanged
  todoDueAt: Date;

  // must be set for fieldContentChanged, setFieldForSubProcess, setFieldForParentProcess
  fieldName: string;
  newFieldValue: FieldValue;

  // must be set for startEvent and endEvent
  eventId: string;
  eventName: string;

  // must be set for startEvent
  startEventType: "TimerStartEvent" | "MessageStartEvent" | "StartEvent";

  // must be set for sendTask
  htmlMailContent: string;

  // must be set for decision
  choosenTaskName: string;

  instanceName?: string;

  // can be set for processXmlChanged if there is an old bpmn file
  oldXmlFile: string;
  // can be set for processXmlChanged if there is an old preview file
  oldPreviewFile: string;

  // must be set for instanceRoleChanged
  newRoleOwnerDisplayNames: string[];
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
  entryFrom?: AuditTrailProcessFlag;
  details: Partial<AuditTrailEntryDetails>;
}