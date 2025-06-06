"use client";
import Link from 'next/link'
import LanguageSwitcher from './languageswitch' // Import the switcher

const navItems = {
  '/': {
    name: 'home',
  },
  '/explore': {
    name: 'explore',
  },
  // 'https://vercel.com/templates/next.js/portfolio-starter-kit': {
  //   name: 'deploy',
  // },
}

export function Navbar({ onLanguageChange, language }: { onLanguageChange?: (lang: string) => void, language?: string }) {
  return (
    <aside className="-ml-[8px] mb-5 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10 items-center">
            {Object.entries(navItems).map(([path, { name }], idx, arr) => (
              <span key={path + '-wrapper'} className="flex items-center">
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
                {idx < arr.length - 1 && (
                  <span
                    key={`sep-${idx}`}
                    className="mx-1 h-6 w-0.5 bg-gray-300 inline-block align-middle"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
          {/* Language Switcher on the right */}
          <div className="ml-4">
            <LanguageSwitcher onLanguageChange={onLanguageChange || (() => {})} />
          </div>
        </nav>
        <hr className="my-2 border-gray-300" />
      </div>
    </aside>
  )
}
