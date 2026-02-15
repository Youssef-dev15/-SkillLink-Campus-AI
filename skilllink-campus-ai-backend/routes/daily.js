import express from "express";
import Task from "../models/DailyTask.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

// GET only my tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find({ userEmail: req.user.email });
  res.json(tasks);
});

// CREATE
router.post("/", async (req, res) => {
  const task = new Task({
    ...req.body,
    userEmail: req.user.email
  });

  await task.save();
  res.json(task);
});

// TOGGLE
router.patch("/:id", async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userEmail: req.user.email
  });

  if (!task) return res.status(404).json({ msg: "Not found" });

  task.done = !task.done;
  await task.save();

  res.json(task);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Task.deleteOne({
    _id: req.params.id,
    userEmail: req.user.email
  });

  res.json({ success: true });
});

export default router;
