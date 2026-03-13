import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyApplications() {
  // Retrieves the logged-in athlete's data from the global auth context
  const { currentAthlete } = useAuth();
  // Provides the ability to redirect users to different pages programmatically
  const navigate = useNavigate();
  
  // State for storing applications specifically belonging to the current user
  const [applications, setApplications] = useState([]);
  // State for storing all available opportunities to cross-reference titles and clubs
  const [opportunities, setOpportunities] = useState([]); 
  // Tracks the loading status to show a placeholder while data is being fetched
  const [loading, setLoading] = useState(true);
  // Stores error messages if any of the network requests fail
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirects the user to the login page if they are not authenticated as an athlete
    if (!currentAthlete) {
      navigate('/login');
      return;
    }

    // Fetches both applications and opportunities simultaneously for better performance
    Promise.all([
      fetch('http://127.0.0.1:5555/applications').then(res => res.json()),
      fetch('http://127.0.0.1:5555/opportunities').then(res => res.json())
    ])
      .then(([allApps, allOpps]) => {
        // Filters the master list of applications to find only those belonging to the current user
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
  }, [currentAthlete, navigate]); // Effect re-runs if the user logs out or the navigation hook changes

  // Renders nothing if no athlete is logged in to prevent layout flickering during redirect
  if (!currentAthlete) return null; 

  // Displays a loading message while waiting for the database response
  if (loading) return <div className="text-center py-20 text-slate-400">Loading your applications...</div>;

  // Renders an error message if the fetch request was unsuccessful
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-emerald-400 mb-2">My Applications</h1>
      <p className="text-slate-400 mb-10">
        Track the status of opportunities you've applied to
      </p>

      {/* Shows an empty state message if the athlete hasn't applied to anything yet */}
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
          {/* Maps through the user's applications to display individual cards */}
          {applications.map(app => {
            // Finds the corresponding opportunity details (title, club) using the opportunity_id
            const opp = opportunities.find(o => o.id === app.opportunity_id);
            return (
              <div
                key={app.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-emerald-600/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                  <div>
                    {/* Links the card title directly to the specific opportunity detail page */}
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

                  {/* Dynamically changes the color of the status badge based on its value */}
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