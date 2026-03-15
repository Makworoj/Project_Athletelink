import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { currentAthlete, currentScout } = useAuth();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', club: '', country: '' });

  useEffect(() => {
    Promise.all([
      fetch(`https://project-athletelink.onrender.com/opportunities/${id}`).then(res => res.json()),

      fetch('https://project-athletelink.onrender.com/applications')
        .then(res => res.ok ? res.json() : [])
        .catch(() => [])
    ])
      .then(([oppData, allApps]) => {
        setOpportunity(oppData);

        setEditForm({ 
          title: oppData.title || '', 
          club: oppData.club || '', 
          country: oppData.country || '' 
        });

        setApplications(allApps.filter(app => app.opportunity_id === Number(id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://project-athletelink.onrender.com/opportunities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      navigate('/opportunities');
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://project-athletelink.onrender.com/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updatedOpp = await res.json();
      setOpportunity(updatedOpp);
      setIsEditing(false);
      setToast({ message: 'Updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleApply = async () => {
    if (!currentAthlete) return navigate('/login');
    try {
      const res = await fetch('https://project-athletelink.onrender.com/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: currentAthlete.id,
          opportunity_id: Number(id),
          status: 'pending',
        }),
      });
      if (!res.ok) throw new Error('Failed to apply');
      const newApp = await res.json();
      setApplications(prev => [...prev, newApp]);
      setToast({ message: 'Application submitted!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await fetch(`https://project-athletelink.onrender.com/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedApp = await res.json();
      setApplications(prev => prev.map(app => app.id === appId ? updatedApp : app));
      setToast({ message: `Application ${newStatus}!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading details...</div>;
  if (!opportunity) return <div className="text-center py-20 text-red-400">Opportunity not found</div>;

  const userApplication = applications.find(a => a.athlete_id === currentAthlete?.id);
  const isOwner = currentScout && opportunity.scout_id === currentScout.id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link to="/opportunities" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
          ← Back to Opportunities
        </Link>
        
        {isOwner && (
          <div className="flex gap-6 items-center">
            <button onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-white text-sm transition">
              {isEditing ? 'Discard Changes' : 'Edit Post'}
            </button>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-sm transition">
              Delete Post
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Edit Opportunity</h2>
            <div className="grid gap-4">
              <input className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-white" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
              <input className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-white" value={editForm.club} onChange={e => setEditForm({...editForm, club: e.target.value})} />
              <input className="bg-slate-900 border border-slate-600 rounded-xl p-4 text-white" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
            </div>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold">
              Save Updates
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold mb-6 text-white">{opportunity.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-300 mb-10 pb-8 border-b border-slate-700">
              <p><span className="text-emerald-400 block text-xs font-bold uppercase">Club</span> {opportunity.club || '—'}</p>
              <p><span className="text-emerald-400 block text-xs font-bold uppercase">Location</span> {opportunity.country}</p>
              <p><span className="text-emerald-400 block text-xs font-bold uppercase">Posted By</span> {opportunity.scout?.name || "Verified Scout"}</p>
            </div>
          </>
        )}

        {currentAthlete && (
          <div className="mt-10 text-center">
            {userApplication ? (
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
                <p className="text-slate-500 text-xs font-black uppercase mb-4">Application Status</p>
                <div className={`inline-block px-12 py-5 rounded-2xl font-bold text-2xl uppercase ${
                  userApplication.status === 'accepted' ? 'text-green-400 border-2 border-green-500' : 
                  userApplication.status === 'rejected' ? 'text-red-400 border-2 border-red-500' : 'bg-slate-700 text-slate-300'
                }`}>
                  {userApplication.status === 'accepted' ? 'Scouted' : userApplication.status === 'rejected' ? 'Not Scouted' : 'Pending Review'}
                </div>
              </div>
            ) : (
              <button onClick={handleApply} className="bg-emerald-600 hover:bg-emerald-500 text-white px-16 py-5 rounded-2xl font-black text-2xl transition">
                Apply Now
              </button>
            )}
          </div>
        )}

        {isOwner && !isEditing && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Applicants ({applications.length})</h2>
            <div className="grid gap-4">
              {applications.map(app => (
                <div key={app.id} className="bg-slate-900 p-6 rounded-2xl flex justify-between items-center border border-slate-700">
                  <div>
                    <p className="text-xl font-bold text-white">{app.athlete?.name || "Athlete"}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{app.status}</span>
                  </div>
                  <div className="flex gap-4">
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusUpdate(app.id, 'accepted')} className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl text-sm font-bold">Accept</button>
                        <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-sm font-bold">Reject</button>
                      </>
                    )}
                    <Link to={`/athletes/${app.athlete_id}`} className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl text-sm font-bold">View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}