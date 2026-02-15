import React, { useState } from "react";
import "./SmartMatching.css";

const MOCK_MATCHES = [
  {
    id: "s1",
    name: "Sarah Benali",
    avatar: "https://picsum.photos/200?random=10",
    studyField: "Data Science",
    strong: ["Statistics", "Python", "Machine Learning"],
    weak: ["React", "CSS"],
    score: 94,
    reason:
      "Sarah excels in Statistics (your weak point), while you can help her with React."
  },
  {
    id: "s2",
    name: "Lucas Martin",
    avatar: "https://picsum.photos/200?random=11",
    studyField: "Management IT",
    strong: ["SQL", "Databases", "Project Management"],
    weak: ["Python"],
    score: 88,
    reason:
      "Lucas masters databases (your weak point). Strong study compatibility."
  }
];

export default function Match() {
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState([]);

  const startSearch = () => {
    setIsSearching(true);
    setMatches([]);

    setTimeout(() => {
      setMatches(MOCK_MATCHES);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header-card">
        <h2>Smart Matching System</h2>
        <p>
          Automatically find the ideal study partners based on your mutual
          strengths and weaknesses.
        </p>

        <button
          className="main-btn"
          onClick={startSearch}
          disabled={isSearching}
        >
          {isSearching ? "AI matching in progress..." : "Find Partners"}
        </button>
      </div>

      {/* Loader */}
      {isSearching && (
        <div className="loader">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Analyzing 452 nearby student profiles...</p>
        </div>
      )}

      {/* Matches */}
      <div className="grid">
        {matches.map((m) => (
          <div key={m.id} className="card">
            <div className="card-header">
              <div className="user">
                <img src={m.avatar} alt="" />
                <div>
                  <h4>{m.name}</h4>
                  <small>{m.studyField}</small>
                </div>
              </div>
              <div className="score">{m.score}%</div>
            </div>

            <div className="reason">
              <i>"{m.reason}"</i>
            </div>

            <div className="skills">
              <div>
                <label>Can help you with</label>
                <div className="tags green">
                  {m.strong.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <label>Needs help with</label>
                <div className="tags red">
                  {m.weak.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="connect-btn">Connect</button>
              <button className="chat-btn">💬</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
