import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { setUser } from '../../auth/states/auth.slice'

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = !user
    ? [
        { label: 'Home', path: '/' },
        { label: 'Browse', path: '/browse' },
        { label: 'Find Photographers', path: '/findProfile' },
      ]
    : user.role === 'user'
    ? [
        { label: 'Home', path: '/' },
        { label: 'Instant Booking', path: '/instant-booking' },
        { label: 'Find Photographers', path: '/findProfile' },
        { label: 'My Bookings', path: '/my-bookings' },
      ]
    : [
        { label: 'Home', path: '/serviceProviderHome' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'My Profile', path: '/dashboard/profile' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'Bookings', path: '/provider-bookings' },
      ]

  const handleNav = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    dispatch(setUser(null))
    navigate('/login')
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/divine_capture_logo.svg"
            alt="DivineCapture"
            className="h-9 w-auto cursor-pointer"
            onClick={() => { navigate('/'); setMobileOpen(false) }}
          />
          <span
            onClick={() => { navigate('/'); setMobileOpen(false) }}
            className="text-lg font-semibold text-slate-900 cursor-pointer"
          >
            DivineCapture
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-600">{user.fullname}</span>
              <button
                onClick={handleLogout}
                className="h-[36px] px-3 text-[12px] font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="h-[36px] px-5 text-[12px] font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-[slideDown_0.2s_ease-out]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 pt-2 mt-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-slate-500 font-medium">{user.fullname}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => handleNav('/login')}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleNav('/register')}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md transition-all text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}

export default Nav
