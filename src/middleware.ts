import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE } from './lib/auth'

export const config = { matcher: ['/admin/:path*'] }

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'",
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value)
  }
  return res
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow the login page through
  if (pathname === '/admin/login') {
    return applySecurityHeaders(NextResponse.next())
  }

  const token = req.cookies.get(COOKIE)?.value
  if (token && (await verifyToken(token))) {
    return applySecurityHeaders(NextResponse.next())
  }

  const login = req.nextUrl.clone()
  login.pathname = '/admin/login'
  return NextResponse.redirect(login)
}
