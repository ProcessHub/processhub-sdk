import { FieldContentMap } from "../data/datainterfaces";
import { BaseRequest, BaseReply } from "../legacyapi/apiinterfaces";
import { InstanceDetails } from "../instance/instanceinterfaces";
import { BpmnProcess } from "../process";

export enum MailSender {
  FromProcessHub,   // noreply@mail.processhub.com
  FromInstance,     // use the mail address of the current instance as reply-to   
}

export interface MailContent {
  recipientId?: string;
  signature?: string;
}

export interface SendMailTemplateRequest extends BaseRequest {
  instanceUrl?: string;  
  todoDescription?: string;
  todoTitle?: string;
  fieldContents?: FieldContentMap;
  receiverIdOrMails: string[];
  sender?: MailSender;
  instanceId?: string;
  signature?: string;
  subject: string;
  instance: InstanceDetails;
}

export interface SendMailTemplateReply extends BaseReply {
  errorMessage?: string;
}

export interface ReplyToMailRequest extends BaseRequest {
  sender?: MailSender;
  instanceUrl?: string;  
  choosenFieldContents: string[];
  subject: string;
  receiverMails: string[];
  addReceiverAsFollower: boolean;
  mailText: string;
  instanceId: string;  
  instance: InstanceDetails;
}

export interface ReplyToMailReply extends BaseReply {
  errorMessage?: string;
}