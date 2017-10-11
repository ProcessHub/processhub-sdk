import * as PH from "../";

export enum MailSender {
  FromProcessHub,   // noreply@processhub.com
  FromRoleOwner     // use the mail address of the current RoleOwner as ReplyTo-destination     
}

export interface MailContent {
  recipientId?: string;
  signature?: string;
}

export interface MessageNotificationMailContent extends MailContent {
  sender?: MailSender;
  instanceUrl?: string;  
  todoTitle: string;
  todoDescription: string;
  fieldContents?: PH.Data.FieldContentMap;
  subject: string;
}

export interface SendMailTemplateRequest extends MessageNotificationMailContent, PH.LegacyApi.BaseRequest {
  receiverIdOrMails: string[];
}

export interface SendMailTemplateReply extends PH.LegacyApi.BaseReply {
  errorMessage?: string;
}