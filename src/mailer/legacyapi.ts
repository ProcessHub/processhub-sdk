import { BaseRequest, BaseMessage, ApiResult } from "../legacyapi/apiinterfaces";

export const MailerRequestRoutes = {
  SendMailTemplate: "/api/mailer/send-mail-template"
};
export type MailerRequestRoutes = keyof typeof MailerRequestRoutes;

// Reply: ApiReply
export interface SendMailTemplateRerquestRequest extends BaseRequest {
  
}

export const MAILERSENT_MESSAGE = "MailerSentMessage";
export interface MailerSentMessage extends BaseMessage {
  type: "MailerSentMessage";
  error?: ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

