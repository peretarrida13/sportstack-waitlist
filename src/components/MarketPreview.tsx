'use client'

import { useState, useEffect, useRef } from 'react'

interface Athlete {
  name: string
  club: string
  price: number
  change: number
}

const INITIAL: Athlete[] = [
  { name: 'K. Mbappé', club: 'Real Madrid', price: 124.50, change: 8.2 },
  { name: 'E. Haaland', club: 'Man City', price: 118.30, change: 5.1 },
  { name: 'J. Bellingham', club: 'Real Madrid', price: 98.75, change: 12.4 },
  { name: 'LeBron James', club: 'Lakers', price: 145.60, change: 3.7 },
  { name: 'Giannis A.', club: 'Bucks', price: 132.90, change: 4.5 },
]

export default function MarketPreview() {
  const [athletes, setAthletes] = useState(INITIAL)
  const [flashes, setFlashes] = useState<Record<string, 'up' | 'down'>>({})
  const prev = useRef(INITIAL.map((a) => a.price))

  useEffect(() => {
    const id = setInterval(() => {
      setAthletes((cur) =>
        cur.map((a, i) => {
          const delta = (Math.random() - 0.47) * 1.8
          const newPrice = Math.max(10, a.price + delta)
          const newChange = a.change + (Math.random() - 0.5) * 0.15
          const dir = newPrice > prev.current[i] ? 'up' : 'down'
          prev.current[i] = newPrice
          setFlashes((f) => ({ ...f, [a.name]: dir }))
          setTimeout(() => setFlashes((f) => { const n = { ...f }; delete n[a.name]; return n }), 600)
          return { ...a, price: newPrice, change: newChange }
        })
      )
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
      {/* Header */}
      <div className="grid grid-cols-4 px-5 py-3 text-xs text-slate-500 font-medium" style={{ borderBottom: '1px solid var(--border)' }}>
        <span>Athlete</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h</span>
        <span className="text-right">Action</span>
      </div>

      {athletes.map((a) => {
        const pos = a.change >= 0
        const flash = flashes[a.name]
        return (
          <div
            key={a.name}
            className="grid grid-cols-4 items-center px-5 py-3.5 transition-colors"
            style={{ borderBottom: '1px solid var(--border)', background: flash ? (flash === 'up' ? 'rgba(74,222,128,0.03)' : 'rgba(248,113,113,0.03)') : 'transparent' }}
          >
            <div>
              <div className="text-sm text-white font-medium">{a.name}</div>
              <div className="text-xs text-slate-600 mt-0.5">{a.club}</div>
            </div>
            <div
              className={`text-right font-mono text-sm transition-colors duration-300 ${
                flash === 'up' ? 'flash-up text-emerald-400' : flash === 'down' ? 'flash-down text-red-400' : 'text-slate-300'
              }`}
            >
              €{a.price.toFixed(2)}
            </div>
            <div className={`text-right text-xs font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
              {pos ? '+' : ''}{a.change.toFixed(1)}%
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 border border-slate-700 rounded px-2.5 py-1 cursor-not-allowed opacity-60">
                Coming soon
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
