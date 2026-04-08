if (!process.env.ADMIN_SECRET || process.env.ADMIN_SECRET.length < 32) {
  throw new Error('ADMIN_SECRET env var must be set and at least 32 characters long')
}
if (!process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD env var must be set')
}

const SECRET = process.env.ADMIN_SECRET
const PASSWORD = process.env.ADMIN_PASSWORD
const COOKIE = 'as_admin'
const TTL = 60 * 60 * 24 * 7 // 7 days in seconds

async function hmac(msg: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function makeToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TTL
  const payload = `${exp}`
  const sig = await hmac(payload)
  return `${payload}.${sig}`
}

export async function verifyToken(token: string): Promise<boolean> {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const exp = parseInt(payload, 10)
  if (isNaN(exp) || Date.now() / 1000 > exp) return false
  const expected = await hmac(payload)
  // Timing-safe comparison
  if (expected.length !== sig.length) return false
  const expectedBytes = new TextEncoder().encode(expected)
  const sigBytes = new TextEncoder().encode(sig)
  let mismatch = 0
  for (let i = 0; i < expectedBytes.length; i++) {
    mismatch |= expectedBytes[i] ^ (sigBytes[i] ?? 0)
  }
  return mismatch === 0
}

export function checkPassword(input: string): boolean {
  // Timing-safe comparison to prevent timing attacks
  const inputBytes = new TextEncoder().encode(input)
  const expectedBytes = new TextEncoder().encode(PASSWORD)
  if (inputBytes.length !== expectedBytes.length) {
    // Still do a dummy comparison to avoid length-based timing leak
    let dummy = 0
    for (let i = 0; i < expectedBytes.length; i++) {
      dummy |= expectedBytes[i] ^ (expectedBytes[i] ?? 0)
    }
    return false
  }
  let mismatch = 0
  for (let i = 0; i < inputBytes.length; i++) {
    mismatch |= inputBytes[i] ^ expectedBytes[i]
  }
  return mismatch === 0
}

export { COOKIE }
