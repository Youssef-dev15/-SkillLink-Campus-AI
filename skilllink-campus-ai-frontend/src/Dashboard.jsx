import "./dashboard.css";
import "./dashcomponents/Sidebar.css";
import "./dashcomponents/Topbar.css";
import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import{Outlet , NavLink, Link} from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";



export default function Dashboard() {
  
const searchRef= useRef(null);
const [user, setUser]=useState("");
const [searchQuery, setSearchQuery] = useState("");
const [isSearchFocused, setIsSearchFocused] = useState(false);
const handleLogout = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
  window.location.href = "/login";
};
const students = [
  {
    id: 1,
    name: "Sarah Benali",
    field: "Data Science",
    avatar: "https://picsum.photos/200?random=10",
  },
  {
    id: 2,
    name: "Lucas Martin",
    field: "Informatique",
    avatar: "https://picsum.photos/200?random=11",
  },
  {
    id: 3,
    name: "Emma Roy",
    field: "UX Design",
    avatar: "https://picsum.photos/200?random=12",
  },
];

const filteredStudents = students.filter((s) =>
  s.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    const decoded = jwtDecode(token);

    fetch("http://localhost:5000/api/auth/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email: decoded.email })
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setIsSearchFocused(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


const [open, setOpen] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "match",
      title: "New Match Found",
      description: "We found a student matching your interests.",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "ai",
      title: "AI Suggestion",
      description: "Your AI assistant has new recommendations.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 3,
      type: "event",
      title: "Upcoming Event",
      description: "Tech meetup starts tomorrow 🚀",
      time: "1h ago",
      read: true,
    },
  ]);



  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "match":
        return "🤝";
      case "ai":
        return "🤖";
      case "event":
        return "🚀";
      default:
        return "🔔";
    }
  };


  return (
    <div className="dashboard">
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-icon">S</div>
          <span style={{ display: "flex", alignItems: "center" }}>
            <span>SkillLink</span>
            <button className="menu-toggle" onClick={() => setOpen(!open)}>
              <img src="effacer.png" height="20" width="20" />
            </button>
          </span>
        </div>

        <nav className="menu">
         <NavLink to="/dashboard">{({ isActive }) => (<MenuItem icon="📊" text="Dashboard" active={isActive} />)}</NavLink>
          <NavLink to="/Daily-plan">{({ isActive }) => (<MenuItem icon=" 📅" text="Daily Plan" active={isActive} />)}</NavLink>
         <NavLink to="/profile">{({ isActive }) => (<MenuItem icon="👤" text="My Profile" active={isActive} />)}</NavLink>
         <NavLink to="/Smart-Matching">{({ isActive }) => ( <MenuItem icon="🤝" text="Smart Matching" active={isActive} />)}</NavLink>
          <NavLink to="/Messages">{({ isActive }) => (<MenuItem icon=" 💬" text="Messages" active={isActive} />)}</NavLink>
        <NavLink to="/Ai-assistant">{({ isActive }) => (<MenuItem icon="🤖" text="AI Assistant" active={isActive} />)}</NavLink>
        <NavLink to="/Quiz">{({ isActive }) => (<MenuItem icon="📝" text="Quiz" active={isActive} />)}</NavLink>
        <NavLink to="/Career-Fit">{({ isActive }) => (<MenuItem icon="🎯" text="Career Fit" active={isActive} />)}</NavLink>
        <NavLink to="/Event">{({ isActive }) => (<MenuItem icon="🏛" text="Event " active={isActive} />)}</NavLink>
        </nav>

        <div className="upgread-box">
          <button className="log-out" onClick={handleLogout}><img src="logout.png" width="24px"  height="24px"/> Log out</button>
        </div>
      </div>

      <div className="main">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setOpen(!open)}>
              ☰
            </button>
           <div className="search-container" ref={searchRef}>
  <span className="search-icon">🔍</span>
  <input
    type="text"
    placeholder="Search for a student..."
    className="search-input"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onFocus={() => setIsSearchFocused(true)}
  />

  {isSearchFocused && searchQuery.length > 0 && (
    <div className="search-results">
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <div key={student.id} className="student-item">
            <img src={student.avatar} className="student-avatar" />
            <div className="student-info">
              <p className="student-name">{student.name}</p>
              <span className="student-field">{student.field}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No students found</p>
      )}
    </div>
  )}
</div>

          </div>

          <div className="header-right">
            <div className="notification-wrapper">
              <button
                className="notification-btn"
                onClick={handleToggleNotifications}
              >
                🔔
                <span className="notification-dot"></span>
              </button>

              {showNotifications && (
                <div className="notification-panel">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-item ${
                          !n.read ? "unread" : ""
                        }`}
                      >
                        <div className="notification-icon">
                          {getIcon(n.type)}
                        </div>

                        <div className="notification-content">
                          <div className="notification-header">
                            <p className="notification-title">
                              {n.title}
                            </p>
                            <span className="notification-time">
                              {n.time}
                            </span>
                          </div>

                          <p className="notification-description">
                            {n.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <p className="empty-icon">📭</p>
                      <p className="empty-text">
                        Aucune nouvelle notification
                      </p>
                    </div>
                  )}

                  <div className="notification-footer">
                    <button className="history-btn">
                      Voir tout l'historique
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile">
              <div className="profile-text">
                <p className="profile-name">{user.email}  </p>
                <p className="profile-field">{user.fieldOfStudy}</p>
              </div>

              <Link to='/Profile'><img
                src={user.avatarUrl}
                alt="Avatar"
                className="avatar"
              /></Link>
            </div>
          </div>
        </header>

        <div className="content">
              <Outlet/>
          {/* <HeroCard />
          <div className="cards">
            <ProfileCard />
            <TargetCard />
            <EventsCard />
          </div> */}
        </div>
      </div>
    </div>
  );
}

const MenuItem = ({ icon, text, active }) => {
  return (
    <div className={`menu-item ${active ? "active" : ""}`}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};
