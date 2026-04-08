import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AthleteShare — Trade Athlete Shares | EU Regulated',
  description:
    'Buy and sell virtual shares in footballers and basketball players. Prices move with real match performance. EU-regulated, free beta launching Q4 2026. Join the waitlist.',
  keywords:
    'athlete shares, sports trading platform, buy athlete shares, football stock market, EU regulated sports platform, virtual athlete trading, fantasy sports investing, Sorare alternative',
  authors: [{ name: 'AthleteShare OÜ' }],
  metadataBase: new URL('https://athleteshare.app'),
  alternates: { canonical: 'https://athleteshare.app' },
  openGraph: {
    title: 'AthleteShare — Trade Athlete Shares | EU Regulated',
    description:
      'Your sports knowledge earns real money. Buy shares in Mbappé, Haaland, LeBron. Prices move with every match. Free beta Q4 2026.',
    url: 'https://athleteshare.app',
    siteName: 'AthleteShare',
    locale: 'en_EU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AthleteShare — Trade Athlete Shares | EU Regulated',
    description:
      'Buy shares in footballers. Prices move with real match stats. EU regulated. Free beta Q4 2026.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/athleteshare-logo-bg.png',
    apple: '/athleteshare-logo-bg.png',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://athleteshare.app/#app',
      name: 'AthleteShare',
      url: 'https://athleteshare.app',
      description:
        'EU-regulated platform to buy and sell virtual shares in professional athletes. Prices move based on real match performance statistics.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'iOS, Android, Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      featureList: ['Virtual athlete trading', 'Real-time performance pricing', 'EU regulated', 'GDPR compliant'],
    },
    {
      '@type': 'Organization',
      '@id': 'https://athleteshare.app/#org',
      name: 'AthleteShare OÜ',
      url: 'https://athleteshare.app',
      logo: 'https://athleteshare.app/athleteshare-logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@athleteshare.app',
        contactType: 'customer support',
      },
      address: { '@type': 'PostalAddress', addressCountry: 'EE' },
      sameAs: [],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is AthleteShare gambling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. AthleteShare is regulated as a Game of Skill. Share prices are determined entirely by verified athlete performance statistics — goals, assists, match ratings. There is no luck element.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do athlete share prices move?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prices update after every match using official stats through a 4-layer algorithm. Goals, assists, and match ratings feed into a performance score, which is then adjusted by a competition multiplier and capped at +40% / -25% per match.',
          },
        },
        {
          '@type': 'Question',
          name: 'When does the beta launch?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We are targeting Q4 2026. Waitlist members are invited in batches based on their position.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable} bg-navy-950 text-white antialiased`} style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  )
}
