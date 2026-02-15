import React, { useState, useEffect } from "react";
import "./events.css";

const API = "http://localhost:5000/api/events";

function EventsView() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    type: "Study",
    location: "",
    description: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Loading error");
        setLoading(false);
      });
  }, []);

  const isPastDate = (date) => {
    const today = new Date();
    const chosen = new Date(date);
    today.setHours(0,0,0,0);
    return chosen < today;
  };

  const addEvent = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date) return;

    if (isPastDate(form.date)) {
      alert("The date must be in the future");
      return;
    }

    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(form)
    });

    const newEvent = await res.json();

    setEvents([...events, newEvent].sort((a, b) =>
      a.date.localeCompare(b.date)
    ));

    setForm({ title: "", date: "", type: "Study", location: "", description: "" });
    setShowForm(false);
  };

  const removeEvent = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    setEvents(events.filter(e => e._id !== id));
  };

  const icon = (type) => {
    switch (type) {
      case "Exam": return "📝";
      case "Study": return "📚";
      case "Workshop": return "🛠️";
      case "Hackathon": return "💻";
      default: return "📅";
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="events-page">

      <header className="events-header">
        <div>
          <h1>Campus Events</h1>
          <p>Manage your academic calendar and opportunities</p>
        </div>
        <button className="btn-pri" onClick={() => setShowForm(true)}>
          + Add event
        </button>
      </header>

      <div className="events-layout">

        <div className="events-list">
          {events.length === 0 && (
            <p>No events available</p>
          )}

          {events.map((e) => (
            <div className="event-card" key={e._id}>
              <div className="event-date">
                <span className="event-month">
                  {new Date(e.date).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="event-day">
                  {new Date(e.date).getDate()}
                </span>
              </div>

              <div className="event-content">
                <div className="event-type">
                  {icon(e.type)} {e.type}
                </div>
                <h3>{e.title}</h3>
                <p>📍 {e.location}</p>
              </div>

              <div className="event-actions">
                <button className="btn-outline" onClick={() => setSelectedEvent(e)}>Details</button>
                <button className="btn-delete" onClick={() => removeEvent(e._id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="events-info">
          <h3>Did you know?</h3>
          <p>
            Participating in at least one hackathon per year increases your
            hiring chances by 40% according to our AI analysis.
          </p>
        </aside>

      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add an event</h2>
              <button style={{ background: "none", color: "red" }}
                onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={addEvent} className="modal-form">

              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <div className="modal-row">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option>Exam</option>
                  <option>Study</option>
                  <option>Workshop</option>
                  <option>Hackathon</option>
                </select>
              </div>

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="modal-actions">
                <button type="button" className="btn-can"
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-pri">
                  Confirm
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal details-modal">

            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button
                style={{ background: "none", color: "red" }}
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>

            <div className="details-body">
              <p><strong>Type:</strong> {icon(selectedEvent.type)} {selectedEvent.type}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString("en-US")}</p>
              <p><strong>Location:</strong> {selectedEvent.location || "—"}</p>
              <p><strong>Description:</strong></p>
              <p className="details-desc">
                {selectedEvent.description || "No description"}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-can"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default EventsView;
