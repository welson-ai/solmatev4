'use client'

import { LogoMark } from './LogoMark'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-solmate-dark-card z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <LogoMark size={28} />
          <span className="text-white font-bold text-lg tracking-tight">SOLMATE</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-white hover:text-solmate-green transition text-sm font-medium">
            ABOUT
          </a>
          <a href="#features" className="text-white hover:text-solmate-green transition text-sm font-medium">
            FEATURES
          </a>
          <a href="#how-it-works" className="text-white hover:text-solmate-green transition text-sm font-medium">
            HOW IT WORKS
          </a>
          <a href="#protocols" className="text-white hover:text-solmate-green transition text-sm font-medium">
            PROTOCOLS
          </a>
          <a href="/agent/agent.html" className="text-white hover:text-solmate-green transition text-sm font-medium">
            AGENT
          </a>
          <a href="#docs" className="text-white hover:text-solmate-green transition text-sm font-medium">
            DOCS
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
