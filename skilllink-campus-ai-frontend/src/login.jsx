import "./login.css";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";


export default function Login() {
  
  const firebaseErrors = {
  "auth/invalid-email": "Invalid email address ❌",
  "auth/user-not-found": "User does not exist ❌",
  "auth/wrong-password": "Incorrect password ❌",
  "auth/too-many-requests": "Too many attempts, try later ⏳",
  "auth/network-request-failed": "Network error ❌",
};
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false);
  const[ErrorMessage  , setErrorMessage]=useState("");
const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const email = user.email;

    // نبعث الإيميل للباك
    const res = await fetch("http://localhost:5000/api/auth/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (res.ok) {
      setLoading(false);
      localStorage.setItem("token", data.token);
      navigate ("/dashboard");
    } else {
      setErrorMessage(data.error);
    }

  } catch (error) {
    console.log(error);
  }
};
const loginUser = async () => {
  
  try {
    setErrorMessage("");
    setLoading(true);
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const token = await cred.user.getIdToken();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate ("/dashboard");

    } else {
      setErrorMessage(data.error);
      setLoading(false);
    }

  } catch (err) {
   setErrorMessage(firebaseErrors[err.code] || "Login failed ❌");
    setLoading(false);
  }
};

const resetPassword = async () => {
  if (!email) {
    setErrorMessage("Enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setErrorMessage("Password reset email sent 📩");
  } catch (error) {
    setErrorMessage(firebaseErrors[error.code] || "Reset failed ❌");

  }
};
 

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome back</h1>
        <p className="subtitle">
          Please enter your details to access your account.
        </p>

        <label>Email Address</label>
        <input type="email" placeholder="name@company.com" onChange={(e)=>setEmail(e.target.value)}/>

        <label>Password</label>
        <input type="password" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)} />

        <div className="options">
          <a href="#" onClick={resetPassword}>
  Forgot password?
</a>

        </div>
       {ErrorMessage && (<div style={{ background:" #ffe5e5",color: "#b00020",padding:" 10px",
  borderRadius: "6px",marginBottom: "12px",fontWeight: "500"}} >{ErrorMessage}</div>
)}    
        <button className="signin-btn" onClick={loginUser}>{(loading)? "loading" :"Sign in"}</button>

        <div className="divider">Or continue with</div>

        {/* 👇 هنا ربطنا Google login */}
        <button className="social google" onClick={loginGoogle}>
          <img src="gmail.png" height="20px" alt="GMAIL"/>
          <div>Sign in with Google</div>
        </button>
        <p className="signup">
          Don't have an account? <Link to='/signup' >Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
