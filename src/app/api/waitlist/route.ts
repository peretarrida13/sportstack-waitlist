import { NextRequest, NextResponse } from 'next/server'
import { ensureTable, query } from '@/lib/db'

export async function POST(req: NextRequest) {
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
