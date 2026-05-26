export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly code = "APP_ERROR",
    public readonly safeMessage = "Unable to process request"
  ) {
    super(message);
  }
}
