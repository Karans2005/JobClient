import React from "react";

export default function Sidebar({
  setTab,
  favorites,
  unread,
  jobs,
  providers,
  applications,
  bookings,
  setJobs,
  setProviders,
  setBookings,
  setApplications,
  setFavorites,
  setNotifications,
  setChats,
}) {
  const resetDemo = () => {
    if (!window.confirm("Clear all JobPilot demo data?")) {
      return;
    }

    setJobs([]);
    setProviders([]);
    setBookings([]);
    setApplications([]);
    setFavorites([]);
    setNotifications([]);
    setChats([]);

    const keys = [
      "jp_jobs",
      "jp_providers",
      "jp_bookings",
      "jp_apps",
      "jp_favorites",
      "jp_notifications",
      "jp_chats",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  return (
    <aside>
      {/* Quick Actions */}
      <div className="card">
        <h4>Quick Actions</h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button className="btn" onClick={() => setTab("jobs")}>
            🔎 Find Jobs
          </button>

          <button className="btn" onClick={() => setTab("providers")}>
            👨‍🔧 Providers
          </button>

          <button className="btn" onClick={() => setTab("favorites")}>
            ❤️ Saved Jobs ({favorites.length})
          </button>

          <button className="btn" onClick={() => setTab("chat")}>
            💬 Chat
          </button>

          <button className="btn" onClick={() => setTab("notifications")}>
            🔔 Notifications ({unread})
          </button>

          <button className="btn" onClick={() => setTab("booking")}>
            📅 Book Service
          </button>

          <button className="btn" onClick={() => setTab("dashboard")}>
            📊 Dashboard
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="card">
        <h4>Live Stats</h4>

        <div className="small">
          Jobs: {jobs.length}
        </div>

        <div className="small">
          Providers: {providers.length}
        </div>

        <div className="small">
          Applications: {applications.length}
        </div>

        <div className="small">
          Bookings: {bookings.length}
        </div>

        <div className="small">
          Saved: {favorites.length}
        </div>
      </div>

      {/* Reset Demo */}
      <div className="card">
        <h4>Reset Demo</h4>

        <button className="btn ghost" onClick={resetDemo}>
          Reset Demo Data
        </button>
      </div>
    </aside>
  );
}