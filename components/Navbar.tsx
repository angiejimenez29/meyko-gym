"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogIn, Calendar, Users, Home, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Navbar({ user }: { user?: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/clases', label: 'Clases', icon: Calendar },
    { href: '/instructores', label: 'Nuestro Equipo', icon: Users },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full bg-background py-4 px-5 md:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-foreground/5 shadow-md">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#D6007A] to-[#9B00E8] flex items-center justify-center shadow-md">
             <span className="text-white font-bold text-xs md:text-sm">M</span>
          </div>
          <span className="text-base md:text-xl font-bold text-foreground tracking-wide">Meikyo Gym</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-semibold transition-colors ${
                isActive(link.href) ? 'text-foreground border-b-2 border-[#D6007A] pb-1' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {user ? (
            <Link 
              href="/instructor" 
              className="text-sm font-bold bg-[#D6007A] hover:bg-[#D6007A]/80 text-white px-5 py-2 rounded-full transition-colors shadow-lg flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Mi Portal
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-bold bg-[#D6007A] hover:bg-[#D6007A]/80 text-white px-5 py-2 rounded-full transition-colors shadow-lg flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Iniciar Sesión
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button 
            className="text-foreground hover:text-foreground/80 p-1"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-container border-l border-foreground/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-foreground/10">
          <span className="text-lg font-bold text-foreground">Menú</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-foreground/70 hover:text-foreground bg-foreground/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${
                  isActive(link.href) 
                    ? 'bg-[#D6007A]/10 text-[#D6007A]' 
                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-5 border-t border-foreground/10">
          {user ? (
            <Link
              href="/instructor"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full bg-[#D6007A] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 shadow-lg hover:bg-[#D6007A]/80 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" /> Mi Portal
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full bg-[#D6007A] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 shadow-lg hover:bg-[#D6007A]/80 transition-colors"
            >
              <LogIn className="w-5 h-5" /> Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
