import "./features.css"

const features = [
  {
    title: "Intelligent Student Profile",
    description:
      "Personalized profiles including skills, strengths, weaknesses, goals, and availability."
  },
  {
    title: "Smart Matching (AI Core)",
    description:
      "AI-powered matching system that connects students based on complementary skills and schedules."
  },
  {
    title: "Chat & Collaboration",
    description:
      "Real-time chat, group workspaces, resource sharing, and study session planning."
  },
  {
    title: "AI Study Assistant",
    description:
      "Personalized study plans, exercises, summaries, and intelligent feedback."
  },
  {
    title: "Skills & Career Fit",
    description:
      "Career compatibility score, missing skills analysis, and personalized roadmap."
  },
  {
    title: "Events & Competitions",
    description:
      "AI-recommended hackathons, workshops, and campus events based on interests."
  }
];

export default function Features() {
  return (
    <section className="features-section">
      <h1 className="features-title">Platform Features</h1>
      <p className="features-subtitle">
        Everything you need for smarter learning and collaboration
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
