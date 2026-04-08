import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#07090F' }}
    >
      <p
        className="text-[120px] sm:text-[180px] leading-none font-black mb-0 select-none"
        style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.04)' }}
      >
        404
      </p>

      <div style={{ marginTop: -32 }}>
        <p
          className="text-3xl sm:text-4xl text-white leading-none mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PAGE NOT FOUND
        </p>
        <p className="text-white/35 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          This page doesn&apos;t exist. Head back to the main site.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: 'var(--gold)', color: '#07090F' }}
        >
          ← Back to AthleteShare
        </Link>
      </div>
    </div>
  )
}
