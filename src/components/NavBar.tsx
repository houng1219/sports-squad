'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Trophy, Plus, User } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/squads', label: '揪團列表' },
  { href: '/recommend', label: '智能推薦' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">SportsSquad</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/squads/new"
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              發起揪團
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              個人檔案
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium ${
                  pathname === link.href ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 px-4">
              <Link
                href="/squads/new"
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-orange-500 text-white text-center py-2.5 rounded-lg text-sm font-medium"
              >
                發起揪團
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex-1 border border-gray-200 text-gray-700 text-center py-2.5 rounded-lg text-sm font-medium"
              >
                個人檔案
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}