import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Scouts() {
  const [scouts, setScouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/scouts')
      .then(res => res.json())
      .then(data => {
        setScouts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading scouts...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-400">Scouts</h1>
        <Link
          to="/scouts/new"
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium"
        >
          + Add New Scout
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scouts.map(scout => (
          <div
            key={scout.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{scout.name}</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-emerald-400">Organization:</span> {scout.organization || '—'}</p>
              <p><span className="text-emerald-400">Country:</span> {scout.country || '—'}</p>
            </div>
            <Link
              to={`/scouts/${scout.id}`}
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View Scout Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}