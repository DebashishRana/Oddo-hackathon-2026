export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path: string, init: RequestInit = {}) {
  // Prefer same-origin /api/* proxy so session cookies stay on the Next.js host.
  const url = path.startsWith("http")
    ? path
    : path.startsWith("/")
      ? path
      : `/${path}`;

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  return response;
}

export async function apiJson<T = unknown>(path: string, init: RequestInit = {}) {
  const response = await apiFetch(path, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || payload?.error?.message || "Request failed");
  }
  return payload as { success: boolean; message: string; data: T };
}
