import express from "express";
import { chatWithAI } from "../services/aiChat.js";



const router = express.Router(); 

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const reply = await chatWithAI(messages);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
