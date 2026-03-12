import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- now imported from its own file

// Pages (assume these exist from previous steps)
import Home from './pages/Home';
import Athletes from './pages/Athletes';
import Scouts from './pages/Scouts';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import MyApplications from './pages/MyApplications';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import ScoutLogin from './pages/ScoutLogin';
import ScoutDashboard from './pages/ScoutDashboard';
import { Link } from 'react-router-dom';
import AthleteForm from './pages/AthleteForm';
import ScoutForm from './pages/ScoutForm';
import OpportunityForm from './pages/OpportunityForm';

// AuthProvider (keep your existing one or use this minimal version)
import { AuthProvider } from './context/AuthContext'; // adjust path

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          <Navbar />  {/* <-- standalone Navbar component */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/athletes" element={<Athletes />} />
            <Route path="/scouts" element={<Scouts />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/scout-login" element={<ScoutLogin />} />
            <Route path="/dashboard" element={<ScoutDashboard />} />
            <Route path="/athletes/new" element={<AthleteForm />} />
<Route path="/scouts/new" element={<ScoutForm />} />
<Route path="/opportunities/new" element={<OpportunityForm />} />

            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h2 className="text-3xl font-bold text-emerald-400">404 - Not Found</h2>
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