import { NextRequest, NextResponse } from 'next/server'
import { joinWaitlist } from '@/lib/api'

// In-memory rate limiter: 10 signups per IP per hour
const signupAttempts = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const limit = 10
  const timestamps = (signupAttempts.get(ip) ?? []).filter(t => now - t < windowMs)
  if (timestamps.length >= limit) return true
  timestamps.push(now)
  signupAttempts.set(ip, timestamps)
  return false
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const body = await req.json()

  // Inject country from CDN headers — never trust user-supplied value
  const country =
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-vercel-ip-country') ??
    null

  const upstream = await joinWaitlist({ ...body, country })
  const data = await upstream.json()

  if (upstream.status === 409) {
    return NextResponse.json({ message: "You're already on the waitlist!" }, { status: 409 })
  }
  if (!upstream.ok) {
    return NextResponse.json({ message: data.message ?? 'Something went wrong.' }, { status: upstream.status })
  }

  return NextResponse.json({ position: data.position }, { status: 201 })
}
