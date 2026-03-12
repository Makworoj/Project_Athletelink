import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import AthleteDetail from './pages/AthleteDetail';
import AthleteForm from './pages/AthleteForm';
import Scouts from './pages/Scouts';
import ScoutDetail from './pages/ScoutDetail';
import ScoutForm from './pages/ScoutForm';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import OpportunityForm from './pages/OpportunityForm';
import MyApplications from './pages/MyApplications';
import Login from './pages/Login';

function AppContent() {
  const { currentAthlete, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-emerald-400">
              AthleteLink
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                to="/athletes"
                className={
                  location.pathname === '/athletes'
                    ? 'text-emerald-400 font-medium'
                    : 'hover:text-emerald-400 transition'
                }
              >
                Athletes
              </Link>

              <Link
                to="/scouts"
                className={
                  location.pathname === '/scouts'
                    ? 'text-emerald-400 font-medium'
                    : 'hover:text-emerald-400 transition'
                }
              >
                Scouts
              </Link>

              <Link
                to="/opportunities"
                className={
                  location.pathname.startsWith('/opportunities')
                    ? 'text-emerald-400 font-medium'
                    : 'hover:text-emerald-400 transition'
                }
              >
                Opportunities
              </Link>

              {/* Conditional: My Applications (only visible when logged in) */}
              {currentAthlete && (
                <Link
                  to="/my-applications"
                  className={
                    location.pathname === '/my-applications'
                      ? 'text-emerald-400 font-medium'
                      : 'hover:text-emerald-400 transition'
                  }
                >
                  My Applications
                </Link>
              )}

              {/* User Area */}
              {currentAthlete ? (
                <div className="flex items-center gap-6">
                  <span className="text-emerald-300">
                    Welcome, <strong>{currentAthlete.name.split(' ')[0]}</strong>
                  </span>
                  <button
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-emerald-400 hover:text-emerald-300 transition font-medium"
                >
                  Login as Athlete
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/athletes/:id" element={<AthleteDetail />} />
        <Route path="/athletes/new" element={<AthleteForm />} />

        <Route path="/scouts" element={<Scouts />} />
        <Route path="/scouts/:id" element={<ScoutDetail />} />
        <Route path="/scouts/new" element={<ScoutForm />} />

        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/opportunities/new" element={<OpportunityForm />} />

        <Route path="/my-applications" element={<MyApplications />} />

        <Route path="/login" element={<Login />} />

        
        <Route
          path="*"
          element={
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-emerald-400 mb-4">Page Not Found</h2>
              <Link to="/" className="text-emerald-400 hover:text-emerald-300">
                Return to Home
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;