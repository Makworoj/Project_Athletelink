import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OpportunityDetail() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5555/opportunities/${id}`).then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json()),
      fetch('http://127.0.0.1:5555/athletes').then(res => res.json())
    ])
      .then(([oppData, allApps, allAthletes]) => {
        setOpportunity(oppData);
        const oppApplications = allApps.filter(app => app.opportunity_id === Number(id));
        setApplications(oppApplications);
        setAthletes(allAthletes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleApply = () => {
    if (applying || !selectedAthleteId) {
      setApplyError(!selectedAthleteId ? 'Please select an athlete first' : 'Already applying...');
      return;
    }

    setApplying(true);
    setApplyError(null);
    setApplySuccess(false);

    const applicationData = {
      athlete_id: Number(selectedAthleteId),
      opportunity_id: Number(id),
      status: 'pending'
    };

    fetch('http://127.0.0.1:5555/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit application');
        return res.json();
      })
      .then(newApp => {
        setApplications([...applications, newApp]);
        setApplySuccess(true);
        setSelectedAthleteId(''); 
        setApplying(false);
      })
      .catch(err => {
        setApplyError(err.message);
        setApplying(false);
      });
  };

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

        <div className="mb-10 bg-slate-900 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-emerald-300">Apply as Athlete</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-2">Select Athlete</label>
              <select
                value={selectedAthleteId}
                onChange={(e) => setSelectedAthleteId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Choose an athlete --</option>
                {athletes.map(ath => (
                  <option key={ath.id} value={ath.id}>
                    {ath.name} ({ath.sport || '—'}, {ath.country || '—'})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleApply}
              disabled={applying || !selectedAthleteId}
              className={`px-8 py-3 rounded-lg font-bold transition whitespace-nowrap ${
                applying || !selectedAthleteId
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>

          {applySuccess && (
            <p className="mt-4 text-green-400 font-medium">
              Application submitted successfully! (Status: pending)
            </p>
          )}
          {applyError && (
            <p className="mt-4 text-red-400 font-medium">
              {applyError}
            </p>
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Applications ({applications.length})</h2>

        {applications.length === 0 ? (
          <p className="text-slate-400">No applications received yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-lg">Athlete ID: {app.athlete_id}</p>
                  <p className="text-sm text-slate-400 mt-1">Applied on: {new Date().toLocaleDateString()}</p>
                </div>
                <span className={`px-5 py-2 rounded-full text-sm font-medium ${
                  app.status === 'accepted' ? 'bg-green-700 text-green-100' :
                  app.status === 'rejected' ? 'bg-red-700 text-red-100' :
                  'bg-yellow-700 text-yellow-100'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}