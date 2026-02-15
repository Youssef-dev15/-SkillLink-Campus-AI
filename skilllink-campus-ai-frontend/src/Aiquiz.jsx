import React, { useState } from "react";
import "./quiz.css";

const Quiz = () => {
  const [state, setState] = useState("idle");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExp, setShowExp] = useState(false);

  const startQuiz = async () => {
    if (!topic) return;

    setState("loading");

    const res = await fetch("http://localhost:5000/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    setQuestions(data);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowExp(false);
    setState("active");
  };

  const answer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);

    if (i === questions[index].correctAnswer) {
      setScore(score + 1);
    }
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setShowExp(false);
    } else {
      setState("finished");
    }
  };

  if (state === "idle") {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h1 className="quiz-title">AI Quiz</h1>
          <p className="quiz-subtitle">Generate a quiz on any topic.</p>

          <div className="quiz-input-row">
            <input
              className="quiz-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="React, Biology, History..."
            />
            <button className="quiz-generate-button" onClick={startQuiz}>
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">
          <div className="quiz-spinner"></div>
          <p>Generating quiz…</p>
        </div>
      </div>
    );
  }

  if (state === "active") {
    const q = questions[index];
    const progress = ((index + 1) / questions.length) * 100;

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            Question {index + 1} / {questions.length}
          </div>

          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <h2 className="quiz-question">{q.question}</h2>

          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = "quiz-option-button";

              if (selected !== null) {
                if (i === q.correctAnswer) cls += " quiz-option-correct";
                else if (i === selected) cls += " quiz-option-wrong";
                else cls += " quiz-option-disabled";
              }

              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={selected !== null}
                  className={cls}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExp && (
            <div className="quiz-explanation">
              <p>{q.explanation}</p>
              <button className="quiz-next-button" onClick={next}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (state === "finished") {
    const percent = Math.round((score / questions.length) * 100);

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h1>Quiz Finished</h1>
          <p>Score: {score}</p>
          <p>Accuracy: {percent}%</p>
          <button
            className="quiz-restart-button"
            onClick={() => setState("idle")}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
