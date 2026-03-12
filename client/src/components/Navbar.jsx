import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-emerald-400">
            AthleteLink
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/athletes" className="hover:text-emerald-400">Athletes</Link>
            <Link to="/scouts" className="hover:text-emerald-400">Scouts</Link>
            <Link to="/opportunities" className="hover:text-emerald-400">Opportunities</Link>
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded transition">
              Register
            </Link>
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}