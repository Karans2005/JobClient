import React from "react";

export default function BookingPage(props) {
  const {
    jobs,
    providers,
    bookings,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    proposedPrice,
    setProposedPrice,
    createBooking,
    markComplete,
    rateBooking,
  } = props;

  return (
    <div className="card">
      <h3>Booking Management</h3>

      <label className="small">Select Job</label>

      <select
        id="selJob"
        style={{
          padding: 10,
          width: "100%",
          borderRadius: 8,
        }}
      >
        {jobs.map((j) => (
          <option value={j.id} key={j.id}>
            {j.title}
          </option>
        ))}
      </select>

      <label className="small">
        Select Provider
      </label>

      <select
        id="selProv"
        style={{
          padding: 10,
          width: "100%",
          borderRadius: 8,
        }}
      >
        {providers.map((p) => (
          <option value={p.id} key={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="two-col">
        <div>
          <label className="small">Date</label>

          <input
            type="date"
            value={bookingDate}
            onChange={(e) =>
              setBookingDate(e.target.value)
            }
          />
        </div>

        <div>
          <label className="small">Time</label>

          <input
            type="time"
            value={bookingTime}
            onChange={(e) =>
              setBookingTime(e.target.value)
            }
          />
        </div>
      </div>

      <label className="small">
        Agreed Price ₹
      </label>

      <input
        type="number"
        value={proposedPrice}
        onChange={(e) =>
          setProposedPrice(e.target.value)
        }
        placeholder="1500"
      />

      <div className="action-row">
        <button
          className="btn"
          onClick={() => {
            const jobId = Number(
              document.getElementById("selJob").value
            );

            const providerId = Number(
              document.getElementById("selProv").value
            );

            if (!jobId || !providerId) {
              return alert("Choose both");
            }

            createBooking({
              jobId,
              providerId,
            });
          }}
        >
          Create Booking
        </button>
      </div>

      <h4>Bookings</h4>

      {bookings.length === 0 && (
        <div className="small">
          No bookings yet.
        </div>
      )}

      {bookings.map((b) => {
        const job =
          jobs.find((j) => j.id === b.jobId) || {
            title: "Job removed",
          };

        const prov =
          providers.find(
            (p) => p.id === b.providerId
          ) || {
            name: "Provider removed",
          };

        return (
          <div
            className="list-item"
            key={b.bookingId}
          >
            <div>
              <strong>
                {prov.name} — {job.title}
              </strong>

              <div className="small">
                📅 {b.date} • ⏰ {b.time} • 💰 ₹
                {b.price || 0}
              </div>

              <span
                className={`badge ${b.status}`}
              >
                {b.status.toUpperCase()}
              </span>

              {b.rating && (
                <div className="small">
                  Rating: {"⭐".repeat(b.rating)}
                </div>
              )}
            </div>

            <div className="action-row">
              {b.status !== "completed" && (
                <button
                  className="btn"
                  onClick={() =>
                    markComplete(b.bookingId)
                  }
                >
                  Complete
                </button>
              )}

              {b.status === "completed" &&
                !b.rating && (
                  <select
                    onChange={(e) =>
                      rateBooking(
                        b.bookingId,
                        e.target.value
                      )
                    }
                    defaultValue=""
                    style={{
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <option value="" disabled>
                      Rate ⭐
                    </option>

                    <option value="5">
                      ⭐⭐⭐⭐⭐
                    </option>

                    <option value="4">
                      ⭐⭐⭐⭐
                    </option>

                    <option value="3">
                      ⭐⭐⭐
                    </option>

                    <option value="2">
                      ⭐⭐
                    </option>

                    <option value="1">
                      ⭐
                    </option>
                  </select>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}