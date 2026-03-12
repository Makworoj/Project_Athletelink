import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { currentAthlete } = useAuth(); 

  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [athletes, setAthletes] = useState([]); 
  const [selectedAthleteId, setSelectedAthleteId] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    const fetches = [
      fetch(`http://127.0.0.1:5555/opportunities/${id}`).then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json())
    ];

   
    if (!currentAthlete) {
      fetches.push(fetch('http://127.0.0.1:5555/athletes').then(res => res.json()));
    }

    Promise.all(fetches)
      .then(([oppData, allApps, allAthletes]) => {
        setOpportunity(oppData);
        const oppApplications = allApps.filter(app => app.opportunity_id === Number(id));
        setApplications(oppApplications);

        if (allAthletes) {
          setAthletes(allAthletes);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, currentAthlete]);

  const handleApply = () => {
    if (applying) return;

    const athleteIdToUse = currentAthlete ? currentAthlete.id : Number(selectedAthleteId);

    if (!athleteIdToUse) {
      setApplyError('Please select an athlete or log in first');
      return;
    }

    setApplying(true);
    setApplyError(null);
    setApplySuccess(false);

    const applicationData = {
      athlete_id: athleteIdToUse,
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
        if (!currentAthlete) setSelectedAthleteId(''); 
        setApplying(false);
      })
      .catch(err => {
        setApplyError(err.message || 'Something went wrong');
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

        <div className="mb-12 bg-slate-900 p-8 rounded-xl border border-slate-700">
          <h3 className="text-xl font-semibold mb-6 text-emerald-300">
            {currentAthlete ? 'Apply as Yourself' : 'Apply as an Athlete'}
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-3">
                {currentAthlete ? 'Logged in as' : 'Select Athlete'}
              </label>

              {currentAthlete ? (
                <div className="w-full px-5 py-4 bg-slate-800 border border-emerald-600/30 rounded-lg text-emerald-300 font-medium flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  {currentAthlete.name} • {currentAthlete.sport || '—'} • {currentAthlete.country || '—'}
                </div>
              ) : (
                <select
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Choose an athlete to apply --</option>
                  {athletes.map(ath => (
                    <option key={ath.id} value={ath.id}>
                      {ath.name} ({ath.sport || '—'}, {ath.country || '—'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={handleApply}
              disabled={applying || (!currentAthlete && !selectedAthleteId)}
              className={`min-w-[140px] px-8 py-4 rounded-xl font-bold text-lg transition ${
                applying || (!currentAthlete && !selectedAthleteId)
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>

          {applySuccess && (
            <p className="mt-6 text-green-400 font-medium text-center">
              ✓ Application submitted successfully (pending review)
            </p>
          )}
          {applyError && (
            <p className="mt-6 text-red-400 font-medium text-center">
              {applyError}
            </p>
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
          Applications Received ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <p className="text-slate-400 italic">No applications yet — be the first!</p>
        ) : (
          <div className="space-y-5">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-lg">Athlete #{app.athlete_id}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Applied {new Date().toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                    app.status === 'accepted' ? 'bg-green-800 text-green-100' :
                    app.status === 'rejected' ? 'bg-red-800 text-red-100' :
                    'bg-yellow-800 text-yellow-100'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}