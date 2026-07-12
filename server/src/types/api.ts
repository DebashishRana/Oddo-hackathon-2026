export type ApiError = {
  code: string;
  details?: unknown;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
};
