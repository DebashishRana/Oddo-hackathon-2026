export type EmailProviderName = "resend" | "postal" | "sendgrid" | "ses";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: Record<string, string>;
};

export type SendEmailResult = {
  provider: EmailProviderName;
  messageId?: string;
};

export interface EmailProvider {
  readonly name: EmailProviderName;
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
