import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export const runtime = "nodejs";

const proxyApiRequest = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");

  try {
    const targetUrl = new URL(`/api/${path}${request.nextUrl.search}`, API_BASE_URL);
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");

    const hasBody = !["GET", "HEAD"].includes(request.method);
    const body = hasBody ? Buffer.from(await request.arrayBuffer()) : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const proxiedResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        return;
      }
      proxiedResponse.headers.set(key, value);
    });

    const setCookieHeaders = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
    for (const cookie of setCookieHeaders) {
      proxiedResponse.headers.append("set-cookie", cookie);
    }

    return proxiedResponse;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "API service is unavailable. Check that the backend server is running.",
      },
      { status: 502 }
    );
  }
};

export const GET = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const DELETE = proxyApiRequest;
