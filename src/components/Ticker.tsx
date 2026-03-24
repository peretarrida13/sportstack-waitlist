'use client'

const ITEMS = [
  { name: 'K. Mbappé', change: '+4.2%', up: true },
  { name: 'E. Haaland', change: '+6.1%', up: true },
  { name: 'V. Jr.', change: '-1.3%', up: false },
  { name: 'Pedri', change: '+2.8%', up: true },
  { name: 'L. Messi', change: '+1.5%', up: true },
  { name: 'S. Curry', change: '+3.4%', up: true },
  { name: 'R. Lewandowski', change: '-0.9%', up: false },
  { name: 'L. Yamal', change: '+5.3%', up: true },
  { name: 'L. James', change: '-1.8%', up: false },
  { name: 'P. Foden', change: '+3.7%', up: true },
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-name">{item.name}</span>
            <span className={item.up ? 'ticker-up' : 'ticker-down'}>{item.change}</span>
            <span className="ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
