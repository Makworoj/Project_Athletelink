import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  

export default function ScoutLogin() {
  const { currentScout, setCurrentScout } = useAuth();
  const navigate = useNavigate();
  
  const [scouts, setScouts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentScout) {
      navigate('/');
    }

    fetch('https://project-athletelink.onrender.com/scouts')
      .then(res => res.json())
      .then(data => {
        setScouts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentScout, navigate]);

  const handleLogin = () => {
    if (!selectedId) return;
    
    const scout = scouts.find(s => s.id === Number(selectedId));
    if (scout) {
      localStorage.setItem('currentScout', JSON.stringify(scout));
      setCurrentScout(scout);
      navigate('/');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading scouts...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">Scout Login</h1>
        <p className="text-slate-300 mb-8">Select your scout profile (demo mode)</p>

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