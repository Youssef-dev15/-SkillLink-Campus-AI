import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/auth.routes.js"; 
import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import eventRoutes from "./routes/events.js";
import dailyRoutes from "./routes/daily.js";
import recommendRoutes from "./routes/recommend.js";
import chatRoute from "./routes/chatRoute.js";
import { generateQuiz } from "./services/quiz.js";


const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-service-account.json", "utf8")
);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});





const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api/events", eventRoutes);
app.use("/api/daily", dailyRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api", chatRoute);
app.post("/generate-quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    const quiz = await generateQuiz(topic);

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
});
// connect DB
connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
