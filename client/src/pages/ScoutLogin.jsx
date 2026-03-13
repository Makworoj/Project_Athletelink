import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  

export default function ScoutLogin() {
  // Accesses the global authentication state to log the scout in or out
  const { currentScout, setCurrentScout } = useAuth();
  // Navigation hook to redirect users once they are successfully authenticated
  const navigate = useNavigate();
  
  // Local list of all scouts fetched from the database for the dropdown selection
  const [scouts, setScouts] = useState([]);
  // Tracks the ID of the specific scout selected in the dropdown menu
  const [selectedId, setSelectedId] = useState('');
  // Manages the visual loading state while the list of scouts is being retrieved
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a scout is already logged in, redirect them to the home page immediately
    if (currentScout) {
      navigate('/');
    }

    // Fetches the directory of available scouts to populate the login dropdown
    fetch('http://127.0.0.1:5555/scouts')
      .then(res => res.json())
      .then(data => {
        setScouts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentScout, navigate]);

  // Processes the login by saving the selected scout to context and local storage
  const handleLogin = () => {
    if (!selectedId) return;
    
    // Finds the full scout object that matches the ID selected in the dropdown
    const scout = scouts.find(s => s.id === Number(selectedId));
    if (scout) {
      // Persists the session in the browser so the user stays logged in on refresh
      localStorage.setItem('currentScout', JSON.stringify(scout));
      // Updates the global application state to reflect the active scout
      setCurrentScout(scout);
      // Sends the newly logged-in scout to the home dashboard
      navigate('/');
    }
  };

  // Simple loading placeholder to prevent layout shift while fetching data
  if (loading) return <div className="text-center py-20 text-slate-400">Loading scouts...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">Scout Login</h1>
        <p className="text-slate-300 mb-8">Select your scout profile (demo mode)</p>

        {/* Dropdown menu to pick a specific scout persona */}
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg mb-6 text-white focus:border-emerald-500 outline-none"
        >
          <option value="">-- Select scout profile --</option>
          {scouts.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} – {s.organization || 'No Org'} ({s.country || 'N/A'})
            </option>
          ))}
        </select>

        {/* Login button is disabled until a valid scout is selected */}
        <button
          onClick={handleLogin}
          disabled={!selectedId}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            !selectedId 
              ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20'
          }`}
        >
          Log In as Scout
        </button>
      </div>
    </div>
  );
}