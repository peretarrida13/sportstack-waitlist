import { NextRequest, NextResponse } from 'next/server'
import { checkPassword, makeToken, COOKIE } from '@/lib/auth'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

// In-memory rate limiter: 5 attempts per minute per IP
const attempts = new Map<string, number[]>()

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60_000
  const maxAttempts = 5
  const timestamps = (attempts.get(ip) ?? []).filter(t => now - t < windowMs)
  if (timestamps.length >= maxAttempts) return true
  timestamps.push(now)
  attempts.set(ip, timestamps)
  return false
}

// Periodic cleanup to prevent unbounded memory growth (runs on each request)
function cleanupStale() {
  const now = Date.now()
  for (const [ip, timestamps] of attempts.entries()) {
    const fresh = timestamps.filter(t => now - t < 60_000)
    if (fresh.length === 0) attempts.delete(ip)
    else attempts.set(ip, fresh)
  }
}

export async function POST(req: NextRequest) {
  cleanupStale()
  const ip = getIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const { password } = await req.json()
  if (!checkPassword(password)) {
    return NextResponse.json({ message: 'Wrong password.' }, { status: 401 })
  }
  const token = await makeToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, COOKIE_OPTS)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '', { ...COOKIE_OPTS, maxAge: 0 })
  return res
}
