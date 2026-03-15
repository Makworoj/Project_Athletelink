import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyApplications() {
  const { currentAthlete } = useAuth();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentAthlete) {
      navigate('/login');
      return;
    }

    Promise.all([
      fetch('https://project-athletelink.onrender.com/applications').then(res => res.json()),
      fetch('https://project-athletelink.onrender.com/opportunities').then(res => res.json())
    ])
      .then(([allApps, allOpps]) => {
        const myApps = allApps.filter(
          app => app.athlete_id === currentAthlete.id
        );
        setApplications(myApps);
        setOpportunities(allOpps);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load your applications');
        setLoading(false);
      });
  }, [currentAthlete, navigate]);

  if (!currentAthlete) return null; 

  if (loading) return <div className="text-center py-20 text-slate-400">Loading your applications...</div>;

  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-2">My Applications</h1>
      <p className="text-slate-400 mb-10">
        Track the status of opportunities you've applied to
      </p>

      {applications.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-xl text-slate-300 mb-6">You haven't applied to any opportunities yet.</p>
          <Link
            to="/opportunities"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-xl font-bold text-lg"
          >
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map(app => {
            const opp = opportunities.find(o => o.id === app.opportunity_id);
            return (
              <div
                key={app.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-emerald-600/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                  <div>
                    <Link
                      to={`/opportunities/${app.opportunity_id}`}
                      className="text-2xl font-semibold hover:text-emerald-400 transition"
                    >
                      {opp?.title || 'Opportunity #' + app.opportunity_id}
                    </Link>
                    {opp && (
                      <p className="text-slate-400 mt-2">
                        {opp.club || '—'} • {opp.country || '—'}
                      </p>
                    )}
                  </div>

                  <span
                    className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide self-start ${
                      app.status === 'accepted' ? 'bg-green-800 text-green-100' :
                      app.status === 'rejected' ? 'bg-red-800 text-red-100' :
                      'bg-yellow-800 text-yellow-100'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 text-sm text-slate-400">
                  Applied on: {new Date().toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}