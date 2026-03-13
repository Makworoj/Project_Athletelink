import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentAthlete, currentScout } = useAuth(); 

  return (
    <div className="text-center py-24 px-4">
      {/* Greets the user personally if logged in, otherwise shows the app name */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-400">
        {currentAthlete ? `Welcome, ${currentAthlete.name}!` : 
         currentScout ? `Welcome, ${currentScout.name}!` : 
         'AthleteLink'}
      </h1>

      <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12">
        {/* Dynamic subtitle based on whether the user is an athlete, scout, or guest */}
        {currentAthlete ? 'Explore new spots and track your applications.' :
         currentScout ? 'Discover top talent and manage opportunities.' :
         'Connecting athletes with scouts and real opportunities worldwide.'}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
        {currentAthlete && (
          /* Athlete View: Focuses on finding work and career growth */
          <Link
            to="/opportunities"
            className="bg-emerald-600 hover:bg-emerald-700 px-10 py-5 rounded-xl text-xl font-medium transition"
          >
            Browse Opportunities
          </Link>
        )}

        {currentScout && (
          /* Scout View: Provides access to both the talent pool and job management */
          <>
            <Link
              to="/athletes"
              className="bg-emerald-600 hover:bg-emerald-700 px-10 py-5 rounded-xl text-xl font-medium transition"
            >
              View Athletes
            </Link>
            <Link
              to="/opportunities"
              className="bg-slate-700 hover:bg-slate-600 px-10 py-5 rounded-xl text-xl font-medium transition"
            >
              Manage Opportunities
            </Link>
          </>
        )}

        {!currentAthlete && !currentScout && (
          /* Guest View: Standard entry points for new users */
          <>
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 px-10 py-5 rounded-xl text-xl font-medium transition">
              Register
            </Link>
            <Link to="/login" className="bg-slate-700 hover:bg-slate-600 px-10 py-5 rounded-xl text-xl font-medium transition">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}