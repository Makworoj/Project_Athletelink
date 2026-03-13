import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ScoutDashboard() {
  // Accesses the logged-in scout's session data from global context
  const { currentScout } = useAuth();
  // Facilitates programmatic navigation (e.g., redirecting unauthorized users)
  const navigate = useNavigate();
  
  // Local states to store the scout's specific posts and the resulting athlete applications
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  // UI states for handling the lifecycle of the data fetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guards the route: if no scout is logged in, send them to the login page
    if (!currentScout) {
      navigate('/scout-login');
      return;
    }

    // Fetches all data in parallel to reduce total waiting time
    Promise.all([
      fetch('http://127.0.0.1:5555/opportunities').then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json())
    ])
      .then(([allOpps, allApps]) => {
        // Filters for opportunities created specifically by this scout
        const myOpps = allOpps.filter(opp => opp.scout_id === currentScout.id);
        setOpportunities(myOpps);

        // Identifies all applications that belong to this scout's opportunities
        const myOppIds = myOpps.map(o => o.id);
        const relevantApps = allApps.filter(app => myOppIds.includes(app.opportunity_id));
        setApplications(relevantApps);

        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, [currentScout, navigate]);

  // Prevents the component from rendering content if the redirect is in progress
  if (!currentScout) return null; 

  // Shows a loading indicator while the data is being processed
  if (loading) return <div className="text-center py-20 text-slate-400">Loading your dashboard...</div>;

  // Renders an error message if the server request fails
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  // Calculates real-time totals to populate the status overview cards
  const pending = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-2">Scout Dashboard</h1>
      <p className="text-slate-400 mb-10">
        Manage your posted opportunities and review applications
      </p>

      {/* Quick Stats Grid: Gives the scout an immediate numerical breakdown of talent review */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-yellow-400 mb-2">{pending}</p>
          <p className="text-slate-300">Pending Applications</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-green-400 mb-2">{accepted}</p>
          <p className="text-slate-300">Accepted</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-red-400 mb-2">{rejected}</p>
          <p className="text-slate-300">Rejected</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-emerald-400">Your Opportunities</h2>
        <Link
          to="/opportunities/new"
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition"
        >
          + Post New Opportunity
        </Link>
      </div>

      

[Image of Dashboard metrics UI layout]


      {/* Lists all individual opportunities or provides a CTA if none exist */}
      {opportunities.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-xl text-slate-300 mb-6">You haven't posted any opportunities yet.</p>
          <Link
            to="/opportunities/new"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-xl font-bold text-lg"
          >
            Create Your First Opportunity
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map(opp => {
            // Isolates applications for this specific card
            const oppApps = applications.filter(a => a.opportunity_id === opp.id);
            const pendingCount = oppApps.filter(a => a.status === 'pending').length;

            return (
              <Link
                key={opp.id}
                to={`/opportunities/${opp.id}`}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-600 transition block group"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-400 transition">{opp.title}</h3>
                <div className="text-sm text-slate-400 space-y-1 mb-4">
                  <p>Club: {opp.club || '—'}</p>
                  <p>Country: {opp.country || '—'}</p>
                </div>

                <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-700">
                  <span className="text-emerald-400 font-medium">
                    {oppApps.length} application{oppApps.length !== 1 ? 's' : ''}
                  </span>
                  {/* Highlights if there is urgent work (pending reviews) to be done */}
                  {pendingCount > 0 && (
                    <span className="bg-yellow-800/30 text-yellow-400 border border-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      {pendingCount} pending
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}