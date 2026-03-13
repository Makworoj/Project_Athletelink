import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentAthlete, currentScout, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Hook to programmatically redirect the user
  const [mobileOpen, setMobileOpen] = useState(false);

  // Helper to highlight the active link based on the current URL
  const isActive = (path) =>
    location.pathname === path ? 'text-emerald-400 font-medium' : 'hover:text-emerald-400';

  // Centralized logout handler
  const handleLogout = () => {
    logout(); // Clears state and localStorage via AuthContext
    navigate('/'); // Forces redirect to home page to refresh UI state
  };

  // Determine which links to show based on the logged-in user type
  let links = [];
  if (currentAthlete) {
    links = [
      { to: '/opportunities', label: 'Opportunities' },
      { to: '/my-profile', label: 'My Profile' },
    ];
  } else if (currentScout) {
    links = [
      { to: '/opportunities', label: 'Opportunities' },
      { to: '/athletes', label: 'Athletes' },
      { to: '/my-profile', label: 'My Profile' },
    ];
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-emerald-400">
            AthleteLink
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`text-sm transition-colors ${isActive(l.to)}`}>
                {l.label}
              </Link>
            ))}

            {(currentAthlete || currentScout) ? (
              <button 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button className="md:hidden text-slate-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 bg-slate-900">
            <div className="flex flex-col gap-4 px-4">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-lg py-2 text-slate-200"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}

              {(currentAthlete || currentScout) ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="text-lg text-red-400 py-2 text-left font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-lg py-2 text-emerald-400"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-lg py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-center rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}