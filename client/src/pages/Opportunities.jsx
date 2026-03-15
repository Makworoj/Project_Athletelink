import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentScout } = useAuth();

  useEffect(() => {
    fetch('https://project-athletelink.onrender.com/opportunities')
      .then((res) => res.json())
      .then((data) => {
        setOpportunities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching opportunities:", err);
        setLoading(false);
      });
  }, []);

  const filteredOpps = opportunities.filter((opp) =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opp.club && opp.club.toLowerCase().includes(searchTerm.toLowerCase())) ||
    opp.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-slate-400">Loading opportunities...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link to="/" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2">
          ← Back to Home
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-emerald-400 mb-2">Opportunities</h1>
          <p className="text-slate-400 text-lg">Find your next move in the world of professional sports.</p>
        </div>

        {currentScout && (
          <Link
            to="/opportunities/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition text-center"
          >
            + Post New Opportunity
          </Link>
        )}
      </div>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Search by position, club, or country..."
          className="w-full max-w-xl px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {opp.country}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{opp.title}</h3>
                <p className="text-slate-300 font-medium mb-4">{opp.club || "Individual Scout Opportunity"}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 uppercase font-bold">Posted By</span>
                  <span className="text-sm text-slate-200">{opp.scout?.name || "Verified Scout"}</span>
                </div>
                
                <Link
                  to={`/opportunities/${opp.id}`}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">
          <p className="text-slate-500 text-xl">No opportunities found matching your search.</p>
        </div>
      )}
    </div>
  );
}