'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={logout}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.5)' }}
    >
      Sign out
    </button>
  )
}
