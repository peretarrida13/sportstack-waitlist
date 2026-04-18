const API_URL = process.env.API_URL
const API_KEY = process.env.API_KEY

if (!API_URL) throw new Error('API_URL environment variable is not set')
if (!API_KEY) throw new Error('API_KEY environment variable is not set')

function apiHeaders(extra?: Record<string, string>): Record<string, string> {
  return { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY!, ...extra }
}

export interface AdminStats {
  total: number
  sports: { sport: string; count: number }[]
  countries: { country: string; count: number }[]
  daily: { day: string; count: number }[]
  recent: {
    email: string
    firstName: string | null
    sport: string
    country: string | null
    createdAt: string
  }[]
  otherSports: { otherSport: string; count: number }[]
}

export async function joinWaitlist(body: object): Promise<Response> {
  return fetch(`${API_URL}/api/v1/waitlist`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(body),
  })
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_URL}/api/v1/admin/stats`, {
    headers: apiHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)')
    throw new Error(`Admin stats failed: ${res.status} ${res.statusText} — ${body}`)
  }
  return res.json()
}
