import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const chatWithAI = async (messages) => {
  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
  });

  return completion.choices[0].message.content;
};
