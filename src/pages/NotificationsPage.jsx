import React from "react";

export default function NotificationsPage(props) {
  const {
    notifications,
    setNotifications,
  } = props;

  return (
    <div className="card">
      <h3>🔔 Notifications</h3>

      {notifications.length === 0 && (
        <div className="small">
          No notifications.
        </div>
      )}

      {notifications.map((n) => (
        <div
          className="notice"
          key={n.id}
          onClick={() =>
            setNotifications((prev) =>
              prev.map((x) =>
                x.id === n.id
                  ? { ...x, read: true }
                  : x
              )
            )
          }
        >
          {!n.read ? "🟡" : "⚪"} {n.message}

          <div className="small">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        </div>
      ))}

      <button
        className="btn ghost"
        onClick={() => setNotifications([])}
      >
        Clear Notifications
      </button>
    </div>
  );
}