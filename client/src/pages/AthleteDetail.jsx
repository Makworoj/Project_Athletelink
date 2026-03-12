import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AthleteDetail() {
  const { id } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5555/athletes/${id}`).then(res => res.json()),
      fetch(`http://127.0.0.1:5555/athletes/${id}/opportunities`).then(res => res.json())
    ])
      .then(([athleteData, oppData]) => {
        setAthlete(athleteData);
        setOpportunities(oppData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!athlete) return <div className="text-center py-20 text-red-400">Athlete not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/athletes" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">← Back to Athletes</Link>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-2">{athlete.name}</h1>
        <div className="flex gap-6 text-lg text-slate-400 mb-8">
          <p>{athlete.sport}</p>
          <p>{athlete.country}</p>
          <p>Age: {athlete.age}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Opportunities Applied To</h2>
        {opportunities.length === 0 ? (
          <p className="text-slate-400">No opportunities yet.</p>
        ) : (
          <div className="grid gap-6">
            {opportunities.map(opp => (
              <div key={opp.id} className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-medium text-xl">{opp.title}</h3>
                <p className="text-emerald-400">{opp.club} • {opp.country}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}