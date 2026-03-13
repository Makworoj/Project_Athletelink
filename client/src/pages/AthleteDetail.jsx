import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AthleteDetail() {
  //  useParams: Grabs the ':id' from the URL (e.g., /athlete/5).
  // Note: This 'id' is always a STRING by default.
  const { id } = useParams();

  //  useState Hooks:
  // athlete: Stores the main profile info (name, sport, etc.)
  const [athlete, setAthlete] = useState(null);
  // applications: Stores the list of jobs/scouts this athlete applied to.
  const [applications, setApplications] = useState([]);
  // loading: A "flag" to show a spinner while waiting for the API.
  const [loading, setLoading] = useState(true);

  //  useEffect (The Data Fetcher):
  // Dependency Array [id]: If the ID in the URL changes, this effect runs again.
  useEffect(() => {
    // Promise.all: Runs both fetch requests at the same time for better speed.
    Promise.all([
      fetch(`http://127.0.0.1:5555/athletes/${id}`).then(res => res.json()),
      fetch('http://127.0.0.1:5555/applications').then(res => res.json())
    ])
      .then(([athleteData, allApps]) => {
        // Update the athlete profile state
        setAthlete(athleteData);
        
        //  Filtering Logic:
        // 'allApps' contains applications for EVERY athlete. 
        // We only want the ones belonging to THIS athlete.
        // We use Number(id) because 'id' from useParams is a string, 
        // but 'app.athlete_id' from the database is usually a number.
        const myApps = allApps.filter(app => app.athlete_id === Number(id));
        
        setApplications(myApps);
        setLoading(false); // Stop showing the loading screen
      })
      .catch((err) => {
        console.error("Error fetching athlete details:", err);
        setLoading(false);
      });
  }, [id]);

  //  Guard Clauses (Conditional Rendering):
  // Prevents the app from trying to read 'athlete.name' if athlete is still null.
  if (loading) return <div className="text-center py-20 text-slate-400">Loading profile...</div>;
  if (!athlete) return <div className="text-center py-20 text-red-400">Athlete not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/athletes" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">
        ← Back to Athletes
      </Link>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 shadow-xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-2 text-white">{athlete.name}</h1>
          <p className="text-emerald-400 text-xl font-medium">{athlete.sport} • {athlete.country}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Application Status</h2>
        
        {/*  Empty State Check: Handles athletes who haven't applied to anything yet */}
        {applications.length === 0 ? (
          <div className="bg-slate-900/50 p-8 rounded-xl border border-dashed border-slate-700 text-center">
            <p className="text-slate-500 italic">No applications found for this athlete.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  {/*  Optional Chaining (?): 
                      Prevents crash if 'app.opportunity' is missing/undefined */}
                  <h3 className="font-bold text-xl text-white">
                    {app.opportunity?.title || "Unknown Opportunity"}
                  </h3>
                  <p className="text-slate-400">
                    {app.opportunity?.club || "Private Scout"} • {app.opportunity?.country}
                  </p>
                </div>

                {/*  Status Logic: Maps raw status strings to pretty UI colors */}
                <div className="text-right">
                  {app.status === 'accepted' ? (
                    <div className="flex flex-col items-end">
                      <span className="bg-green-500/20 text-green-400 border border-green-500 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">
                        Scouted
                      </span>
                      <p className="text-[10px] text-green-500 mt-2 font-bold italic underline">Accepted</p>
                    </div>
                  ) : app.status === 'rejected' ? (
                    <div className="flex flex-col items-end">
                      <span className="bg-red-500/20 text-red-400 border border-red-500 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">
                        Not Scouted
                      </span>
                      <p className="text-[10px] text-red-500 mt-2 font-bold italic underline">Rejected</p>
                    </div>
                  ) : (
                    <span className="bg-slate-700 text-slate-300 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}