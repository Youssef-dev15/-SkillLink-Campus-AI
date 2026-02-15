import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  type: String,
  location: String,
  description: String,
  creatorEmail: String,
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
