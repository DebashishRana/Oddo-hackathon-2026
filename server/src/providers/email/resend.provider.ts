import { Resend } from "resend";
import { env } from "../../config/env";
import { EmailProvider, SendEmailInput, SendEmailResult } from "../../types/email";

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend" as const;
  private readonly client: Resend;

  constructor() {
    if (!env.resendApiKey) {
      throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");
    }
    this.client = new Resend(env.resendApiKey);
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const result = await this.client.emails.send({
      from: env.mailFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      tags: input.tags
        ? Object.entries(input.tags).map(([name, value]) => ({ name, value }))
        : undefined
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return {
      provider: this.name,
      messageId: result.data?.id
    };
  }
}
