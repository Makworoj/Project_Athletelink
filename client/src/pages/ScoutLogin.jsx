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

    fetch('http://127.0.0.1:5555/scouts')
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

  if (loading) return <div className="text-center py-20">Loading scouts...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">Scout Login</h1>
        <p className="text-slate-300 mb-8">Select your scout profile (demo mode)</p>

        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg mb-6"
        >
          <option value="">-- Select scout profile --</option>
          {scouts.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} – {s.organization || '—'} ({s.country || '—'})
            </option>
          ))}
        </select>

        <button
          onClick={handleLogin}
          disabled={!selectedId}
          className={`w-full py-3 rounded-lg font-bold ${
            !selectedId ? 'bg-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Log In as Scout
        </button>
      </div>
    </div>
  );
}