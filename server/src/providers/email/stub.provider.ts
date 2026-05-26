import { EmailProvider, EmailProviderName, SendEmailInput, SendEmailResult } from "../../types/email";
import { logger } from "../../utils/logger";

export class StubEmailProvider implements EmailProvider {
  readonly name: EmailProviderName;

  constructor(name: string) {
    this.name = name as EmailProviderName;
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    logger.warn("email_provider_not_implemented", {
      provider: this.name,
      to: input.to,
      subject: input.subject
    });

    throw new Error(`Email provider ${this.name} is not implemented yet`);
  }
}
