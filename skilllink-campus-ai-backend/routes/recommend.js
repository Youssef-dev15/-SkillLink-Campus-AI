import express from "express";
import User from "../models/User.js";
import Event from "../models/Event.js";
import DailyTask from "../models/DailyTask.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search", auth, async (req, res) => {
  const q = req.query.q?.toLowerCase() || "";

  const me = await User.findOne({ email: req.user.email });

  const users = await User.find({
    fullName: { $regex: q, $options: "i" }
  }).limit(5);

  const events = await Event.find({
    fieldOfStudy: me.fieldOfStudy
  }).limit(5);

  const tasks = await DailyTask.find({
    userEmail: req.user.email
  }).limit(5);

  res.json({ users, events, tasks });
});
router.get("/dashboard", auth, async (req, res) => {
  try {
    const profile = await User.findOne({ email: req.user.email });

    const tasks = await DailyTask.find({
      userEmail: req.user.email
    }).limit(5);

    const events = await Event.find().limit(5);

    res.json({
      profile,
      tasks,
      events
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard error" });
  }
});

export default router;
