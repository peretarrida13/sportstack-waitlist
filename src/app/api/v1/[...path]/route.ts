import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL!
const API_KEY = process.env.API_KEY!

// In-memory rate limiter for waitlist signups: 10 per IP per hour
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

const BLOCKED_PREFIXES = ['/api/v1/admin']

function isBlocked(path: string): boolean {
  return BLOCKED_PREFIXES.some(prefix => path.startsWith(prefix))
}

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const upstreamPath = '/api/v1/' + path.join('/')

  if (isBlocked(upstreamPath)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // Rate-limit POST /api/v1/waitlist
  if (req.method === 'POST' && upstreamPath === '/api/v1/waitlist') {
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 })
    }
  }

  // Forward query string
  const url = new URL(req.url)
  const upstream = new URL(upstreamPath + url.search, API_URL)

  // Build headers — inject API key, strip hop-by-hop headers
  const forwardHeaders = new Headers()
  forwardHeaders.set('X-Api-Key', API_KEY)
  forwardHeaders.set('X-Forwarded-For', ip)

  const contentType = req.headers.get('content-type')
  if (contentType) forwardHeaders.set('Content-Type', contentType)

  let body: BodyInit | undefined
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const raw = await req.text()

    // For waitlist signups: inject country from CDN geo headers (never trust client)
    if (upstreamPath === '/api/v1/waitlist' && req.method === 'POST' && raw) {
      try {
        const parsed = JSON.parse(raw)
        const country =
          req.headers.get('cf-ipcountry') ??
          req.headers.get('x-vercel-ip-country') ??
          null
        body = JSON.stringify({ ...parsed, country })
      } catch {
        body = raw
      }
    } else {
      body = raw
    }
  }

  const res = await fetch(upstream.toString(), {
    method: req.method,
    headers: forwardHeaders,
    body,
  })

  const responseBody = await res.text()
  return new NextResponse(responseBody, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
