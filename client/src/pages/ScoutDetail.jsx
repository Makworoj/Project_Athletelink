import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ScoutDetail() {
  // Grabs the ID from the URL (e.g., /scouts/5) to know which profile to load
  const { id } = useParams();
  
  // States to hold the scout's profile, their assigned athletes, and their job postings
  const [scout, setScout] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  // Tracks loading state to prevent showing empty fields while data is in transit
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Flag to prevent state updates if the user navigates away before the fetch finishes
    let isMounted = true;

    const fetchData = async () => {
      try {
        // First, fetch the core scout profile data
        const scoutRes = await fetch(`http://127.0.0.1:5555/scouts/${id}`);
        if (!scoutRes.ok) throw new Error('Scout not found');
        const scoutData = await scoutRes.json();

        // Safety check to ensure the component is still active
        if (!isMounted) return;
        setScout(scoutData);

        // Fetch all athletes and opportunities to filter them by this specific scout
        const [athletesRes, oppsRes] = await Promise.all([
          fetch('http://127.0.0.1:5555/athletes'),
          fetch('http://127.0.0.1:5555/opportunities')
        ]);

        if (!athletesRes.ok || !oppsRes.ok) throw new Error('Failed to fetch related data');

        const allAthletes = await athletesRes.json();
        const allOpps = await oppsRes.json();

        if (!isMounted) return;

        // Filters the global lists for items linked to this scout's ID
        const scoutAthletes = allAthletes.filter(a => a.scout_id === Number(id));
        const scoutOpps = allOpps.filter(o => o.scout_id === Number(id));

        setAthletes(scoutAthletes);
        setOpportunities(scoutOpps);
      } catch (err) {
        console.error(err);
      } finally {
        // Ensures the loading spinner turns off even if an error occurs
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Cleanup function: sets isMounted to false when the user leaves the page
    return () => {
      isMounted = false;
    };
  }, [id]); // Re-runs if the ID in the URL changes

  // UI for the loading state
  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Loading scout profile...</div>;
  
  // Error handling if the ID doesn't match a scout in the database
  if (!scout) return <div className="text-center py-20 text-red-400">Scout not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumb link to return to the scout directory */}
      <Link to="/scouts" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block font-medium">
        ← Back to Scouts
      </Link>

      {/* Profile Header Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 mb-10 shadow-xl">
        <h1 className="text-4xl font-bold mb-4 text-white">{scout.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Organization</p>
            <p className="text-xl">{scout.organization || '—'}</p>
          </div>
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Country</p>
            <p className="text-xl">{scout.country || '—'}</p>
          </div>
        </div>
      </div>

      

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column: List of Athletes this scout is tracking */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Athletes Scouted</h2>
          {athletes.length === 0 ? (
            <p className="text-slate-500 italic">No athletes assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {athletes.map(ath => (
                <Link
                  key={ath.id}
                  to={`/athletes/${ath.id}`}
                  className="block bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-emerald-600 transition group"
                >
                  <p className="font-bold text-white group-hover:text-emerald-400">{ath.name}</p>
                  <p className="text-sm text-slate-400">
                    {ath.sport} • {ath.country} • Age {ath.age}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Job opportunities posted by this scout */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Posted Opportunities</h2>
          {opportunities.length === 0 ? (
            <p className="text-slate-500 italic">No opportunities posted yet.</p>
          ) : (
            <div className="space-y-4">
              {opportunities.map(opp => (
                <Link
                  key={opp.id}
                  to={`/opportunities/${opp.id}`}
                  className="block bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-emerald-600 transition group"
                >
                  <p className="font-bold text-white group-hover:text-emerald-400">{opp.title}</p>
                  <p className="text-sm text-slate-400">
                    {opp.club || '—'} • {opp.country || '—'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}