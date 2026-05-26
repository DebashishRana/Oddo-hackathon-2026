import { EmailProvider } from "../../types/email";
import { env } from "../../config/env";
import { ResendEmailProvider } from "./resend.provider";
import { StubEmailProvider } from "./stub.provider";

export const createEmailProvider = (): EmailProvider => {
  if (env.emailProvider === "resend") {
    return new ResendEmailProvider();
  }

  return new StubEmailProvider(env.emailProvider);
};
