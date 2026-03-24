'use client'

import { useState, useEffect, useRef } from 'react'

interface AthleteCardProps {
  name: string
  club: string
  league: string
  initialPrice: number
  initialChange: number
}

export default function AthleteCard({ name, club, league, initialPrice, initialChange }: AthleteCardProps) {
  const [price, setPrice] = useState(initialPrice)
  const [change, setChange] = useState(initialChange)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prev = useRef(initialPrice)

  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.48) * 2
      const next = Math.max(10, prev.current + delta)
      setFlash(next > prev.current ? 'up' : 'down')
      setTimeout(() => setFlash(null), 500)
      prev.current = next
      setPrice(next)
      setChange((c) => c + (Math.random() - 0.5) * 0.2)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const positive = change >= 0

  return (
    <div className="card p-4">
      <div className="text-xs text-slate-500 mb-3 truncate">{name}</div>
      <div
        className={`text-lg font-semibold font-mono mb-1 transition-colors duration-300 ${
          flash === 'up' ? 'price-up text-emerald-400' : flash === 'down' ? 'price-down text-red-400' : 'text-white'
        }`}
      >
        €{price.toFixed(2)}
      </div>
      <div className={`text-xs ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
        {positive ? '+' : ''}{change.toFixed(1)}%
      </div>
      <div className="mt-3 text-xs text-slate-600 truncate">{club} · {league}</div>
    </div>
  )
}
