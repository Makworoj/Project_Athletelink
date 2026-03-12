import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/opportunities')
      .then(res => res.json())
      .then(data => {
        setOpportunities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading opportunities...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-400">Opportunities</h1>
        <Link
          to="/opportunities/new"
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium"
        >
          + Post New Opportunity
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div
            key={opp.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{opp.title}</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-emerald-400">Club:</span> {opp.club || '—'}</p>
              <p><span className="text-emerald-400">Country:</span> {opp.country || '—'}</p>
              <p><span className="text-emerald-400">Scout ID:</span> {opp.scout_id || '—'}</p>
            </div>
            <Link
              to={`/opportunities/${opp.id}`}
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}