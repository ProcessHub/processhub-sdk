import { FieldContentMap } from "../data/datainterfaces";
import { BaseRequest, BaseReply } from "../legacyapi/apiinterfaces";

export enum MailSender {
  FromProcessHub,   // noreply@processhub.com
  FromInstance,     // use the mail address of the current instance as reply-to   
}

export interface MailContent {
  recipientId?: string;
  signature?: string;
}

export interface MessageNotificationMailContent extends MailContent {
  sender?: MailSender;
  instanceUrl?: string;  
  todoTitle?: string;
  todoDescription?: string;
  fieldContents?: FieldContentMap;
  subject: string;
}

export interface SendMailTemplateRequest extends MessageNotificationMailContent, BaseRequest {
  receiverIdOrMails: string[];
  instanceId?: string;
}

export interface SendMailTemplateReply extends BaseReply {
  errorMessage?: string;
}

export interface ReplyToMailRequest extends MessageNotificationMailContent, BaseRequest {
  choosenFieldContents: string[];
  receiverMails: string[];
  addReceiverAsFollower: boolean;
  mailText: string;
  instanceId: string;  
}

export interface ReplyToMailReply extends BaseReply {
  errorMessage?: string;
}