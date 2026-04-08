'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setError('Wrong password.'); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h1
          className="text-2xl font-bold mb-1 text-gradient"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Admin
        </h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
          AthleteShare waitlist dashboard
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none"
            style={{ background: '#07090F', border: '1px solid var(--border)' }}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="shimmer-btn w-full py-2.5 rounded-lg text-sm font-semibold text-[#07090F] disabled:opacity-50"
          >
            {loading ? '...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
