import React from "react";
import ProviderCard from "../components/ProviderCard";

export default function ProvidersPage(props) {
  const {
    addProvider,
    providers,
    setSelectedProvider,
    pname,
    setPname,
    pskills,
    setPskills,
    pexperience,
    setPexperience,
    pbio,
    setPbio,
    pavailable,
    setPavailable,
    setChatProvider,
  } = props;

  return (
    <div className="card">
      <h3>Register Service Provider</h3>

      <div className="two-col">
        <div>
          <label className="small">Name</label>

          <input
            value={pname}
            onChange={(e) => setPname(e.target.value)}
            placeholder="Ajay Electrician"
          />
        </div>

        <div>
          <label className="small">Experience</label>

          <input
            value={pexperience}
            onChange={(e) =>
              setPexperience(e.target.value)
            }
            placeholder="3 years"
          />
        </div>
      </div>

      <label className="small">
        Skills (comma separated)
      </label>

      <input
        value={pskills}
        onChange={(e) => setPskills(e.target.value)}
        placeholder="Electrician, AC Repair"
      />

      <label className="small">About</label>

      <textarea
        value={pbio}
        onChange={(e) => setPbio(e.target.value)}
        placeholder="Short professional bio"
        rows="3"
      />

      <label className="small">Availability</label>

      <select
        value={pavailable}
        onChange={(e) =>
          setPavailable(e.target.value)
        }
        style={{
          padding: 10,
          borderRadius: 8,
          width: "100%",
        }}
      >
        <option>Available</option>
        <option>Busy</option>
        <option>Offline</option>
      </select>

      <div className="action-row">
        <button
          className="btn"
          onClick={addProvider}
        >
          Register Provider
        </button>
      </div>

      <h4>Providers</h4>

      {providers.length === 0 && (
        <div className="small">
          No providers yet.
        </div>
      )}

      {providers.map((p) => (
        <ProviderCard
          key={p.id}
          provider={p}
          onProfile={setSelectedProvider}
          onChat={setChatProvider}
        />
      ))}
    </div>
  );
}