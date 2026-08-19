import React from "react";

export default function ApplicationsPage(props) {
  const {
    applications,
    providerName,
    updateApplication,
    jobs,
  } = props;

  return (
    <div className="card">
      <h3>Application Management</h3>

      {applications.length === 0 && (
        <div className="small">
          No applications yet.
        </div>
      )}

      {applications.map((a) => {
        const job = jobs.find(
          (j) => j.id === a.jobId
        );

        return (
          <div
            className="list-item"
            key={a.appId}
          >
            <div>
              <strong>
                {job ? job.title : "Job removed"}
              </strong>

              <div className="small">
                Provider: {providerName(a.providerId)} •{" "}
                Proposed:{" "}
                {a.proposedPrice
                  ? `₹${a.proposedPrice}`
                  : "Not specified"}
              </div>

              <span
                className={`badge ${a.status}`}
              >
                {a.status.toUpperCase()}
              </span>
            </div>

            <div className="action-row">
              {a.status === "pending" && (
                <>
                  <button
                    className="btn"
                    onClick={() =>
                      updateApplication(
                        a.appId,
                        "accepted"
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="btn ghost"
                    onClick={() =>
                      updateApplication(
                        a.appId,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}