import React, { useState, useRef, useEffect } from "react";
import "./AIAssistant.css";
import { jwtDecode } from "jwt-decode";

export default function AiAssistant() {
  const [localProfile, setLocalProfile] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // ✅ load profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);

    fetch("http://localhost:5000/api/auth/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: decoded.email }),
    })
      .then((res) => res.json())
      .then((data) => setLocalProfile(data));
  }, []);


  useEffect(() => {
    if (!localProfile) return;

    setMessages([
      {
        role: "assistant",
        content: `Hello ${localProfile.fullName}! I’m your personal study assistant. How can I help you today?`,

      },
    ]);
  }, [localProfile]);

  // auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // call AI
  const callAI = async (messagesHistory) => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesHistory }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    return data.reply;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await callAI([...messages, userMsg]);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur serveur." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      <div className="assistant-header">
        <div className="assistant-avatar">🤖</div>
        <div>
          <h3 className="assistant-title">SkillLink AI Assistant</h3>
          <p className="assistant-status">En ligne • Optimisé pour votre profil</p>
        </div>
      </div>

      <div ref={scrollRef} className="assistant-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`assistant-row ${
              m.role === "user" ? "assistant-user" : "assistant-ai"
            }`}
          >
            <div
              className={`assistant-bubble ${
                m.role === "user" ? "bubble-user" : "bubble-ai"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="assistant-row assistant-ai">
            <div className="assistant-bubble bubble-ai typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="assistant-input-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Posez une question sur vos cours..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="assistant-input"
        />
        <button className="assistant-send" disabled={isLoading}>
          ➜
        </button>
      </form>
    </div>
  );
}
