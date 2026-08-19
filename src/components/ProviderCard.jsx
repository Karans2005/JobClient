import React from "react";

export default function ProviderCard({
  provider,
  onProfile,
  onChat,
}) {
  return (
    <div className="list-item">
      <div>
        <strong>👤 {provider.name}</strong>

        {provider.verified && (
          <span className="verified">
            ✓ Verified
          </span>
        )}

        <div className="small">
          🛠 {provider.skills.join(", ")}
        </div>

        <div className="small">
          ⭐ {provider.rating} • {provider.experience} •{" "}
          {provider.reviews || 0} reviews •{" "}
          <span className="pill">
            {provider.availability}
          </span>
        </div>
      </div>

      <div className="action-row">
        <button
          className="btn"
          onClick={() => onProfile(provider)}
        >
          Profile
        </button>

        <button
          className="btn"
          onClick={() => onChat(provider)}
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
}