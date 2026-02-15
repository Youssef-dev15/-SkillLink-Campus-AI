import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword]= useState(false);
  const [showPassword1, setShowPassword1]= useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  domaine: "",
  availability: "Full Time",
  targetJob: "",
  avatarUrl: "",
  firebaseUid:"",
});


  const [skills, setSkills] = useState([]);
  const [strongSubjects, setStrongSubjects] = useState([]);
  const [weakSubjects, setWeakSubjects] = useState([]);

  const [skillInput, setSkillInput] = useState("");
  const [strongInput, setStrongInput] = useState("");
  const [weakInput, setWeakInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return regex.test(password);
};


const handleImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // preview
  setProfilePic(URL.createObjectURL(file));

  // upload
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "profile_pics");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dh7woxjoz/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();

  setFormData({
    ...formData,
    avatarUrl: result.secure_url
  });
};


  const addTag = (type) => {
    if (type === "skills" && skillInput.trim()) {
  setSkills([
    ...skills,
    { name: skillInput.trim(), level: 1 } // default level
  ]);
  setSkillInput("");
}

    if (type === "strong" && strongInput.trim()) {
      setStrongSubjects([...strongSubjects, strongInput.trim()]);
      setStrongInput("");
    }
    if (type === "weak" && weakInput.trim()) {
      setWeakSubjects([...weakSubjects, weakInput.trim()]);
      setWeakInput("");
    }
  };

  const removeTag = (type, index) => {
    if (type === "skills") setSkills(skills.filter((_, i) => i !== index));
    if (type === "strong") setStrongSubjects(strongSubjects.filter((_, i) => i !== index));
    if (type === "weak") setWeakSubjects(weakSubjects.filter((_, i) => i !== index));
  };

  {/* Submiit */}
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  setLoading(true); 
   if (!validatePassword(formData.password)) {
    alert("Password weak ❌");
    setLoading(false);
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    setErrorMessage("");
    setLoading(false); 
    return;
  }

  try {
    const firebaseUser= await createUserWithEmailAndPassword(
    auth,
    formData.email,
    formData.password,
  );
  const uid= firebaseUser.user.uid;
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          fieldOfStudy: formData.domaine,
          availability: formData.availability,
          skills,
          strongSubjects,
          weakSubjects,
          targetJob: formData.targetJob,
          avatarUrl: formData.avatarUrl,
          firebaseUid: uid
        })
      }
    );

    if (!response.ok) {
  const errorData = await response.json();
  setErrorMessage(errorData.error); 
  setLoading(false); 
  return;
}


    const data = await response.json();
    console.log("REGISTERED USER:", data);
    setErrorMessage("");
    setLoading(false); 
    navigate("/login");


  } catch (error) {
  if (error.code === "auth/email-already-in-use") {
     setErrorMessage("Email already used ❌");
     setLoading(false); 
  } else if (error.code === "auth/invalid-email") {
     setErrorMessage("Invalid email ❌");
     setLoading(false); 
  } else if (error.code === "auth/weak-password") {
     setErrorMessage("Password too weak ❌");
     setLoading(false); 
  } else {
     setErrorMessage("Something went wrong ❌");
     setLoading(false); 
  }
}


};

{/* -------------------------------------*/}

  return (
    <div className="signup-page">
      <div className="signup-container">

        <div className="signup-header">
          <h1>Create Your Smart Profile</h1>
          <p>Join the community and let AI boost your learning.</p>
        </div>

        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="signup-grid">

            {/* Sidebar */}
            <div className="signup-sidebar">
              <div
                className="profile-picture"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" />
                ) : (
                  <img src="user.png" alt="Default profile" />
                )}
                <div className="profile-overlay">Edit</div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
                accept="image/*"
              />

              <h3 className="sidebar-name">{formData.name || "New Member"}</h3>
              <p className="sidebar-domain">{formData.domaine || "Field of Study"}</p>
            </div>

            {/* Main content */}
            <div className="signup-content">

              {/* Personal Information */}
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-grid">
                  <input
                    className="form-input"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <input
                    className="form-input"
                    placeholder="Academic Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="form-section">
                <h4>Security</h4>
                <div className="form-grid">
                  <div style={{display:"flex"}}> 
                  <input
                    className="form-input"
                    type={showPassword ?"text":"password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <span className="spann" onClick={()=> setShowPassword(!showPassword)} 
                    style={{transform :"translateX(-30px)",marginTop:"3px", cursor:"pointer"}}> {showPassword ? "◡" : "👁"} </span>
                  </div><div style={{display:"flex"}}><input
                    className="form-input"
                    type={showPassword1?"text":"password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <span  className="spann" onClick={()=> setShowPassword1(!showPassword1)} 
                    style={{transform :"translateX(-30px)",marginTop:"3px", cursor:"pointer"}}> {showPassword1 ? "◡" : "👁"} </span>
                </div></div>
              </div>

              {/* Academic Profile */}
              <div className="form-section">
                <h4>Academic Profile</h4>
                <div className="form-grid">
                  <input
                    className="form-input"
                    placeholder="Field of Study"
                    value={formData.domaine}
                    onChange={(e) =>
                      setFormData({ ...formData, domaine: e.target.value })
                    }
                   
                  />
                  <select
                    className="form-input"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                  >
                    <option>Full Time</option>
                    <option>Evenings Only</option>
                    <option>Weekends</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>
              {/*carrer goals */}
              <div className="form-section">
                <h4>Career Goal</h4>
           <input className="form-input" placeholder="Target Job (e.g. Software Engineer)" value={formData.targetJob}  onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })}/></div>

              {/* Skills */}
              <div className="form-section">
                <h4>Skills</h4>
                <div className="tag-list">
                  {skills.map((skill, i) => (
  <div key={i} className="skill-item">
    <span className="tag tag-skill">
      {skill.name}
      <button
        type="button"
        className="remove"
        onClick={() => removeTag("skills", i)}
      >
        ×
      </button>
    </span>

    <input
      type="range"
      min="1"
      max="5"
      value={skill.level}
      onChange={(e) => {
        const updatedSkills = [...skills];
        updatedSkills[i].level = e.target.value;
        setSkills(updatedSkills); }} />

           <span className="skill-level">{skill.level}/5</span>
            </div>))}

                </div>
                <div className="tag-input">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag("skills"))
                    }
                    placeholder="Add a skill"
                  />
                  <button type="button" className="btn-sk" onClick={() => addTag("skills")}>
                    +
                  </button>
                </div>
              </div>

              {/* Strong Subjects */}
              <div className="form-section">
                <h4 className="strong-title">Strong Subjects</h4>
                <div className="tag-list">
                  {strongSubjects.map((s, i) => (
                    <span key={i} className="tag tag-strong">
                      {s}
                      <button type="button" className="remove" onClick={() => removeTag("strong", i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="tag-input">
                  <input
                    value={strongInput}
                    onChange={(e) => setStrongInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag("strong"))
                    }
                    placeholder="Add a strong subject"
                  />
                  <button type="button" className="btn-strong" onClick={() => addTag("strong")}>
                    +
                  </button>
                </div>
              </div>

              {/* Weak Subjects */}
              <div className="form-section">
                <h4 className="weak-title">Subjects to Improve</h4>
                <div className="tag-list">
                  {weakSubjects.map((s, i) => (
                    <span key={i} className="tag tag-weak">
                      {s}
                      <button type="button"  className="remove"  onClick={() => removeTag("weak", i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="tag-input">
                  <input
                    value={weakInput}
                    onChange={(e) => setWeakInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag("weak"))
                    }
                    placeholder="Add a difficult subject"
                  />
                  <button type="button" className="btn-weak" onClick={() => addTag("weak")}>
                    +
                  </button>
                </div>
              </div>
                    {errorMessage && (
       <div className="error-message">
           {errorMessage}
       </div>)}

              <button className="submit-btn" type="submit" disabled={loading}>
  {loading ? "Creating account..." : "Complete Registration"}
  </button>
            </div>
             
        </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
