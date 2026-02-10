import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

// Clean stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap) {
        if (now > data.resetAt) ipRequestMap.delete(ip);
    }
}, 300_000);

export function middleware(request: NextRequest) {
    // Only rate-limit API routes
    if (!request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    const now = Date.now();
    const entry = ipRequestMap.get(ip);

    if (!entry || now > entry.resetAt) {
        ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return NextResponse.next();
    }

    entry.count++;

    if (entry.count > MAX_REQUESTS_PER_WINDOW) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
            {
                error: `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`,
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(retryAfter),
                    "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
                    "X-RateLimit-Remaining": "0",
                },
            }
        );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_WINDOW));
    response.headers.set(
        "X-RateLimit-Remaining",
        String(MAX_REQUESTS_PER_WINDOW - entry.count)
    );
    return response;
}

export const config = {
    matcher: "/api/:path*",
};
