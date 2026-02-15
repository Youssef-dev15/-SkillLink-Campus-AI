// Home.jsx
import React from "react";
import "./home.css";
import{Outlet , Link , Navigate } from "react-router-dom";


export default function Home() {
 const token =localStorage.getItem("token");
 if(token){
    return <Navigate to="/dashboard" replace/>;
 } 
  return (
      <div className="app">

        {/* ===== Header ===== */}
        <header className="header12">
          {/* Logo */}
          <Link to="/" className="logo-link">
          <div className="logo">
      <div className="logo-icon"><img src="logo.png" width="35px" height="35px" style={{borderRadius:"30px"}}/></div>

      <div className="logo-text">
        <span className="logo-main">SkillLink</span>
        <span className="logo-sub">Campus AI</span>
      </div>
    </div>

          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How it works</Link>
          </nav>

          {/* Actions */}
          <div className="actions1">
            <Link to="/login" className="login">Login</Link>
            <Link to="/signup" className="btn-primary">
              Join for Free
            </Link>
          </div>
        </header>

        {/* ===== Routes ===== */}
        <div className="page-content">
   <Outlet/>
          </div>
        {/* ===== Footer ===== */}
        <footer className="footer">
          <div className="footer-left">
            <img src="/logo.png"  alt="SkillLink Logo" width="35px" height="35px" style={{borderRadius:"30px"}} />
            <span className="brand">SkillLink</span>
          </div>

          <div className="footer-center">
            © 2026 SkillLink Campus AI. All rights reserved.
          </div>

          <div className="footer-right">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </footer>

      </div>
  );
}
