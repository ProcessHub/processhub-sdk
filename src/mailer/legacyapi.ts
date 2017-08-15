import * as PH from "../";

export const MailerRequestRoutes = {
  SendMailTemplate: "/api/mailer/send-mail-template"
};
export type MailerRequestRoutes = keyof typeof MailerRequestRoutes;

// Reply: ApiReply
export interface SendMailTemplateRerquestRequest extends PH.LegacyApi.BaseRequest {
  
}

export const MAILERSENT_MESSAGE = "MailerSentMessage";
export interface MailerSentMessage extends PH.LegacyApi.BaseMessage {
  type: "MailerSentMessage";
  error?: PH.LegacyApi.ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

