import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { currentAthlete, login } = useAuth();
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentAthlete) {
      navigate('/'); 
    }

    fetch('http://127.0.0.1:5555/athletes')
      .then(res => res.json())
      .then(data => {
        setAthletes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentAthlete, navigate]);

  const handleLogin = () => {
    if (!selectedId) return;
    const athlete = athletes.find(a => a.id === Number(selectedId));
    if (athlete) {
      login(athlete);
      navigate('/');
    }
  };

  if (loading) return <div className="text-center py-20">Loading athletes...</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">Athlete Login</h1>
        <p className="text-slate-300 mb-8">
          Select your profile to continue (demo mode – no password needed)
        </p>

        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg mb-6 focus:outline-none focus:border-emerald-500"
        >
          <option value="">-- Select your athlete profile --</option>
          {athletes.map(ath => (
            <option key={ath.id} value={ath.id}>
              {ath.name} – {ath.sport || '—'} ({ath.country || '—'})
            </option>
          ))}
        </select>

        <button
          onClick={handleLogin}
          disabled={!selectedId}
          className={`w-full py-3 rounded-lg font-bold transition ${
            !selectedId ? 'bg-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Log In as Athlete
        </button>
      </div>
    </div>
  );
}