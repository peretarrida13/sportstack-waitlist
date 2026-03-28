import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AthleteShare — Trade Athlete Shares'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#050D18',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}
    >
      <div style={{ color: '#D4A017', fontSize: 80, fontWeight: 'bold', letterSpacing: '-3px' }}>
        ATHLETESHARE
      </div>
      <div style={{ color: '#FFFFFF', fontSize: 34, marginTop: 24 }}>
        Trade Athlete Shares
      </div>
      <div style={{ color: '#94A3B8', fontSize: 22, marginTop: 16 }}>
        EU Regulated · Performance-Driven Prices · Free Beta Q4 2026
      </div>
      <div
        style={{
          marginTop: 48,
          padding: '12px 32px',
          background: '#D4A017',
          color: '#050D18',
          borderRadius: 8,
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        athleteshare.app
      </div>
    </div>
  )
}
