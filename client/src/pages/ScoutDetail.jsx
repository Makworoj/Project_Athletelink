import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ScoutDetail() {
  const { id } = useParams();
  const [scout, setScout] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/scouts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Scout not found');
        return res.json();
      })
      .then(scoutData => {
        setScout(scoutData);
        // Fetch athletes and opportunities for this scout
        return Promise.all([
          fetch('http://127.0.0.1:5555/athletes').then(res => res.json()),
          fetch('http://127.0.0.1:5555/opportunities').then(res => res.json())
        ]);
      })
      .then(([allAthletes, allOpps]) => {
        if (scout) {
          const scoutAthletes = allAthletes.filter(a => a.scout_id === Number(id));
          const scoutOpps = allOpps.filter(o => o.scout_id === Number(id));
          setAthletes(scoutAthletes);
          setOpportunities(scoutOpps);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading scout profile...</div>;
  if (!scout) return <div className="text-center py-20 text-red-400">Scout not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/scouts" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">← Back to Scouts</Link>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 mb-10">
        <h1 className="text-4xl font-bold mb-4">{scout.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
          <div>
            <p className="text-emerald-400 font-medium">Organization</p>
            <p className="text-xl">{scout.organization || '—'}</p>
          </div>
          <div>
            <p className="text-emerald-400 font-medium">Country</p>
            <p className="text-xl">{scout.country || '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Athletes Scouted</h2>
          {athletes.length === 0 ? (
            <p className="text-slate-400">No athletes assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {athletes.map(ath => (
                <Link
                  key={ath.id}
                  to={`/athletes/${ath.id}`}
                  className="block bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-emerald-600 transition"
                >
                  <p className="font-medium">{ath.name}</p>
                  <p className="text-sm text-slate-400">{ath.sport} • {ath.country} • Age {ath.age}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Posted Opportunities</h2>
          {opportunities.length === 0 ? (
            <p className="text-slate-400">No opportunities posted yet.</p>
          ) : (
            <div className="space-y-4">
              {opportunities.map(opp => (
                <Link
                  key={opp.id}
                  to={`/opportunities/${opp.id}`}
                  className="block bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-emerald-600 transition"
                >
                  <p className="font-medium">{opp.title}</p>
                  <p className="text-sm text-slate-400">{opp.club} • {opp.country}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}