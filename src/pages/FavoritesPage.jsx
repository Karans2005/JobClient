import React from "react";

export default function FavoritesPage(props) {
  const {
    favorites,
    jobs,
    setSelectedJob,
  } = props;

  const favoriteJobs = jobs.filter((job) =>
    favorites.includes(job.id)
  );

  return (
    <div className="card">
      <h3>❤️ Saved Jobs</h3>

      {favoriteJobs.length === 0 ? (
        <div className="small">
          No favorite jobs yet. Tap 🤍 on a job.
        </div>
      ) : (
        favoriteJobs.map((job) => (
          <div className="list-item" key={job.id}>
            <div>
              <strong>{job.title}</strong>

              <div className="small">
                {job.service} • 📍 {job.location}
              </div>
            </div>

            <button
              className="btn"
              onClick={() => setSelectedJob(job)}
            >
              View
            </button>
          </div>
        ))
      )}
    </div>
  );
}
