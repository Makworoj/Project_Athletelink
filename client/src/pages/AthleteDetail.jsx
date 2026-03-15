import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AthleteDetail() {
  const { id } = useParams();

  const [athlete, setAthlete] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`https://project-athletelink.onrender.com/athletes/${id}`).then(res => res.json()),
      fetch('https://project-athletelink.onrender.com/applications').then(res => res.json())
    ])
      .then(([athleteData, allApps]) => {

        setAthlete(athleteData);

        const myApps = allApps.filter(app => app.athlete_id === Number(id));

        setApplications(myApps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching athlete details:", err);
        setLoading(false);
      });
  }, [id]);

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
          <p className="text-emerald-400 text-xl font-medium">
            {athlete.sport} • {athlete.country}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-slate-300">

          <div>
            <p className="text-xs text-emerald-400 uppercase font-bold">Position</p>
            <p>{athlete.position || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-emerald-400 uppercase font-bold">Height</p>
            <p>{athlete.height || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-emerald-400 uppercase font-bold">Weight</p>
            <p>{athlete.weight || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-emerald-400 uppercase font-bold">Age</p>
            <p>{athlete.age || "—"}</p>
          </div>

        </div>

        <div className="mb-10 pt-6 border-t border-slate-700">
          <h2 className="text-xl font-semibold text-emerald-400 mb-2">
            Achievements
          </h2>

          <p className="text-slate-300">
            {athlete.achievements || "No achievements listed yet."}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Application Status</h2>

        {applications.length === 0 ? (
          <div className="bg-slate-900/50 p-8 rounded-xl border border-dashed border-slate-700 text-center">
            <p className="text-slate-500 italic">No applications found for this athlete.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {app.opportunity?.title || "Unknown Opportunity"}
                  </h3>

                  <p className="text-slate-400">
                    {app.opportunity?.club || "Private Scout"} • {app.opportunity?.country}
                  </p>
                </div>

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