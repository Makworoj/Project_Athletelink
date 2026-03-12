import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const { currentAthlete, currentScout, logout } = useAuth();
  const navigate = useNavigate();

  const user = currentAthlete || currentScout;

  if (!user) {
    navigate(currentAthlete ? '/login' : '/scout-login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">My Profile</h1>
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6">
        <p className="text-lg">
          <span className="text-emerald-400 font-medium">Name:</span> {user.name}
        </p>
        <p className="text-lg">
          <span className="text-emerald-400 font-medium">Country:</span> {user.country || '—'}
        </p>
        {currentAthlete && (
          <>
            <p className="text-lg">
              <span className="text-emerald-400 font-medium">Sport:</span> {user.sport || '—'}
            </p>
            <p className="text-lg">
              <span className="text-emerald-400 font-medium">Age:</span> {user.age || '—'}
            </p>
          </>
        )}
        {currentScout && (
          <p className="text-lg">
            <span className="text-emerald-400 font-medium">Organization:</span> {user.organization || '—'}
          </p>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white"
      >
        Logout
      </button>
    </div>
  );
}