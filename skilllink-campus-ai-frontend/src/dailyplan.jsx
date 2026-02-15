import React, { useState, useEffect } from "react";
import "./Daily.css";

function Daily() {
  const API = "http://localhost:5000/api/daily";
  const token = localStorage.getItem("token");

  const apiFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
  };

  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [newText, setNewText] = useState("");
  const [time, setTime] = useState("09:00");

  // LOAD
  useEffect(() => {
    apiFetch(API)
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(err => console.error("Load error:", err));
  }, []);

  // ADD
  const addTask = async () => {
    if (!newText.trim()) return;

    try {
      const res = await apiFetch(API, {
        method: "POST",
        body: JSON.stringify({ text: newText, time, priority })
      });

      if (!res.ok) throw new Error("Add failed");

      const task = await res.json();
      setTasks(prev => [task, ...prev]);
      setNewText("");

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const removeTask = async (id) => {
    if (!id) return;

    try {
      await apiFetch(`${API}/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE
  const toggleTask = async (id) => {
    if (!id) return;

    try {
      const res = await apiFetch(`${API}/${id}`, { method: "PATCH" });

      if (!res.ok) throw new Error("Toggle failed");

      const updated = await res.json();
      setTasks(prev =>
        prev.map(t => (t._id === id ? updated : t))
      );

    } catch (err) {
      console.error(err);
    }
  };

  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  return (
    <div className="dp-container">

      <div className="dp-header">
        <div>
          <h1>Daily Plan</h1>
          <p>Organize your success, one task at a time.</p>
        </div>

        <div className="dp-progress">
          <span>PROGRESS </span>
          <strong>{progress}%</strong>
          <div className="circle">{doneCount}/{tasks.length}</div>
        </div>
      </div>

      <div className="dp-grid">

        {/* ADD TASK */}
        <div className="dp-card">
          <h3>➕ New Task</h3>

          <input
            placeholder="Ex: Review Python..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
          />

          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="dp-select"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />

          <button onClick={addTask}>
            Add to schedule
          </button>
        </div>

        {/* TASK LIST */}
        <div className="dp-list">
          {tasks.map((t, i) => (
            <div key={t._id || i} className={`task ${t.done ? "done" : ""}`}>

              <div className="check" onClick={() => toggleTask(t._id)}>
                {t.done ? "✓" : ""}
              </div>

              <div className="task-info">
                <strong>{t.text || "Untitled"}</strong>
                <span>🕒 {t.time}</span>
              </div>

              <span className={`badge ${t.priority}`}>
                {t.priority}
              </span>

              <button
                className="delete-btn"
                onClick={() => removeTask(t._id)}
              >
                🗑
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Daily;
