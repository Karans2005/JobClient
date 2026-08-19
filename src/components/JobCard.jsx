import React from "react";

export default function JobCard({
  job,
  onView,
  onFavorite,
  favorite,
}) {
  return (
    <div className="list-item">
      <div>
        {job.image && (
          <img
            src={job.image}
            className="image-preview"
          />
        )}

        <strong>{job.title}</strong>

        <div className="small">
          {job.service} • 📍 {job.location}
        </div>

        <div className="small">
          💰{" "}
          {job.budgetMin || job.budgetMax
            ? `₹${job.budgetMin || 0} - ₹${
                job.budgetMax || job.budgetMin
              }`
            : "Not specified"}
        </div>
      </div>

      <div className="action-row">
        <button
          className="favorite"
          onClick={() => onFavorite(job.id)}
        >
          {favorite ? "❤️" : "🤍"}
        </button>

        <button
          className="btn"
          onClick={() => onView(job)}
        >
          View
        </button>
      </div>
    </div>
  );
}