'use client'

import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-4 text-left text-sm text-slate-300 hover:text-white transition-colors gap-4"
      >
        <span>{question}</span>
        <span
          className="text-slate-500 flex-shrink-0 text-lg leading-none mt-0.5"
          style={{ transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s ease' }}
        >
          +
        </span>
      </button>
      <div style={{ maxHeight: open ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
        <p className="text-sm text-slate-500 pb-4 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  )
}
