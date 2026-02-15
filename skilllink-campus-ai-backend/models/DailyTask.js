import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  time: String,
  done: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium"
  },

  userEmail: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("DailyTask", dailyTaskSchema);
