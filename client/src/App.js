// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';

// Page imports for various features like profiles, job boards, and authentication
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import Scouts from './pages/Scouts';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import OpportunityForm from './pages/OpportunityForm';
import MyApplications from './pages/MyApplications';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ScoutDashboard from './pages/ScoutDashboard';
import AthleteDetail from './pages/AthleteDetail';
import ScoutDetail from './pages/ScoutDetail';

// Provides the global state for logged-in users to all child components
import { AuthProvider, useAuth } from './context/AuthContext';

// Higher-Order Component that acts as a gatekeeper for restricted scout features
function ScoutOnly({ children }) {
  const { currentScout } = useAuth();
  // If no scout is logged in, redirect them away from the restricted form
  return currentScout ? children : <Navigate to="/opportunities" replace />;
}

function App() {
  return (
    // AuthProvider must wrap the Router so navigation can respond to login changes
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          {/* The Navbar is placed outside Routes so it stays visible on every page */}
          <Navbar />

          <Routes>
            {/* The landing page of the application */}
            <Route path="/" element={<Home />} />

            {/* Public Directory Routes: accessible to everyone */}
            <Route path="/athletes" element={<Athletes />} />
            <Route path="/athletes/:id" element={<AthleteDetail />} />
            <Route path="/scouts" element={<Scouts />} />
            <Route path="/scouts/:id" element={<ScoutDetail />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />

            {/* Restricted Route: Uses the ScoutOnly guard to protect the posting form */}
            <Route
              path="/opportunities/new"
              element={
                <ScoutOnly>
                  <OpportunityForm />
                </ScoutOnly>
              }
            />

            {/* User-specific routes for tracking activity and settings */}
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/dashboard" element={<ScoutDashboard />} />

            {/* Authentication entry points */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Catch-all route (*) displays a 404 message if a user enters a broken URL */}
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h2 className="text-3xl font-bold text-emerald-400">404 - Page Not Found</h2>
                  <Link to="/" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
                    Back to Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;