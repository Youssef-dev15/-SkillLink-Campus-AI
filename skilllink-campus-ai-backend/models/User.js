import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: {
  type: String,
  required: true,
  unique: true
},

isVerified: {
  type: Boolean,
  default: false
},

emailVerificationToken: {
  type: String
},


  avatarUrl: String,

  fieldOfStudy: String,

  availability: {
    type: String,
    enum: ["Full Time", "Evenings Only", "Weekends", "Flexible"],
    default: "Flexible"
  },

  skills: [
    {
      name: String,
      level: Number
    }
  ],

  strongSubjects: [String],
  weakSubjects: [String],

  targetJob: String,
  careerScore: Number,
  careerInsight: String,
  firebaseUid:String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
