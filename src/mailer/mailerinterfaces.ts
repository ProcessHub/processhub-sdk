import * as PH from "../";

export interface MessageNotificationMailContent {
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