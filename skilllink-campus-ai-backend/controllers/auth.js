import { getCareerScore } from "../services/careerScore.ai.js";
import User from "../models/User.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/email.service.js";
import admin from "firebase-admin";


// CHECK EMAIL AVAILABILITY
export const checkEmail = async (req, res) => {
   const { email } = req.body;
  if (!email) { return res.status(400).json({ error: "Email is required" });
 } 
 const user = await User.findOne({ email }); 
 if (user) {
   return res.json({ exists: true });
   }
  res.json({ exists: false });
 };
export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const {
      fullName,
      email,
      fieldOfStudy,
      availability,
      skills,
      strongSubjects,
      weakSubjects,
      targetJob,
      avatarUrl,
      firebaseUid,
    } = req.body;
        // 🔴 check if email already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
    return res.status(400).json({
    error: "Email already exists"
  });
}

    console.log("STEP 1 OK");

    const normalizedSkills =
  Array.isArray(skills) && skills.length > 0
    ? skills.map(s => `${s.name} (level ${s.level})`)
    : [];

const profile = {
  fieldOfStudy,
  targetJob,
  availability,
  skills: normalizedSkills,
  strongSubjects,
  weakSubjects
};

console.log("PROFILE SENT TO AI:", profile);

const aiResult = await getCareerScore(profile);
console.log("AI RESULT:", aiResult);

    const emailToken = crypto.randomBytes(32).toString("hex");
    // 3️⃣ نخزّن اليوزر
    const user = await User.create({
      fullName,
      email,
      fieldOfStudy,
      availability,
      skills,
      strongSubjects,
      weakSubjects,
      targetJob,
      avatarUrl,
      careerScore: aiResult.careerScore,
      careerInsight: aiResult.reason,
      isVerified: false,
      emailVerificationToken: emailToken,
      firebaseUid :firebaseUid
    });
    await sendVerificationEmail(email, emailToken);

    res.status(201).json({
  message: "Account created. Please check your email to verify."
});


  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }


};
// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token
  });

  if (!user) {
    return res.redirect("http://localhost:5173/verify-failed");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.redirect("http://localhost:5173/verify-success");

};
export const login = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email} = decoded;

    // نلقى user في Mongo
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // منع الدخول لو مش verified
    if (! user.isVerified) {
      return res.status(403).json({
        error: "Verify your email first"
      });
    }

    // create your JWT
    const jwt = createJWT(user);

    res.json({ token: jwt });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
};

export const googleLogin = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  // لو ما عندوش حساب → نخلق واحد
  if (!user) {
    user = await User.create({
      email,
      fullName: "User",
      isVerified: true
    });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  res.json({ token });
};


function createJWT(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
export const profile= async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne(
      { email },
      "fullName email fieldOfStudy avatarUrl availability skills strongSubjects weakSubjects targetJob" // 👈 fields اللي ترجّع فقط
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const update= async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
