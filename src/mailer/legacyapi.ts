import { BaseRequest, BaseMessage, ApiResult } from "../legacyapi/apiinterfaces";

export const MailerRequestRoutes = {
  SendMailTemplate: "/api/mailer/send-mail-template",
  ReplyToMail: "/api/mailer/send-reply-to-mail"
};
export type MailerRequestRoutes = keyof typeof MailerRequestRoutes;

export const MAILERSENT_MESSAGE = "MailerSentMessage";
export interface MailerSentMessage extends BaseMessage {
  type: "MailerSentMessage";
  error?: ApiResult;  // Nur gesetzt, falls Seitenaufruf gescheitert
}

