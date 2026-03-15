import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ScoutDetail() {
  const { id } = useParams();
  
  const [scout, setScout] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const scoutRes = await fetch(`https://project-athletelink.onrender.com/scouts/${id}`);
        if (!scoutRes.ok) throw new Error('Scout not found');
        const scoutData = await scoutRes.json();

        if (!isMounted) return;
        setScout(scoutData);

        const [athletesRes, oppsRes] = await Promise.all([
          fetch('https://project-athletelink.onrender.com/athletes'),
          fetch('https://project-athletelink.onrender.com/opportunities')
        ]);

        if (!athletesRes.ok || !oppsRes.ok) throw new Error('Failed to fetch related data');

        const allAthletes = await athletesRes.json();
        const allOpps = await oppsRes.json();

        if (!isMounted) return;

        const scoutAthletes = allAthletes.filter(a => a.scout_id === Number(id));
        const scoutOpps = allOpps.filter(o => o.scout_id === Number(id));

        setAthletes(scoutAthletes);
        setOpportunities(scoutOpps);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Loading scout profile...</div>;
  
  if (!scout) return <div className="text-center py-20 text-red-400">Scout not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/scouts" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block font-medium">
        ← Back to Scouts
      </Link>

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