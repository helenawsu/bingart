"use client"
import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { useState } from 'react'
import { LanguageContext } from './context/language'

const cx = (...classes) => classes.filter(Boolean).join(' ')

const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bing's art",
    template: '%s | Bing\'s art',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState('en');

  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Overpass+Mono:wght@300..700&display=swap" rel="stylesheet" />
                <link rel="icon" href="/Hicon32.ico" sizes="any" />

      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar onLanguageChange={setLanguage} language={language} />
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </main>
        </LanguageContext.Provider>
      </body>
    </html>
  )
}
