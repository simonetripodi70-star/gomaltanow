import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";

  const username =
    process.env.AI_WRITER_ADMIN_USERNAME ||
    (isDevelopment ? "simone" : undefined);

  const password =
    process.env.AI_WRITER_ADMIN_PASSWORD ||
    (isDevelopment ? "gomaltanow-local" : undefined);

  if (!username || !password) {
    return new NextResponse(
      "AI Writer admin access is not configured.",
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    try {
      const credentials = atob(authorization.slice(6));
      const separator = credentials.indexOf(":");

      if (
        separator > -1 &&
        credentials.slice(0, separator) === username &&
        credentials.slice(separator + 1) === password
      ) {
        return NextResponse.next();
      }
    } catch {
      // Le credenziali non valide vengono gestite dalla risposta sottostante.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GoMaltaNow AI Writer"',
    },
  });
}

export const config = {
  matcher: ["/admin/ai-writer/:path*", "/api/ai-writer/:path*"],
};