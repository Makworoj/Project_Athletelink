import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const { currentAthlete, currentScout, logout, loginAthlete, loginScout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  // Initializes the form state with the current user's data to ensure fields aren't empty on load
  const [formData, setFormData] = useState(currentAthlete || currentScout || {});

  const user = currentAthlete || currentScout;
  const role = currentAthlete ? 'athletes' : 'scouts';

  // Safeguard that forces a redirect if no user session is detected
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdate = async () => {
    // Sends the modified formData to the specific API endpoint based on user role
    const res = await fetch(`http://127.0.0.1:5555/${role}/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      // Updates the global context and localStorage so the UI reflects changes everywhere
      currentAthlete ? loginAthlete(updatedUser) : loginScout(updatedUser);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    // Triggers a browser confirmation dialog to prevent accidental account deletion
    if (window.confirm("Are you sure? This cannot be undone.")) {
      const res = await fetch(`http://127.0.0.1:5555/${role}/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        // Wipes all local session data and sends the user back to the landing page
        logout();
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">My Profile</h1>
      
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            {/* Input fields for editing profile details */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name</label>
              <input 
                className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white"
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Country</label>
              <input 
                className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white"
                value={formData.country || ''} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
              />
            </div>

            {currentAthlete && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Sport</label>
                  <input 
                    className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white"
                    value={formData.sport || ''} 
                    onChange={e => setFormData({...formData, sport: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Age</label>
                  <input 
                    type="number"
                    className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white"
                    value={formData.age || ''} 
                    onChange={e => setFormData({...formData, age: e.target.value})} 
                  />
                </div>
              </>
            )}

            {currentScout && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Organization</label>
                <input 
                  className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white"
                  value={formData.organization || ''} 
                  onChange={e => setFormData({...formData, organization: e.target.value})} 
                />
              </div>
            )}

            <div className="pt-4">
              <button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg mr-2 transition">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="bg-slate-600 hover:bg-slate-500 px-6 py-2 rounded-lg transition">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Read-only view of the user profile */}
            <p className="text-lg"><span className="text-emerald-400 font-medium">Name:</span> {user.name}</p>
            <p className="text-lg"><span className="text-emerald-400 font-medium">Country:</span> {user.country || '—'}</p>
            {currentAthlete && (
              <>
                <p className="text-lg"><span className="text-emerald-400 font-medium">Sport:</span> {user.sport || '—'}</p>
                <p className="text-lg"><span className="text-emerald-400 font-medium">Age:</span> {user.age || '—'}</p>
              </>
            )}
            {currentScout && (
              <p className="text-lg"><span className="text-emerald-400 font-medium">Organization:</span> {user.organization || '—'}</p>
            )}
            <button onClick={() => setIsEditing(true)} className="bg-emerald-600/20 text-emerald-400 border border-emerald-400/50 px-4 py-1 rounded-md hover:bg-emerald-600/30 transition">Edit Profile</button>
          </div>
        )}
      </div>

      {/* Footer actions for session management and account removal */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
        <button 
          onClick={logout} 
          className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-xl font-medium transition"
        >
          Logout
        </button>
        <button 
          onClick={handleDelete} 
          className="w-full sm:w-auto bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 px-8 py-3 rounded-xl font-medium transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}