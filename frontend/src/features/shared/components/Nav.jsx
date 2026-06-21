import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'

const Nav = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/divine_capture_logo.svg"
            alt="DivineCapture"
            className="h-9 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
          <span
            onClick={() => navigate('/')}
            className="text-lg font-semibold text-slate-900 cursor-pointer"
          >
            DivineCapture
          </span>
        </div>

        {/* Center Nav Links - Role Based */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/browse')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/browse') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => navigate('/findProfile')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/findProfile') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Find Photographers
              </button>
            </>
          )}

          {user?.role === 'user' && (
            <>
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/browse')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/browse') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => navigate('/findProfile')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/findProfile') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Find Photographers
              </button>
            </>
          )}

          {user?.role === 'getter' && (
            <>
              <button
                onClick={() => navigate('/serviceProviderHome')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/serviceProviderHome') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/dashboard/profile')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard/profile') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => navigate('/portfolio')}
                className={`text-sm font-medium transition-colors ${
                  isActive('/portfolio') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Portfolio
              </button>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:block">{user.fullname}</span>
              {user.role === 'getter' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="h-[36px] px-4 text-[12px] font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20 transition-all"
                >
                  Dashboard
                </button>
              )}
              {user.role === 'user' && (
                <button
                  onClick={() => navigate('/findProfile')}
                  className="h-[36px] px-4 text-[12px] font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20 transition-all"
                >
                  Find Photographers
                </button>
              )}
              <button
                onClick={() => {
                  // Logout logic - dispatch logout action
                  navigate('/login')
                }}
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
      </div>
    </nav>
  )
}

export default Nav