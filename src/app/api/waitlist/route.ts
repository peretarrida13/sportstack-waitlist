import { NextRequest, NextResponse } from 'next/server'
import { ensureTable, query } from '@/lib/db'

// In-memory rate limiter: 10 signups per IP per hour
const signupAttempts = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
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
  try {
    const { email, firstName, sportPreference, otherSport } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 })
    }

    await ensureTable()

    // Detect country from Cloudflare/Vercel header
    const country =
      req.headers.get('cf-ipcountry') ??
      req.headers.get('x-vercel-ip-country') ??
      null

    await query(
      `INSERT INTO waitlist_entries (email, first_name, sport, other_sport, country)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        email.toLowerCase().trim(),
        firstName?.trim() || null,
        sportPreference ?? 'FOOTBALL',
        otherSport?.trim() || null,
        country,
      ]
    )

    const [{ count }] = await query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM waitlist_entries'
    )

    return NextResponse.json({ position: parseInt(count, 10) }, { status: 201 })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === '23505') {
      return NextResponse.json({ message: "You're already on the waitlist!" }, { status: 409 })
    }
    console.error('[waitlist]', err)
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }
}
