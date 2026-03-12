import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext'; 

export default function Navbar() {
  const { currentAthlete, currentScout, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-400 font-medium'
      : 'text-slate-300 hover:text-emerald-400 transition';

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
              AL
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AthleteLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/athletes" className={isActive('/athletes')}>
              Athletes
            </Link>
            <Link to="/scouts" className={isActive('/scouts')}>
              Scouts
            </Link>
            <Link to="/opportunities" className={isActive('/opportunities')}>
              Opportunities
            </Link>

            {/* Athlete links */}
            {currentAthlete && (
              <>
                <Link to="/my-applications" className={isActive('/my-applications')}>
                  My Applications
                </Link>
                <Link to="/my-profile" className={isActive('/my-profile')}>
                  My Profile
                </Link>
              </>
            )}

            {/* Scout links */}
            {currentScout && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/my-profile" className={isActive('/my-profile')}>
                  My Profile
                </Link>
              </>
            )}

            {/* Logout when logged in */}
            {(currentAthlete || currentScout) && (
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 font-medium transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-md">
          <div className="px-4 py-6 space-y-5">
            <Link
              to="/athletes"
              className={`block text-lg ${isActive('/athletes')}`}
              onClick={() => setMobileOpen(false)}
            >
              Athletes
            </Link>
            <Link
              to="/scouts"
              className={`block text-lg ${isActive('/scouts')}`}
              onClick={() => setMobileOpen(false)}
            >
              Scouts
            </Link>
            <Link
              to="/opportunities"
              className={`block text-lg ${isActive('/opportunities')}`}
              onClick={() => setMobileOpen(false)}
            >
              Opportunities
            </Link>

            {currentAthlete && (
              <>
                <Link
                  to="/my-applications"
                  className={`block text-lg ${isActive('/my-applications')}`}
                  onClick={() => setMobileOpen(false)}
                >
                  My Applications
                </Link>
                <Link
                  to="/my-profile"
                  className={`block text-lg ${isActive('/my-profile')}`}
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}

            {currentScout && (
              <>
                <Link
                  to="/dashboard"
                  className={`block text-lg ${isActive('/dashboard')}`}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-profile"
                  className={`block text-lg ${isActive('/my-profile')}`}
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}

            {(currentAthlete || currentScout) && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block text-lg text-red-400 hover:text-red-300 w-full text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}