import "./howItWorks.css";

const steps = [
  {
    number: "01",
    title: "Sign Up & Profile Creation",
    description:
      "The student signs up and completes their academic and professional profile. This data becomes the foundation for all intelligent analysis."
  },
  {
    number: "02",
    title: "AI-Powered Analysis",
    description:
      "The AI analyzes the profile to identify strengths and weaknesses, understand goals, and assess academic and career needs."
  },
  {
    number: "03",
    title: "Smart Matching & Recommendations",
    description:
      "The platform automatically suggests study partners, collaborative groups, learning resources, and relevant events."
  },
  {
    number: "04",
    title: "Learning & Collaboration",
    description:
      "Students collaborate via chat, follow personalized study plans, and use the AI assistant to improve efficiently."
  },
  {
    number: "05",
    title: "Continuous Career Guidance",
    description:
      "Students can evaluate career compatibility, follow a skills roadmap, and adjust goals as they progress."
  }
];

export default function HowItWorks() {
  return (
    <section className="how-section">
      <h1 className="how-title">How It Works</h1>
      <p className="how-subtitle">
        A simple and intelligent process designed for student success
      </p>

      <div className="how-steps">
        {steps.map((step, index) => (
          <div className="how-card" key={index}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="why-section">
        <h2>🎓 Why SkillLink Campus AI?</h2>
        <ul>
          <li>AI at the core of the solution</li>
          <li>Solves real student problems</li>
          <li>Combines learning, collaboration, and career growth</li>
          <li>Scalable and adapted to modern campuses</li>
        </ul>
      </div>
    </section>
  );
}
