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
    <nav className="bg-white/90 dark:bg-[#2A1810]/90 border-b border-orange-100 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md text-lg">
              🏀
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>
              Sports<span className="text-orange-500">Squad</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-orange-50/60 hover:text-orange-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              aria-label="切換深色模式"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              href="/squads/new"
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              發起揪團
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <User className="w-4 h-4" />
              個人檔案
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-orange-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-orange-100">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-xl ${
                  pathname === link.href ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-orange-50/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-orange-100 flex gap-2 px-1">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex-1 flex items-center justify-center gap-1.5 border-2 border-orange-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {resolvedTheme === 'dark' ? '淺色' : '深色'}
              </button>
              <Link
                href="/squads/new"
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-md"
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
