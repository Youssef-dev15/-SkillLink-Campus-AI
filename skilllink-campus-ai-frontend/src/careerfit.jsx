import React, { useState, useEffect } from "react";
import "./CareerPlanner.css";

const PROFILE = {
  targetJob: "Machine Learning Engineer"
};

const fakeAnalysis = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 55,
        missing: ["Deep Learning", "MLOps", "SQL", "Advanced Statistics"],
        roadmap: [
          {
            title: "Data Science Foundations",
            duration: "3 months",
            tasks: [
              "Master NumPy & Pandas",
              "ML statistics",
              "Complete EDA project"
            ]
          },
          {
            title: "Deep Learning",
            duration: "4 months",
            tasks: [
              "Neural networks",
              "PyTorch/TensorFlow",
              "Advanced AI project"
            ]
          }
        ]
      });
    }, 1200);
  });
};

export default function CreerFit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(PROFILE.targetJob);

  const run = async () => {
    setLoading(true);
    const res = await fakeAnalysis();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <div className="roadmap-root">
      <div className="roadmap-container">

        <header className="roadmap-header">
          <div>
            <h2>Career Goal & Roadmap</h2>
            <p>Personalized analysis of your professional growth</p>
          </div>

          <div className="roadmap-actions">
            <input value={job} onChange={(e) => setJob(e.target.value)} />
            <button
              style={{ height: "40px", paddingBottom: "15px", paddingTop: "9px" }}
              onClick={run}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </header>

        {loading && <div className="roadmap-loading">Analysis in progress...</div>}

        {data && !loading && (
          <div className="roadmap-layout">

            {/* LEFT SIDE */}
            <aside className="roadmap-left">
              <div className="compat-card">
                <h4>Compatibility</h4>
                <div className="compat-score">{data.score}%</div>
                <div className="compat-bar">
                  <div
                    className="compat-fill"
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>

              <div className="missing-card">
                <h4 className="missing-title">Skills to acquire</h4>
                <ul className="missing-list">
                  {data.missing.map((s, i) => (
                    <li key={i} className="missing-item">{s}</li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* RIGHT SIDE */}
            <main className="roadmap-right">
              <h3>🛣️ Learning roadmap</h3>

              <div className="timeline">
                {data.roadmap.map((step, i) => (
                  <div key={i} className="timeline-step">

                    <div className="timeline-dot" />

                    <div className="timeline-card">
                      <div className="step-header">
                        <h5>{step.title}</h5>
                        <span>{step.duration}</span>
                      </div>

                      <ul>
                        {step.tasks.map((t, j) => (
                          <li key={j}>✅ {t}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>
            </main>

          </div>
        )}
      </div>
    </div>
  );
}
