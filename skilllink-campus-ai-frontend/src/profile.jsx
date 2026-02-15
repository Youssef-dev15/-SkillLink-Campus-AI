import React, { useState, useEffect, useRef } from "react";
import "./ProfileView.css";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [uploading, setUploading] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [newWeak, setNewWeak] = useState("");
  const [newskill, setNewskill] = useState("");
  const [skillLevel, setSkillLevel] = useState(3); // ✅ NEW
  const [preview, setPreview] = useState(null);
  const [notif, setNotif] = useState({ message: "", type: "" });

  const fileInputRef = useRef(null);

  const showNotification = (message, type = "success", duration = 3000) => {
    setNotif({ message, type });
    setTimeout(() => setNotif({ message: "", type: "" }), duration);
  };

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);

    fetch("http://localhost:5000/api/auth/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: decoded.email })
    })
      .then(res => res.json())
      .then(data => setLocalProfile(data));
  }, []);

  if (!localProfile) return <div>Loading...</div>;

  /* ---------------- IMAGE UPLOAD ---------------- */

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !(file instanceof Blob)) {
      showNotification("Invalid file ❌", "error");
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "profile_pics");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dh7woxjoz/image/upload",
        { method: "POST", body: data }
      );

      const result = await res.json();

      if (!result.secure_url) {
        showNotification("Upload failed ❌", "error");
        return;
      }

      setLocalProfile(prev => ({
        ...prev,
        avatarUrl: result.secure_url,
      }));

    } catch (err) {
      console.error("Upload error:", err);
    }

    setUploading(false);
  };

  /* ---------------- FORM HANDLING ---------------- */

  const handleChange = (e) => {
    setLocalProfile({
      ...localProfile,
      [e.target.name]: e.target.value,
    });
  };

  const addStrong = () => {
    if (!newSubject) return;
    setLocalProfile({
      ...localProfile,
      strongSubjects: [...localProfile.strongSubjects, newSubject],
    });
    setNewSubject("");
  };

  const addWeak = () => {
    if (!newWeak) return;
    setLocalProfile({
      ...localProfile,
      weakSubjects: [...localProfile.weakSubjects, newWeak],
    });
    setNewWeak("");
  };

  /* ✅ NEW SKILL OBJECT */
  const addskill = () => {
    if (!newskill) return;

    const skillObj = {
      name: newskill,
      level: skillLevel
    };

    setLocalProfile({
      ...localProfile,
      skills: [...(localProfile.skills || []), skillObj],
    });

    setNewskill("");
    setSkillLevel(3);
  };

  const removeStrong = (item) => {
    setLocalProfile({
      ...localProfile,
      strongSubjects: localProfile.strongSubjects.filter(s => s !== item),
    });
  };

  const removeWeak = (item) => {
    setLocalProfile({
      ...localProfile,
      weakSubjects: localProfile.weakSubjects.filter(s => s !== item),
    });
  };

  const removeskill = (name) => {
    setLocalProfile({
      ...localProfile,
      skills: localProfile.skills.filter(s => s.name !== name),
    });
  };

  /* ---------------- SAVE ---------------- */

  const save = async () => {
    if (uploading) {
      showNotification("Image uploading... wait ⏳", "error");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localProfile),
    });

    await res.json();
    showNotification("Saved!", "success");
  };

  /* ---------------- TAG RENDER ---------------- */

  const strongTags = (localProfile.strongSubjects || []).map(s => (
    <span key={s} className="student-profile-tag student-profile-strong">
      {s}
      <button className="bt" onClick={() => removeStrong(s)}>×</button>
    </span>
  ));

  const weakTags = (localProfile.weakSubjects || []).map(s => (
    <span key={s} className="student-profile-tag student-profile-weak">
      {s}
      <button className="bt" onClick={() => removeWeak(s)}>×</button>
    </span>
  ));

  const skills = (localProfile.skills || []).map(s => (
    <span key={s.name} className="student-profile-tag student-profile-skill">
      {s.name} ⭐ {s.level}
      <button className="bt" onClick={() => removeskill(s.name)}>×</button>
    </span>
  ));

  /* ---------------- UI ---------------- */

  return (
    <div className="student-profile-wrapper">
      <div className="student-profile-card">

        <div className="student-profile-header">
          <div
            className="student-profile-avatar-container"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={preview || localProfile.avatarUrl || "https://picsum.photos/200"}
              alt="Avatar"
              className="student-profile-avatar"
            />

            <button className="student-profile-avatar-btn">Change</button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
              accept="image/*"
            />
          </div>

          <div>
            <h2 className="student-profile-name">{localProfile.fullName}</h2>
            <p className="student-profile-field">{localProfile.fieldOfStudy}</p>
          </div>
        </div>

        <div className="student-profile-grid">

          <div className="student-profile-column">
            <label>Field of study</label>
            <input name="fieldOfStudy" value={localProfile.fieldOfStudy} onChange={handleChange} className="student-profile-input" />
            <label>Availability</label>
            <input name="availability" value={localProfile.availability} onChange={handleChange} className="student-profile-input" />
            <label>Target Job</label>
            <input name="targetJob" value={localProfile.targetJob} onChange={handleChange} className="student-profile-input" />
          </div>

          <div className="student-profile-column">

            <label>Strong subjects</label>
            <div className="student-profile-tags">{strongTags}</div>
            <div className="student-profile-tag-input">
              <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
              <button onClick={addStrong} className="student-profile-btn green">+</button>
            </div>

            <label>Weak subjects</label>
            <div className="student-profile-tags">{weakTags}</div>
            <div className="student-profile-tag-input">
              <input value={newWeak} onChange={(e) => setNewWeak(e.target.value)} />
              <button onClick={addWeak} className="student-profile-btn red">+</button>
            </div>

            <label>Skills</label>
            <div className="student-profile-tags">{skills}</div>
            <div className="student-profile-tag-input">
              <input value={newskill} onChange={(e) => setNewskill(e.target.value)} />

              {/* ✅ RANGE */}
              <input
                type="range"
                min="1"
                max="5"
                value={skillLevel}
                onChange={(e) => setSkillLevel(Number(e.target.value))}
              />

              <span>Level: {skillLevel}</span>

              <button onClick={addskill} className="student-profile-btn blue">+</button>
            </div>

          </div>
        </div>

        <div className="student-profile-footer">
          <button className="student-profile-btn cancel" onClick={() => window.location.reload()}>
            Cancel
          </button>
          <button onClick={save} className="student-profile-btn save">
            Save
          </button>
        </div>

      </div>

      {notif.message && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: notif.type === "success" ? "#4BB543" : "#FF4C4C",
            color: "#fff",
            padding: "20px 30px",
            borderRadius: "10px",
            zIndex: 9999,
            fontWeight: "bold",
          }}
        >
          {notif.message}
        </div>
      )}
    </div>
  );
}
