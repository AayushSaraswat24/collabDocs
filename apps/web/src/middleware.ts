import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value

  const { pathname } = req.nextUrl

    const isPublic = pathname === "/" || pathname === "/signin"

  if (!sessionToken && !isPublic) {

    const signInUrl = new URL("/signin", req.url)

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
 matcher: ["/docs", "/docs/:path*"]
}