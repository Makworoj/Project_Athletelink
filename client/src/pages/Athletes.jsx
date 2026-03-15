import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Athletes() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentScout } = useAuth();

  useEffect(() => {
    fetch('https://project-athletelink.onrender.com/athletes')
      .then(res => res.json())
      .then(data => {
        setAthletes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading athletes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-400">Athletes</h1>
        {!currentScout && (
          <Link
            to="/athletes/new"
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition"
          >
            + Add New Athlete
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map(athlete => (
          <div
            key={athlete.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition shadow-xl flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-4 text-white border-b border-slate-700 pb-2">
              {athlete.name}
            </h3>

            <div className="space-y-3 text-sm text-slate-300 flex-grow">
              <p>
                <span className="text-emerald-400 font-semibold">Sport:</span> {athlete.sport || '—'}
              </p>
              <p>
                <span className="text-emerald-400 font-semibold">Country:</span> {athlete.country || '—'}
              </p>
              <p>
                <span className="text-emerald-400 font-semibold">Age:</span> {athlete.age || '—'}
              </p>
              
              <p>
                <span className="text-emerald-400 font-semibold">Status:</span> 
                {athlete.scout_id ? ` Managed by Scout #${athlete.scout_id}` : ' Open for Recruitment'}
              </p>
            </div>

            <Link
              to={`/athletes/${athlete.id}`}
              className="mt-6 inline-block text-center bg-slate-900 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900 border border-emerald-400/50 py-3 rounded-lg font-bold transition"
            >
              View Full Profile & Opportunities →
            </Link>
          </div>
        ))}
      </div>

      {athletes.length === 0 && (
        <div className="text-center py-20 bg-slate-800 rounded-2xl border border-dashed border-slate-700">
          <p className="text-slate-500">No athletes have joined the platform yet.</p>
        </div>
      )}
    </div>
  );
}