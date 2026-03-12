import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import AthleteDetail from './pages/AthleteDetail';
import Scouts from './pages/Scouts';
import ScoutDetail from './pages/ScoutDetail';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import AthleteForm from './pages/AthleteForm';
import ScoutForm from './pages/ScoutForm';
import OpportunityForm from './pages/OpportunityForm';
import Login from './pages/Login';

function AppContent() {
  const { currentAthlete, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-emerald-400">
              AthleteLink
            </Link>

            <div className="flex items-center gap-8">
              <Link to="/athletes" className={location.pathname === '/athletes' ? 'text-emerald-400' : 'hover:text-emerald-400'}>Athletes</Link>
              <Link to="/scouts" className={location.pathname === '/scouts' ? 'text-emerald-400' : 'hover:text-emerald-400'}>Scouts</Link>
              <Link to="/opportunities" className={location.pathname.startsWith('/opportunities') ? 'text-emerald-400' : 'hover:text-emerald-400'}>Opportunities</Link>

              {currentAthlete ? (
                <>
                  <span className="text-emerald-300">Welcome, {currentAthlete.name}</span>
                  <button 
                    onClick={logout}
                    className="text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Login as Athlete</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

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
        <Route path="/login" element={<Login />} />
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