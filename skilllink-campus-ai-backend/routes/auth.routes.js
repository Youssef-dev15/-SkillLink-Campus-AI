import express from "express";
import {
  register,
  verifyEmail,
  checkEmail,
  login,
  googleLogin,
  profile,
  update,
  
} from "../controllers/auth.js"; 
import User from "../models/User.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// POST /api/auth/register
router.post("/register", register);
// POST /api/auth/check-email
router.post("/check-email", checkEmail);
//POST/API/AUTH/LOGIN-GOOGLE
router.post("/google-login", googleLogin);
//Post /api /auth/login
router.post("/login",login)
// GET /api/auth/verify-email/:token  🔥 المهمّة
router.get("/verify-email/:token", verifyEmail);

// User / profile 
router.post("/user/profile",profile )
// عحيضفث 
router.post("/update-profile",update)
 router.get("/search", auth, async (req, res) => {
  try {
    const q = req.query.q || "";

    const users = await User.find({
      fullName: { $regex: q, $options: "i" }
    }).limit(10);

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search error" });
  }
});
router.get("/users/all", auth, async (req, res) => {
  console.log("HEADERS:", req.headers);
  res.json({ ok: true });
});


export default router;
