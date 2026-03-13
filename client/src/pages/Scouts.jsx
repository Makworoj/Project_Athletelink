import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Scouts() {
  // State to hold the full list of scouts retrieved from the database
  const [scouts, setScouts] = useState([]);
  // Tracks the loading state to ensure a smooth UI transition while data is being fetched
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initiates an API call to the backend scouts endpoint on component mount
    fetch('http://127.0.0.1:5555/scouts')
      .then(res => res.json())
      .then(data => {
        // Updates state with the array of scout objects and turns off the loading indicator
        setScouts(data);
        setLoading(false);
      })
      .catch(err => {
        // Logs errors to the console to help with debugging connection issues
        console.error(err);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this effect runs only once when the page loads

  // Renders a simple loading message while the network request is in flight
  if (loading) return <div className="text-center py-20 text-slate-400">Loading scouts...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header section containing the title and the action button to add a new scout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-400">Scouts</h1>
        <Link
          to="/scouts/new"
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Add New Scout
        </Link>
      </div>

      

      {/* Grid container that adjusts columns based on screen size (1 col on mobile, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scouts.map(scout => (
          <div
            key={scout.id} // Essential React key for efficient DOM updates
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition-all shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2 text-white">{scout.name}</h3>
            
            {/* Informational section providing quick context on the scout's professional background */}
            <div className="space-y-2 text-sm text-slate-400">
              <p>
                <span className="text-emerald-400 font-medium">Organization:</span> {scout.organization || 'Independent'}
              </p>
              <p>
                <span className="text-emerald-400 font-medium">Country:</span> {scout.country || 'International'}
              </p>
            </div>

            {/* Dynamic link that directs the user to the specific detail page for this scout */}
            <Link
              to={`/scouts/${scout.id}`}
              className="mt-4 inline-block text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              View Scout Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}