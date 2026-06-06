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
    <nav className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/85">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-md shadow-cyan-500/30 text-lg">
              🏀
            </div>
            <span className="font-bold text-lg text-white">
              Sports<span className="bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-transparent">Squad</span>
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
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
              className="p-2 rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-colors"
              aria-label="切換深色模式"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/squads/new"
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              發起揪團
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-white/80 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <User className="w-4 h-4" />
              個人檔案
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-white/60 hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl ${
                    active ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-3 pt-3 border-t border-white/10 flex gap-2 px-1">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex-1 flex items-center justify-center gap-1.5 border border-white/10 text-white/70 py-2.5 rounded-xl text-sm font-medium"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {resolvedTheme === 'dark' ? '淺色' : '深色'}
              </button>
              <Link
                href="/squads/new"
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-md shadow-cyan-500/20"
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
