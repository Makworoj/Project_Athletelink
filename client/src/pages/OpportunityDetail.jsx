import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5555/opportunities/${id}`).then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json())
    ])
      .then(([oppData, allApps]) => {
        setOpportunity(oppData);
        const oppApplications = allApps.filter(app => app.opportunity_id === Number(id));
        setApplications(oppApplications);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading opportunity...</div>;
  if (!opportunity) return <div className="text-center py-20 text-red-400">Opportunity not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/opportunities" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">← Back to Opportunities</Link>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-2">{opportunity.title}</h1>
        <div className="flex gap-8 text-lg text-slate-300 mb-10">
          <p><span className="text-emerald-400">Club:</span> {opportunity.club || '—'}</p>
          <p><span className="text-emerald-400">Country:</span> {opportunity.country || '—'}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Applications ({applications.length})</h2>

        {applications.length === 0 ? (
          <p className="text-slate-400">No applications received yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-lg">Athlete ID: {app.athlete_id}</p>
                    <p className="text-emerald-400 capitalize mt-1">Status: {app.status}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    app.status === 'accepted' ? 'bg-green-600' :
                    app.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}