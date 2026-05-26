export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
};

export type RequestContext = {
  requestId: string;
  ip: string;
  userAgent?: string;
};
