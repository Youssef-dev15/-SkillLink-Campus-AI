import React, { useState, useEffect } from 'react';
import './dash.css';
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Dash = () => {

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000/api/recommend/dashboard";

  const [localProfile, setLocalProfile] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [events, setEvents] = useState([]);

  /* ---------------- FETCH DASHBOARD DATA ---------------- */

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);

    fetch(API, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setLocalProfile(data.profile);
        setDailyTasks(data.tasks || []);
        setEvents(data.events || []);
      })
      .catch(err => console.error("Dashboard fetch error:", err));

  }, []);

  /* ---------------- LOADING ---------------- */

  if (!localProfile) {
    return (
      <div className="dash-root">
        <h2 style={{ padding: 40 }}>Loading dashboard...</h2>
      </div>
    );
  }

  /* ---------------- PROGRESS ---------------- */

  const progress =
    dailyTasks.length === 0
      ? 0
      : (dailyTasks.filter(t => t.done).length / dailyTasks.length) * 100;

  /* ---------------- UI ---------------- */

  return (
    <div className="dash-root">

      {/* HERO */}
      <div className="dash-hero">
        <div className="dash-hero-text">
          <h1>Boost your learning! 🚀</h1>
          <p>Find study partners, get AI advice, and build your roadmap.</p>
        </div>
      </div>

      <div className="dash-grid">

        {/* DAILY PLAN */}
        <div className="dash-card dash-plan">
          <div className="dash-card-header">
            <div>
              <h3>Today's Plan</h3>
              <p>Tracking goals</p>
            </div>
            <div className="dash-progress-text">
              <Link to='/Daily-plan'>manage all ➜</Link><br />
              <>{Math.round(progress)}%</>
            </div>
          </div>

          <div className="dash-progress-bar">
            <div
              className="dash-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="dash-task-list">
            {dailyTasks.slice(0, 3).map((t) => (
              <div key={t._id} className={`dash-task ${t.done ? 'done' : ''}`}>
                <div className="dash-task-left">
                  <div className="dash-checkbox">
                    {t.done && "✓"}
                  </div>
                  <span>{t.text}</span>
                </div>
                <span className="dash-time">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECTS */}
        <div className="dash-card">
          <h3>Subject Focus</h3>

          <div className="dash-subject-section">
            <p>Strengths</p>
            <div className="dash-tags green">
              {(localProfile.strongSubjects || []).map(s => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>

          <div className="dash-subject-section">
            <p>Needs Improvement</p>
            <div className="dash-tags red">
              {(localProfile.weakSubjects || []).slice(0, 3).map(s => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* EVENTS */}
        <div className="dash2-card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Recommended Events</h3>
          </div>

          {events.slice(0, 2).map(ev => (
            <div key={ev._id} className="dash2-event">
              <div className="dash2-date">
                <span>{new Date(ev.date).getDate()}</span>
                <span>{new Date(ev.date).toLocaleString('en', { month: 'short' })}</span>
              </div>

              <div>
                <p className="dash2-event-title">{ev.title}</p>
                <p className="dash2-event-type">{ev.type}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="dash-card">
          <h3>Quick Actions</h3>

          <Link to='/Quiz'>
            <button className="action-btn blue">Request a Quiz</button>
          </Link>

          <Link to='/Career-Fit'>
            <button className="action-btn gray">My Roadmap</button>
          </Link>

          <Link to='/Smart-Matching'>
            <button className="action-btn amber">Find Partners</button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dash;
