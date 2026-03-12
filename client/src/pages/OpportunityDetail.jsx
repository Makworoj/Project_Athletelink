// src/pages/OpportunityDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { currentScout } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState(null);

  // Confirmation modal
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5555/opportunities/${id}`).then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json()),
    ])
      .then(([oppData, allApps]) => {
        setOpportunity(oppData);
        const oppApps = allApps.filter(app => app.opportunity_id === Number(id));
        setApplications(oppApps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const requestStatusChange = (appId, newStatus) => {
    const msg = newStatus === 'accepted' ? 'Accept this application?' : 'Reject this application?';
    setConfirmAction({ appId, newStatus, message: msg });
  };

  const confirmStatusChange = () => {
    if (!confirmAction) return;
    const { appId, newStatus } = confirmAction;

    fetch(`http://127.0.0.1:5555/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
      })
      .then(updated => {
        setApplications(prev => prev.map(a => a.id === appId ? updated : a));
        setToast({
          message: `Application ${newStatus === 'accepted' ? 'accepted' : 'rejected'}!`,
          type: 'success'
        });
        setConfirmAction(null);
      })
      .catch(err => {
        setToast({ message: err.message, type: 'error' });
        setConfirmAction(null);
      });
  };

  const cancelConfirm = () => setConfirmAction(null);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!opportunity) return <div className="text-center py-20 text-red-400">Not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/opportunities" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">
        ← Back to Opportunities
      </Link>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-4">{opportunity.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 mb-10">
          <p><strong className="text-emerald-400">Club:</strong> {opportunity.club || '—'}</p>
          <p><strong className="text-emerald-400">Country:</strong> {opportunity.country || '—'}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">
          Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <p className="text-slate-400 italic">No applications received yet.</p>
        ) : (
          <div className="space-y-5">
            {applications.map(app => (
              <div
                key={app.id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex justify-between items-start gap-6"
              >
                <div>
                  <p className="font-medium text-lg">Athlete ID: {app.athlete_id}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Applied {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <span className={`px-6 py-2 rounded-full text-sm font-semibold uppercase ${
                    app.status === 'accepted' ? 'bg-green-800 text-green-100' :
                    app.status === 'rejected' ? 'bg-red-800 text-red-100' :
                    'bg-yellow-800 text-yellow-100'
                  }`}>
                    {app.status}
                  </span>

                  {currentScout && app.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => requestStatusChange(app.id, 'accepted')}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => requestStatusChange(app.id, 'rejected')}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">{confirmAction.message}</h3>
            <p className="text-slate-400 mb-8">This cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelConfirm}
                className="px-6 py-3 text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-6 py-3 rounded-lg font-medium text-white transition ${
                  confirmAction.newStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmAction.newStatus === 'accepted' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}