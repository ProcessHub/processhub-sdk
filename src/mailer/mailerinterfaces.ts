import * as PH from "../";

export enum MailSender {
  FromProcessHub,   // noreply@processhub.com
  FromRoleOwner     // use the mail address of the current RoleOwner as ReplyTo-destination     
}

export interface MailContent {
  signature?: string;
}

export interface MessageNotificationMailContent extends MailContent {
  sender?: MailSender;
  todoLink: string;  
  todoTitle: string;
  todoDescription: string;
  fieldContents: PH.Data.FieldContentMap;
  subject: string;
  sendInstanceLink: boolean;
  sendFieldContents: boolean;
}

export interface SendMailTemplateRequest extends MessageNotificationMailContent, PH.LegacyApi.BaseRequest {
  receiverIdOrMails: string[];
}

export interface SendMailTemplateReply extends PH.LegacyApi.BaseReply {
  errorMessage?: string;
}