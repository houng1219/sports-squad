'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Plus, User, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/squads', label: '揪團列表' },
  { href: '/recommend', label: '智能推薦' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <nav className="border-b border-[#d2d2d7]/60 sticky top-0 z-50 backdrop-blur-xl bg-white/72 dark:bg-black/72">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[52px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0071e3] rounded-xl flex items-center justify-center text-lg">
              🏀
            </div>
            <span className="font-semibold text-[17px] tracking-tight text-[#1d1d1f] dark:text-white">
              Sports<span className="text-[#0071e3]">Squad</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-normal transition-all ${
                    active
                      ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]'
                      : 'text-[#1d1d1f]/80 hover:text-[#1d1d1f] dark:text-white/80 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full text-[#1d1d1f]/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 transition-colors"
              aria-label="切換深色模式"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/squads/new"
              className="flex items-center gap-1 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006edb] text-white px-4 py-1.5 rounded-full text-[13px] font-normal transition-colors"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              發起揪團
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-[#0071e3] hover:underline px-2 py-1.5 text-[13px] font-normal transition-colors"
            >
              <User className="w-3.5 h-3.5" strokeWidth={2} />
              個人檔案
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-full text-[#1d1d1f]/60 hover:bg-black/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-[#d2d2d7]/60">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-[15px] font-normal rounded-xl ${
                    active ? 'text-[#0071e3]' : 'text-[#1d1d1f]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-2 pt-3 border-t border-[#d2d2d7]/60 flex gap-2 px-1">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#d2d2d7] text-[#1d1d1f] py-2.5 rounded-full text-[14px] font-normal"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {resolvedTheme === 'dark' ? '淺色' : '深色'}
              </button>
              <Link
                href="/squads/new"
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white text-center py-2.5 rounded-full text-[14px] font-normal"
              >
                發起揪團
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
