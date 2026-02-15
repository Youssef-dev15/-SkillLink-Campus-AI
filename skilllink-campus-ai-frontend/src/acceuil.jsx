import React from "react";
import "./acc.css";
import NewMatch from "./NewMatch";
import{ Link  } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
export default function Acceuil(){
    return <>
   <section className="hero">
        <div className="hero-left">
          <span className="badge">⚡ THE FUTURE OF CAMPUS COLLABORATION</span>

          <h1>
            Level up your <br />
            <span>Academic Journey</span> with AI.
          </h1>

          <p>
            Connect with study peers, get personalized career roadmaps,
            and boost your performance with our intelligent campus companion.
          </p>

          <div className="buttons">
            <Link to='/login'><button className="primary">Get Started Today →</button></Link>
          </div>

          <div className="features">
            <span>✔ Peer Matching</span>
            <span>✔ Career AI</span>
            <span>✔ Study Buddy</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-wrapper">
            <img
              src="grw.png"
              alt="students"
            />
            <NewMatch />
          </div>
        </div>
      </section>
      <section className="cta">
      <h1>Everything you need to succeed on campus.</h1>
      <p style={{color:"gray"}}>
      Built for students, powered by the latest AI technologies to make campus life smarter.
      </p>
    </section>
      <section>
        <div className="feature-grid">
          <div className="card">
            
            <img src="/public/comp.png"  />
            <h3>Smart Peer Matching</h3>
            <p>
            Our AI connects you with students who excel in your weak subjects. Learn faster through collaboration.
            </p>
                  </div>

          <div className="card">
            <img src="/public/ai.png"  />
            <h3>AI Study Assistant</h3>
            <p>
            Get instant help with summaries, study plans, and mock exercises tailored to your curriculum
            </p>
                </div>

          <div className="card">
          <img src="/public/tas.png"  />
            <h3>Career Orientation</h3>
            <p>
            Discover your skill gaps and get a 4-week personalized roadmap to land your dream job
            </p>
                   </div>
        </div>
      </section>
     </>
}