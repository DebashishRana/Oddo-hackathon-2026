import { Request, Response } from "express";
import { ok } from "../utils/apiResponse";
import { parseEmailInput, parseVerifyOtpInput } from "../validators/auth.validator";
import { authService } from "../services/auth.service";

const genericOtpMessage = "If the request is valid, a verification code will be sent.";

export class AuthController {
  async sendOtp(req: Request, res: Response) {
    const { email } = parseEmailInput(req.body);
    await authService.sendOtp(email, req.context);
    return ok(res, genericOtpMessage);
  }

  async resendOtp(req: Request, res: Response) {
    const { email } = parseEmailInput(req.body);
    await authService.resendOtp(email, req.context);
    return ok(res, genericOtpMessage);
  }

  async verifyOtp(req: Request, res: Response) {
    const { email, otp } = parseVerifyOtpInput(req.body);
    const session = await authService.verifyOtp(email, otp, req.context);
    return ok(res, "Email verified successfully.", session);
  }
}

export const authController = new AuthController();
