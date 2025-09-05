import React, { useState } from 'react'
import { Shield, Menu, X, Home, Book, Mic, User } from 'lucide-react'
import Button from './Button'

const Header = ({ currentPage, onNavigate, subscription }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'scripts', label: 'Scripts', icon: Book },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const handleNavClick = (pageId) => {
    onNavigate(pageId)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-lg border-b border-text-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavClick('landing')}
          >
            <Shield className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold text-text-primary">Shield & Script</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  currentPage === id
                    ? 'bg-accent text-bg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* Subscription Badge & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className={`hidden sm:block px-3 py-1 rounded-pill text-xs font-medium ${
              subscription === 'premium' 
                ? 'bg-accent text-bg' 
                : 'bg-surface border border-text-secondary/20 text-text-secondary'
            }`}>
              {subscription === 'premium' ? 'Premium' : 'Free'}
            </div>
            
            <button
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-text-secondary/10 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                    currentPage === id
                      ? 'bg-accent text-bg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header