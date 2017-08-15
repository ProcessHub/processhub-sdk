import * as PH from "../";

export interface MessageNotificationMailContent {
  todoLink: string;  
  todoTitle: string;
  todoDescription: string;
  fieldContents: PH.Data.FieldContentMap;
}

export interface SendMailTemplateRequest extends MessageNotificationMailContent, PH.LegacyApi.BaseRequest {
  receiverMails: string[];
}

export interface SendMailTemplateReply extends PH.LegacyApi.BaseReply {
  errorMessage?: string;
}